import { useEffect, useMemo, useState } from "react";
import {
  SorobanRpc,
  Contract,
  Address,
  nativeToScVal,
  scValToNative,
  TransactionBuilder,
  BASE_FEE
} from "@stellar/stellar-sdk";
import { getAddress, isConnected, requestAccess, signTransaction } from "@stellar/freighter-api";
import ProgressBar from "./components/ProgressBar";
import EventFeed from "./components/EventFeed";
import {
  TASK_REGISTRY_ADDRESS,
  STELLAR_RPC_URL,
  STELLAR_NETWORK,
  parseTask,
  formatStellarAddress,
  isValidStellarContractId
} from "./lib/contract";
import { clearCachedTasks, readCachedTasks, writeCachedTasks } from "./lib/cache";

function getSimulationErrorMessage(simResp) {
  if (!simResp) return "unknown simulation error";
  if (simResp.error && typeof simResp.error === "string") return simResp.error;
  if (simResp.result?.error && typeof simResp.result.error === "string") return simResp.result.error;
  try {
    return JSON.stringify(simResp);
  } catch {
    return "simulation failed with non-serializable response";
  }
}

function getTransactionXdr(txOrBuilder) {
  const tx = typeof txOrBuilder?.build === "function" ? txOrBuilder.build() : txOrBuilder;

  if (typeof tx?.toXDR === "function") {
    return tx.toXDR();
  }

  if (typeof tx?.toEnvelope === "function") {
    return tx.toEnvelope().toXDR("base64");
  }

  throw new Error("Unable to serialize transaction for wallet signing");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getTransactionStatusXdrSafe(rpcUrl, hash) {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "getTransaction",
      params: { hash }
    })
  });

  if (!response.ok) {
    throw new Error(`RPC HTTP error: ${response.status}`);
  }

  const payload = await response.json();
  if (payload.error) {
    return { status: "NOT_FOUND", error: payload.error };
  }

  return payload.result || { status: "NOT_FOUND" };
}

async function waitForTransaction(rpcUrl, hash, maxAttempts = 40, delayMs = 1500) {
  let lastResult = { status: "NOT_FOUND" };

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const result = await getTransactionStatusXdrSafe(rpcUrl, hash);
    lastResult = result || { status: "NOT_FOUND" };

    if (lastResult.status === "SUCCESS" || lastResult.status === "FAILED") {
      return lastResult;
    }

    if (lastResult.status === "NOT_FOUND" || lastResult.status === "PENDING") {
      await sleep(delayMs);
      continue;
    }

    return lastResult;
  }

  return lastResult;
}

async function sendSignedTransactionXdr(rpcUrl, signedTxXdr) {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "sendTransaction",
      params: { transaction: signedTxXdr }
    })
  });

  if (!response.ok) {
    throw new Error(`RPC HTTP error: ${response.status}`);
  }

  const payload = await response.json();
  if (payload.error) {
    throw new Error(`RPC sendTransaction error: ${JSON.stringify(payload.error)}`);
  }

  return payload.result;
}

export default function App() {
  const [account, setAccount] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [status, setStatus] = useState("Connect your wallet to begin.");
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sorobanServer, setSorobanServer] = useState(null);
  const [rewardBalance, setRewardBalance] = useState(0);

  const shortAccount = useMemo(() => {
    if (!account) return "";
    return `${account.slice(0, 6)}…${account.slice(-4)}`;
  }, [account]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.done).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  // Initialize Soroban RPC server
  useEffect(() => {
    try {
      const server = new SorobanRpc.Server(STELLAR_RPC_URL);
      setSorobanServer(server);
    } catch (error) {
      setStatus("Failed to initialize Soroban connection");
    }
  }, []);

  // Check for Freighter wallet availability
  useEffect(() => {
    const checkFreighter = async () => {
      try {
        const result = await isConnected();
        if (result?.isConnected) {
          setStatus("Freighter detected. Click Connect to begin.");
          return;
        }
      } catch (error) {
        console.error("Freighter availability check failed:", error);
      }

      setStatus("Freighter wallet not found. Please install it from freighter.app and refresh.");
    };

    checkFreighter();
  }, []);

  // Fetch reward balance (read-only sim)
  async function fetchRewardBalance() {
    if (!account || !sorobanServer || !TASK_REGISTRY_ADDRESS) return;
    try {
      const contract = new Contract(TASK_REGISTRY_ADDRESS, {});
      const accountData = await sorobanServer.getAccount(account);

      const builder = new TransactionBuilder(accountData, {
        fee: BASE_FEE,
        networkPassphrase: STELLAR_NETWORK
      });

      const op = contract.call("get_reward_balance", new Address(account).toScVal());
      builder.addOperation(op);
      const tx = builder.setTimeout(30).build();

      const simResp = await sorobanServer.simulateTransaction(tx);
      if (SorobanRpc.Api.isSimulationSuccess(simResp) && simResp.result?.retval) {
        const bal = scValToNative(simResp.result.retval);
        setRewardBalance(Number(bal));
      }
    } catch (err) {
      // Silently fail for reward balance — contract may not have the method yet
      console.debug("Reward balance fetch:", err.message);
    }
  }

  async function connectWallet() {
    try {
      setStatus("🔗 Connecting to Freighter...");

      const connected = await isConnected();
      if (!connected?.isConnected) {
        throw new Error("Freighter extension not available. Please install and enable it.");
      }

      const accessResult = await requestAccess();
      if (accessResult?.error) {
        const reason = accessResult.error.message || "Freighter denied access";
        throw new Error(`Wallet permission required: ${reason}`);
      }

      let publicKey = accessResult?.publicKey || "";
      if (!publicKey) {
        const addressResult = await getAddress();
        if (addressResult?.error) {
          throw new Error(addressResult.error.message || "Failed to read public key from Freighter");
        }
        publicKey = addressResult?.address || "";
      }
      
      if (!publicKey) {
        throw new Error("Failed to get public key from Freighter");
      }

      formatStellarAddress(publicKey);
      setAccount(publicKey);
      setStatus("✅ Wallet connected successfully!");
      console.log("Connected account:", publicKey);
      
      setTimeout(() => fetchTasks(true), 500);
    } catch (error) {
      const message = error.message || "Failed to connect wallet";
      setStatus("❌ " + message);
      console.error("Wallet connection error:", error);
    }
  }

  function disconnectWallet() {
    setAccount("");
    setTasks([]);
    setRewardBalance(0);
    setStatus("Wallet disconnected. Connect again to continue.");
  }

  async function fetchTasks(force = false) {
    if (!account || !sorobanServer) return;

    const cached = force ? null : readCachedTasks(account);
    if (cached && cached.length > 0) {
      setTasks(cached);
      setStatus("Loaded tasks from cache.");
      return;
    }

    setIsFetching(true);
    try {
      if (!TASK_REGISTRY_ADDRESS) {
        throw new Error("Missing VITE_CONTRACT_ADDRESS in frontend env");
      }
      if (!isValidStellarContractId(TASK_REGISTRY_ADDRESS)) {
        throw new Error("Invalid contract ID in build env.");
      }

      const contract = new Contract(TASK_REGISTRY_ADDRESS, {});
      const accountData = await sorobanServer.getAccount(account);
      
      let builder = new TransactionBuilder(accountData, {
        fee: BASE_FEE,
        networkPassphrase: STELLAR_NETWORK
      });

      const getIdsOp = contract.call(
        "get_user_task_ids",
        new Address(account).toScVal(),
      );

      builder.addOperation(getIdsOp);
      const tx = builder.setTimeout(30).build();

      const simResp = await sorobanServer.simulateTransaction(tx);
      if (SorobanRpc.Api.isSimulationError(simResp)) {
        throw new Error("Failed to simulate getMyTaskIds");
      }

      if (
        SorobanRpc.Api.isSimulationSuccess(simResp) &&
        simResp.result?.retval
      ) {
        const idsVal = simResp.result.retval;
        const ids = scValToNative(idsVal);

        if (!Array.isArray(ids)) {
          setTasks([]);
          writeCachedTasks(account, []);
          setStatus("No tasks found.");
          return;
        }

        const items = await Promise.all(
          ids.map(async (id) => {
            try {
              const getTaskBuilder = new TransactionBuilder(accountData, {
                fee: BASE_FEE,
                networkPassphrase: STELLAR_NETWORK
              });

              const getTaskOp = contract.call(
                "get_task",
                nativeToScVal(id, { type: "u64" })
              );

              getTaskBuilder.addOperation(getTaskOp);
              const taskTx = getTaskBuilder.setTimeout(30).build();

              const simTaskResp = await sorobanServer.simulateTransaction(taskTx);
              
              if (
                SorobanRpc.Api.isSimulationSuccess(simTaskResp) &&
                simTaskResp.result?.retval
              ) {
                const taskVal = simTaskResp.result.retval;
                const nativeTask = scValToNative(taskVal);
                return parseTask(nativeTask);
              }

              return null;
            } catch (err) {
              console.error(`Error fetching task ${id}:`, err);
              return null;
            }
          })
        );

        const validTasks = items.filter((t) => t !== null);
        validTasks.sort((a, b) => b.id - a.id);
        setTasks(validTasks);
        writeCachedTasks(account, validTasks);
        setStatus(`Loaded ${validTasks.length} task(s) from chain.`);
      } else {
        setTasks([]);
        writeCachedTasks(account, []);
        setStatus("No tasks found.");
      }

      // Also refresh reward balance
      fetchRewardBalance();
    } catch (error) {
      const message = error.message || "Could not load tasks.";
      setStatus(message);
      console.error("Fetch tasks error:", error);
    } finally {
      setIsFetching(false);
    }
  }

  async function handleCreateTask(event) {
    event.preventDefault();
    if (!newTask.trim()) return;

    setIsSubmitting(true);
    try {
      const connected = await isConnected();
      if (!connected?.isConnected) throw new Error("Freighter wallet not connected");

      if (!account || !sorobanServer) {
        throw new Error("Wallet not connected or Soroban server not initialized");
      }

      if (!TASK_REGISTRY_ADDRESS || !isValidStellarContractId(TASK_REGISTRY_ADDRESS)) {
        throw new Error("Invalid or missing contract address");
      }

      setStatus("Preparing transaction...");

      const contract = new Contract(TASK_REGISTRY_ADDRESS, {});
      const accountData = await sorobanServer.getAccount(account);

      const builder = new TransactionBuilder(accountData, {
        fee: BASE_FEE,
        networkPassphrase: STELLAR_NETWORK
      });

      const createOp = contract.call(
        "create_task",
        new Address(account).toScVal(),
        nativeToScVal(newTask.trim(), { type: "string" })
      );

      builder.addOperation(createOp);
      const tx = builder.setTimeout(30).build();

      setStatus("Simulating transaction...");
      const simResp = await sorobanServer.simulateTransaction(tx);

      if (!SorobanRpc.Api.isSimulationSuccess(simResp)) {
        throw new Error(`Simulation failed: ${getSimulationErrorMessage(simResp)}`);
      }

      const assembled = SorobanRpc.assembleTransaction(tx, simResp);
      const unsignedTxXdr = getTransactionXdr(assembled);

      setStatus("Waiting for signature...");
      const signResult = await signTransaction(unsignedTxXdr, {
        networkPassphrase: STELLAR_NETWORK,
        address: account
      });
      const signedTxn = signResult?.signedTxXdr;
      if (!signedTxn) throw new Error(signResult?.error || "Freighter signature failed");

      setStatus("Submitting transaction...");
      const txResponse = await sendSignedTransactionXdr(STELLAR_RPC_URL, signedTxn);

      if (!txResponse?.hash) {
        throw new Error(`No hash returned: ${JSON.stringify(txResponse)}`);
      }

      if (txResponse.status === "ERROR") {
        throw new Error(`Submission failed: ${JSON.stringify(txResponse)}`);
      }

      const txResult = await waitForTransaction(STELLAR_RPC_URL, txResponse.hash);

      if (txResult.status === "FAILED") {
        throw new Error(`Transaction failed on chain`);
      }

      if (txResult.status !== "SUCCESS") {
        throw new Error(`Unexpected status: ${txResult.status}`);
      }

      setNewTask("");
      clearCachedTasks(account);
      setStatus("✅ Task created successfully! Refreshing...");
      
      await sleep(1000);
      await fetchTasks(true);
    } catch (error) {
      setStatus("❌ " + (error.message || "Failed to create task"));
      console.error("Create task error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleTask(id) {
    setIsSubmitting(true);
    try {
      const connected = await isConnected();
      if (!connected?.isConnected) throw new Error("Freighter wallet not connected");

      if (!account || !sorobanServer) {
        throw new Error("Wallet not connected");
      }

      if (!TASK_REGISTRY_ADDRESS || !isValidStellarContractId(TASK_REGISTRY_ADDRESS)) {
        throw new Error("Invalid or missing contract address");
      }

      setStatus("Preparing toggle transaction...");

      const contract = new Contract(TASK_REGISTRY_ADDRESS, {});
      const accountData = await sorobanServer.getAccount(account);

      const builder = new TransactionBuilder(accountData, {
        fee: BASE_FEE,
        networkPassphrase: STELLAR_NETWORK
      });

      const toggleOp = contract.call(
        "toggle_task",
        new Address(account).toScVal(),
        nativeToScVal(id, { type: "u64" })
      );

      builder.addOperation(toggleOp);
      const tx = builder.setTimeout(30).build();

      setStatus("Simulating transaction...");
      const simResp = await sorobanServer.simulateTransaction(tx);

      if (!SorobanRpc.Api.isSimulationSuccess(simResp)) {
        throw new Error(`Simulation failed: ${getSimulationErrorMessage(simResp)}`);
      }

      const assembled = SorobanRpc.assembleTransaction(tx, simResp);
      const unsignedTxXdr = getTransactionXdr(assembled);

      setStatus("Waiting for signature...");
      const signResult = await signTransaction(unsignedTxXdr, {
        networkPassphrase: STELLAR_NETWORK,
        address: account
      });
      const signedTxn = signResult?.signedTxXdr;
      if (!signedTxn) throw new Error(signResult?.error || "Freighter signature failed");

      setStatus("Submitting transaction...");
      const txResponse = await sendSignedTransactionXdr(STELLAR_RPC_URL, signedTxn);

      if (!txResponse?.hash) {
        throw new Error(`No hash returned`);
      }

      if (txResponse.status === "ERROR") {
        throw new Error(`Submission failed`);
      }

      const txResult = await waitForTransaction(STELLAR_RPC_URL, txResponse.hash);

      if (txResult.status === "FAILED") {
        throw new Error(`Transaction failed on chain`);
      }

      if (txResult.status !== "SUCCESS") {
        throw new Error(`Unexpected status: ${txResult.status}`);
      }

      clearCachedTasks(account);
      setStatus("✅ Task updated! Refreshing...");
      
      await sleep(1000);
      await fetchTasks(true);
    } catch (error) {
      setStatus("❌ " + (error.message || "Failed to update task"));
      console.error("Toggle task error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      {/* ── Brand Bar ── */}
      <div className="brand-bar">
        <span className="brand-logo">⛓️</span>
        <h1>TaskChain Mini</h1>
        <span className="network-badge">
          <span className="pulse-dot" />
          Stellar Testnet
        </span>
      </div>

      {/* ── Wallet Connection ── */}
      <section className="card">
        <div className="wallet-bar">
          {account ? (
            <div className="wallet-info">
              <span className="wallet-icon">🔑</span>
              {shortAccount}
            </div>
          ) : (
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Connect your Freighter wallet to manage tasks on-chain
            </p>
          )}

          <div className="wallet-actions">
            {!account ? (
              <button
                className="btn btn-primary"
                onClick={connectWallet}
                disabled={isSubmitting}
              >
                🦊 Connect Freighter
              </button>
            ) : (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={() => fetchTasks(true)}
                  disabled={isFetching || isSubmitting}
                >
                  {isFetching ? "⏳ Loading..." : "🔄 Refresh"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={disconnectWallet}
                >
                  Disconnect
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Stats Dashboard ── */}
      {account && (
        <section className="card">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-value">{taskStats.total}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{taskStats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-value">{taskStats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🪙</div>
              <div className="stat-value">{rewardBalance}</div>
              <div className="stat-label">Rewards</div>
            </div>
          </div>
        </section>
      )}

      {/* ── Create Task ── */}
      {account && (
        <section className="card">
          <div className="section-header">
            <span className="section-icon">➕</span>
            <h2>Create Task</h2>
          </div>

          <ProgressBar visible={isSubmitting} label="Waiting for blockchain confirmation" />

          <form className="task-form" onSubmit={handleCreateTask}>
            <div className="form-row">
              <input
                id="task-content"
                type="text"
                placeholder="What needs to be done on-chain?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                disabled={!account || isSubmitting}
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={!account || isSubmitting || !newTask.trim()}
              >
                ✨ Add Task
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ── Task List ── */}
      {account && (
        <section className="card">
          <div className="section-header">
            <span className="section-icon">📝</span>
            <h2>Your Tasks</h2>
            {tasks.length > 0 && (
              <span className="section-count">{tasks.length}</span>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📭</div>
              <p>No tasks yet. Create your first on-chain task above.</p>
            </div>
          ) : (
            <ul className="task-list">
              {tasks.map((task, idx) => (
                <li
                  key={task.id}
                  className={task.done ? "done" : "pending"}
                  style={{ animationDelay: `${idx * 0.06}s` }}
                >
                  <span className="task-id">#{task.id}</span>
                  <div className="task-body">
                    <div className="task-content">{task.content}</div>
                    <div className="task-meta">
                      {task.done ? "✅ Completed" : "⏳ Pending"}
                      {task.createdAt > 0 && ` · Created at ledger time ${task.createdAt}`}
                    </div>
                  </div>
                  <button
                    className={`btn btn-sm ${task.done ? "btn-warning" : "btn-success"}`}
                    onClick={() => toggleTask(task.id)}
                    disabled={isSubmitting}
                  >
                    {task.done ? "↩ Undo" : "✓ Done"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* ── Event Feed ── */}
      {account && (
        <section className="card">
          <div className="section-header">
            <span className="section-icon">📡</span>
            <h2>Live Event Stream</h2>
          </div>
          <EventFeed account={account} />
        </section>
      )}

      {/* ── Status Bar ── */}
      <footer className="status-bar" style={{ width: "100%" }}>
        <span className="status-dot" />
        {status}
      </footer>
    </main>
  );
}
