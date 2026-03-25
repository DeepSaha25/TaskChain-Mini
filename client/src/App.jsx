import { useEffect, useMemo, useState } from "react";
import {
  SorobanRpc,
  Contract,
  Keypair,
  nativeToScval,
  scValToNative,
  Networks,
  TransactionBuilder,
  BASE_FEE
} from "@stellar/stellar-sdk";
import ProgressBar from "./components/ProgressBar";
import {
  TASK_REGISTRY_ADDRESS,
  STELLAR_RPC_URL,
  STELLAR_NETWORK,
  parseTask,
  formatStellarAddress
} from "./lib/contract";
import { clearCachedTasks, readCachedTasks, writeCachedTasks } from "./lib/cache";

const FREIGHTER_TIMEOUT = 3000; // 3 seconds for Freighter popup

export default function App() {
  const [account, setAccount] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [status, setStatus] = useState("Connect your wallet to begin.");
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sorobanServer, setSorobanServer] = useState(null);

  const shortAccount = useMemo(() => {
    if (!account) return "";
    return `${account.slice(0, 6)}...${account.slice(-4)}`;
  }, [account]);

  // Initialize Soroban RPC server
  useEffect(() => {
    try {
      const server = new SorobanRpc.Server(STELLAR_RPC_URL);
      setSorobanServer(server);
    } catch (error) {
      setStatus("Failed to initialize Soroban connection");
    }
  }, []);

  // Check for Freighter wallet on mount with retry
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    
    const checkFreighter = () => {
      if (window.freighter) {
        setStatus("Freighter detected. Click 'Connect Freighter' to begin.");
        console.log("✅ Freighter wallet found!");
      } else {
        retryCount++;
        if (retryCount < maxRetries) {
          // Retry in 500ms (Freighter might be injecting)
          setTimeout(checkFreighter, 500);
        } else {
          setStatus("Freighter wallet not found. Please install it from freighter.app to use this dApp.");
          console.warn("❌ Freighter wallet could not be detected after retries");
        }
      }
    };
    
    // Start checking with a small delay
    setTimeout(checkFreighter, 100);
  }, []);

  async function connectWallet() {
    // Final check before attempting connection
    if (!window.freighter) {
      setStatus("❌ Freighter wallet not detected. Is Freighter unlocked and on testnet?");
      console.error("window.freighter is undefined");
      return;
    }

    try {
      setStatus("🔗 Connecting to Freighter...");

      // Request user's public key from Freighter
      const publicKey = await window.freighter.getPublicKey();
      
      if (!publicKey) {
        throw new Error("Failed to get public key from Freighter");
      }

      // Verify it's a valid Stellar public key
      formatStellarAddress(publicKey);
      setAccount(publicKey);
      setStatus("✅ Wallet connected successfully!");
      console.log("Connected account:", publicKey);
      
      // Fetch tasks after connecting
      setTimeout(() => fetchTasks(true), 500);
    } catch (error) {
      const message = error.message || "Failed to connect wallet";
      setStatus("❌ Connection failed: " + message);
      console.error("Wallet connection error:", error);
    }
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

      // Create contract instance
      const contract = new Contract(TASK_REGISTRY_ADDRESS, {});

      // Build and invoke getMyTaskIds (read-only, doesn't require signing)
      const accountData = await sorobanServer.getAccount(account);
      
      // Build transaction to read task IDs
      let builder = new TransactionBuilder(accountData, {
        fee: BASE_FEE,
        networkPassphrase: STELLAR_NETWORK
      });

      // Build getMyTaskIds invocation
      const getIdsOp = contract.call(
        "get_my_task_ids",
      );

      builder.addOperation(getIdsOp);
      const tx = builder.setTimeout(30).build();

      // Simulate first to get resource fees
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

        // Fetch each task details
        const items = await Promise.all(
          ids.map(async (id) => {
            try {
              const getTaskBuilder = new TransactionBuilder(accountData, {
                fee: BASE_FEE,
                networkPassphrase: STELLAR_NETWORK
              });

              const getTaskOp = contract.call(
                "get_task",
                nativeToScval(id, { type: "u64" })
              );

              getTaskBuilder.addOperation(getTaskOp);
              const taskTx = getTaskBuilder.setTimeout(30).build();

              const simTaskResp = await sorobanServer.simulateTransaction(taskTx);
              
              if (
                SorobanRpc.Api.isSimulationSuccess(simTaskResp) &&
                simTaskResp.result?.retval
              ) {
                const taskVal = simTaskResp.result.retval;
                return parseTask(taskVal);
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
      if (!window.freighter) {
        throw new Error("Freighter wallet not connected");
      }

      if (!account || !sorobanServer) {
        throw new Error("Wallet not connected or Soroban server not initialized");
      }

      if (!TASK_REGISTRY_ADDRESS) {
        throw new Error("Missing contract address");
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
        nativeToScval(newTask.trim(), { type: "string" })
      );

      builder.addOperation(createOp);
      const tx = builder.setTimeout(30).build();

      // Simulate to get fees
      setStatus("Simulating transaction...");
      const simResp = await sorobanServer.simulateTransaction(tx);

      if (!SorobanRpc.Api.isSimulationSuccess(simResp)) {
        throw new Error("Transaction simulation failed");
      }

      // Assemble with resource fees
      const assembled = SorobanRpc.assembleTransaction(tx, simResp);

      // Sign with Freighter
      setStatus("Waiting for signature...");
      const signedTxn = await window.freighter.signTransaction(
        assembled.toEnvelope().toXDR(),
        STELLAR_NETWORK
      );

      // Send to network
      setStatus("Submitting transaction...");
      const txResponse = await sorobanServer.sendTransaction(signedTxn);

      // Poll for transaction completion
      let txResult = txResponse;
      while (txResult.status === "PENDING") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        txResult = await sorobanServer.getTransaction(txResult.hash);
      }

      if (txResult.status === "FAILED") {
        throw new Error("Transaction failed on chain");
      }

      if (txResult.status !== "SUCCESS") {
        throw new Error(`Unexpected transaction status: ${txResult.status}`);
      }

      setNewTask("");
      clearCachedTasks(account);
      setStatus("Task created successfully. Refreshing...");
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fetchTasks(true);
      setStatus("Task created successfully.");
    } catch (error) {
      const message = error.message || "Failed to create task";
      setStatus(message);
      console.error("Create task error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleTask(id) {
    setIsSubmitting(true);
    try {
      if (!window.freighter) {
        throw new Error("Freighter wallet not connected");
      }

      if (!account || !sorobanServer) {
        throw new Error("Wallet not connected or Soroban server not initialized");
      }

      if (!TASK_REGISTRY_ADDRESS) {
        throw new Error("Missing contract address");
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
        nativeToScval(id, { type: "u64" })
      );

      builder.addOperation(toggleOp);
      const tx = builder.setTimeout(30).build();

      // Simulate
      setStatus("Simulating transaction...");
      const simResp = await sorobanServer.simulateTransaction(tx);

      if (!SorobanRpc.Api.isSimulationSuccess(simResp)) {
        throw new Error("Transaction simulation failed");
      }

      const assembled = SorobanRpc.assembleTransaction(tx, simResp);

      // Sign
      setStatus("Waiting for signature...");
      const signedTxn = await window.freighter.signTransaction(
        assembled.toEnvelope().toXDR(),
        STELLAR_NETWORK
      );

      // Send
      setStatus("Submitting transaction...");
      const txResponse = await sorobanServer.sendTransaction(signedTxn);

      // Poll
      let txResult = txResponse;
      while (txResult.status === "PENDING") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        txResult = await sorobanServer.getTransaction(txResult.hash);
      }

      if (txResult.status === "FAILED") {
        throw new Error("Transaction failed on chain");
      }

      if (txResult.status !== "SUCCESS") {
        throw new Error(`Unexpected transaction status: ${txResult.status}`);
      }

      clearCachedTasks(account);
      setStatus("Task updated. Refreshing...");
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fetchTasks(true);
      setStatus("Task updated successfully.");
    } catch (error) {
      const message = error.message || "Failed to update task";
      setStatus(message);
      console.error("Toggle task error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="card">
        <header className="card-header">
          <h1>TaskChain Mini dApp</h1>
          <p>Manage your task list on Stellar blockchain with Freighter wallet.</p>
          <div className="header-actions">
            <button onClick={connectWallet} disabled={isSubmitting}>
              {account ? `Connected: ${shortAccount}` : "Connect Freighter"}
            </button>
            <button
              onClick={() => fetchTasks(true)}
              disabled={!account || isFetching || isSubmitting}
            >
              {isFetching ? "Loading..." : "Refresh Tasks"}
            </button>
          </div>
        </header>

        <ProgressBar visible={isSubmitting} label="Waiting for blockchain confirmation" />

        <form className="task-form" onSubmit={handleCreateTask}>
          <label htmlFor="task-content">New task</label>
          <div className="form-row">
            <input
              id="task-content"
              type="text"
              placeholder="e.g. Record Orange Belt demo"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              disabled={!account || isSubmitting}
            />
            <button type="submit" disabled={!account || isSubmitting || !newTask.trim()}>
              Add Task
            </button>
          </div>
        </form>

        <section className="task-list-section">
          <h2>Your Tasks</h2>
          {tasks.length === 0 ? (
            <p className="empty">No tasks yet. Create your first one.</p>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task.id} className={task.done ? "done" : "pending"}>
                  <div>
                    <strong>#{task.id}</strong>
                    <p>{task.content}</p>
                  </div>
                  <button onClick={() => toggleTask(task.id)} disabled={isSubmitting}>
                    Mark as {task.done ? "Pending" : "Done"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="status-bar">Status: {status}</footer>
      </section>
    </main>
  );
}
