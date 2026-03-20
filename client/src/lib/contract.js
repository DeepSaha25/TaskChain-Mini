export const TASK_REGISTRY_ABI = [
  "function createTask(string calldata content) external returns (uint256 id)",
  "function toggleTask(uint256 id) external",
  "function getTask(uint256 id) external view returns ((uint256 id, string content, bool done, address owner, uint256 createdAt))",
  "function getMyTaskIds() external view returns (uint256[] memory)"
];

export const TASK_REGISTRY_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
