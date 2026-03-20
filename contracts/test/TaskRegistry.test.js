const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TaskRegistry", function () {
  async function deployFixture() {
    const [owner, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("TaskRegistry");
    const taskRegistry = await Factory.deploy();
    await taskRegistry.waitForDeployment();

    return { taskRegistry, owner, other };
  }

  it("creates a task and stores owner/content", async function () {
    const { taskRegistry, owner } = await deployFixture();

    await expect(taskRegistry.createTask("Write docs"))
      .to.emit(taskRegistry, "TaskCreated")
      .withArgs(1, owner.address, "Write docs");

    const task = await taskRegistry.getTask(1);
    expect(task.id).to.equal(1n);
    expect(task.content).to.equal("Write docs");
    expect(task.done).to.equal(false);
    expect(task.owner).to.equal(owner.address);
  });

  it("allows owner to toggle completion", async function () {
    const { taskRegistry } = await deployFixture();

    await taskRegistry.createTask("Ship app");
    await expect(taskRegistry.toggleTask(1))
      .to.emit(taskRegistry, "TaskToggled")
      .withArgs(1, (await ethers.getSigners())[0].address, true);

    const task = await taskRegistry.getTask(1);
    expect(task.done).to.equal(true);
  });

  it("prevents non-owner from toggling a task", async function () {
    const { taskRegistry, other } = await deployFixture();

    await taskRegistry.createTask("Private task");

    await expect(taskRegistry.connect(other).toggleTask(1)).to.be.revertedWith("Not your task");
  });

  it("tracks IDs per owner", async function () {
    const { taskRegistry, other } = await deployFixture();

    await taskRegistry.createTask("Task 1");
    await taskRegistry.createTask("Task 2");
    await taskRegistry.connect(other).createTask("Task 3");

    const ownerIds = await taskRegistry.getMyTaskIds();
    const otherIds = await taskRegistry.connect(other).getMyTaskIds();

    expect(ownerIds.map((v) => Number(v))).to.deep.equal([1, 2]);
    expect(otherIds.map((v) => Number(v))).to.deep.equal([3]);
  });
});
