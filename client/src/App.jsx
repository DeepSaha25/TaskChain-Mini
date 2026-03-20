import { useEffect, useMemo, useState } from "react";
import { BrowserProvider, Contract, getAddress, isAddress } from "ethers";
import ProgressBar from "./components/ProgressBar";
import { TASK_REGISTRY_ABI, TASK_REGISTRY_ADDRESS } from "./lib/contract";
import { clearCachedTasks, readCachedTasks, writeCachedTasks } from "./lib/cache";

const SEPOLIA_CHAIN_ID = 11155111n;

export default function App() {
  const [account, setAccount] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [status, setStatus] = useState("Connect your wallet to begin.");
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provider, setProvider] = useState(null);

  const shortAccount = useMemo(() => {
    if (!account) return "";
    return `${account.slice(0, 6)}...${account.slice(-4)}`;
  }, [account]);

  useEffect(() => {
    if (!window.ethereum) {
      setStatus("MetaMask not found. Please install it to use this dApp.");
    }
  }, []);

  async function ensureSepolia(nextProvider) {
    const network = await nextProvider.getNetwork();
    if (network.chainId === SEPOLIA_CHAIN_ID) return nextProvider;

    if (!window.ethereum) {
      throw new Error("MetaMask not found. Please install it to use this dApp.");
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }]
      });
    } catch (error) {
      throw new Error("Please switch MetaMask network to Sepolia and try again.");
    }

    return new BrowserProvider(window.ethereum);
  }

  async function connectWallet() {
    if (!window.ethereum) return;

    try {
      let nextProvider = new BrowserProvider(window.ethereum);
      await nextProvider.send("eth_requestAccounts", []);
      nextProvider = await ensureSepolia(nextProvider);
      const accounts = await nextProvider.send("eth_accounts", []);
      setProvider(nextProvider);
      setAccount(accounts[0]);
      setStatus("Wallet connected.");
    } catch (error) {
      setStatus(error.shortMessage || error.message || "Failed to connect wallet.");
    }
  }

  async function getContract(useSigner = false) {
    if (!provider) throw new Error("Wallet not connected");
    if (!TASK_REGISTRY_ADDRESS) throw new Error("Missing VITE_CONTRACT_ADDRESS in frontend env");

    const checkedProvider = await ensureSepolia(provider);
    if (checkedProvider !== provider) {
      setProvider(checkedProvider);
    }

    const rawAddress = TASK_REGISTRY_ADDRESS.trim();
    if (!isAddress(rawAddress)) {
      throw new Error("Invalid VITE_CONTRACT_ADDRESS. It must be a full 0x... address.");
    }
    const contractAddress = getAddress(rawAddress);

    if (useSigner) {
      const signer = await checkedProvider.getSigner();
      return new Contract(contractAddress, TASK_REGISTRY_ABI, signer);
    }

    return new Contract(contractAddress, TASK_REGISTRY_ABI, checkedProvider);
  }

  async function fetchTasks() {
    if (!account) return;

    const cached = readCachedTasks(account);
    if (cached) {
      setTasks(cached);
      setStatus("Loaded tasks from cache.");
      return;
    }

    setIsFetching(true);
    try {
      const contract = await getContract(false);
      const ids = await contract.getMyTaskIds();
      const items = await Promise.all(
        ids.map(async (id) => {
          const task = await contract.getTask(id);
          return {
            id: Number(task.id),
            content: task.content,
            done: task.done,
            createdAt: Number(task.createdAt)
          };
        })
      );

      items.sort((a, b) => b.id - a.id);
      setTasks(items);
      writeCachedTasks(account, items);
      setStatus(`Loaded ${items.length} task(s) from chain.`);
    } catch (error) {
      setStatus(error.shortMessage || error.message || "Could not load tasks.");
    } finally {
      setIsFetching(false);
    }
  }

  async function handleCreateTask(event) {
    event.preventDefault();
    if (!newTask.trim()) return;

    setIsSubmitting(true);
    try {
      const contract = await getContract(true);
      const signer = await contract.runner.getSigner();
      const signerAddress = await signer.getAddress();
      if (signerAddress.toLowerCase() !== account.toLowerCase()) {
        setAccount(signerAddress);
      }
      const tx = await contract.createTask(newTask.trim());
      setStatus("Transaction sent. Waiting for confirmation...");
      await tx.wait();

      clearCachedTasks(signerAddress);
      setNewTask("");
      await fetchTasks();
      setStatus("Task created successfully.");
    } catch (error) {
      setStatus(error.shortMessage || error.message || "Failed to create task.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleTask(id) {
    setIsSubmitting(true);
    try {
      const contract = await getContract(true);
      const signer = await contract.runner.getSigner();
      const signerAddress = await signer.getAddress();
      if (signerAddress.toLowerCase() !== account.toLowerCase()) {
        setAccount(signerAddress);
      }
      const tx = await contract.toggleTask(id);
      setStatus("Toggle submitted. Waiting for confirmation...");
      await tx.wait();

      clearCachedTasks(signerAddress);
      await fetchTasks();
      setStatus("Task updated successfully.");
    } catch (error) {
      setStatus(error.shortMessage || error.message || "Failed to update task.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="card">
        <header className="card-header">
          <h1>TaskChain Mini dApp</h1>
          <p>Manage your own task list on-chain with wallet-based ownership.</p>
          <div className="header-actions">
            <button onClick={connectWallet} disabled={isSubmitting}>
              {account ? `Connected: ${shortAccount}` : "Connect Wallet"}
            </button>
            <button onClick={fetchTasks} disabled={!account || isFetching || isSubmitting}>
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
