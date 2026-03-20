// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TaskRegistry {
    struct Task {
        uint256 id;
        string content;
        bool done;
        address owner;
        uint256 createdAt;
    }

    uint256 private _nextId;
    mapping(uint256 => Task) private _tasks;
    mapping(address => uint256[]) private _taskIdsByOwner;

    event TaskCreated(uint256 indexed id, address indexed owner, string content);
    event TaskToggled(uint256 indexed id, address indexed owner, bool done);

    function createTask(string calldata content) external returns (uint256 id) {
        require(bytes(content).length > 0, "Content required");

        id = ++_nextId;
        Task memory task = Task({
            id: id,
            content: content,
            done: false,
            owner: msg.sender,
            createdAt: block.timestamp
        });

        _tasks[id] = task;
        _taskIdsByOwner[msg.sender].push(id);

        emit TaskCreated(id, msg.sender, content);
    }

    function toggleTask(uint256 id) external {
        Task storage task = _tasks[id];
        require(task.id != 0, "Task not found");
        require(task.owner == msg.sender, "Not your task");

        task.done = !task.done;
        emit TaskToggled(id, msg.sender, task.done);
    }

    function getTask(uint256 id) external view returns (Task memory) {
        Task memory task = _tasks[id];
        require(task.id != 0, "Task not found");
        return task;
    }

    function getMyTaskIds() external view returns (uint256[] memory) {
        return _taskIdsByOwner[msg.sender];
    }
}
