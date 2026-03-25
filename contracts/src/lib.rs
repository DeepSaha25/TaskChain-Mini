#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

// ── Data Types ──────────────────────────────────────────

#[derive(Clone)]
#[contracttype]
pub struct Task {
    pub id: u64,
    pub content: String,
    pub done: bool,
    pub owner: Address,
    pub created_at: u64,
}

#[contracttype]
pub enum DataKey {
    NextId,
    Task(u64),
    UserTaskIds(Address),
    RewardBalance(Address),
    TotalRewardsMinted,
}

// ── Contract ────────────────────────────────────────────

#[contract]
pub struct TaskRegistry;

#[contractimpl]
impl TaskRegistry {
    /// Initialize the contract (sets next_id to 1 and total rewards to 0)
    pub fn init(env: Env) {
        let next_id_key = DataKey::NextId;
        if !env.storage().persistent().has(&next_id_key) {
            env.storage().persistent().set(&next_id_key, &1u64);
        }
        let total_key = DataKey::TotalRewardsMinted;
        if !env.storage().persistent().has(&total_key) {
            env.storage().persistent().set(&total_key, &0u64);
        }
    }

    /// Create a new task
    pub fn create_task(env: Env, caller: Address, content: String) -> u64 {
        let next_id_key = DataKey::NextId;
        let next_id: u64 = env.storage()
            .persistent()
            .get(&next_id_key)
            .unwrap_or(1u64);
        
        let task_id = next_id;
        env.storage().persistent().set(&next_id_key, &(next_id + 1));

        let task = Task {
            id: task_id,
            content: content.clone(),
            done: false,
            owner: caller.clone(),
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&DataKey::Task(task_id), &task);

        // Add task ID to user's task list
        let user_key = DataKey::UserTaskIds(caller.clone());
        let mut user_tasks: Vec<u64> = env.storage()
            .persistent()
            .get(&user_key)
            .unwrap_or_else(|| Vec::new(&env));
        
        user_tasks.push_back(task_id);
        env.storage().persistent().set(&user_key, &user_tasks);

        // Emit event
        env.events().publish(
            ("task_created",),
            (task_id, caller, content),
        );

        task_id
    }

    /// Toggle task completion status.
    /// When a task is marked done, an inter-contract-style call mints a reward token.
    pub fn toggle_task(env: Env, caller: Address, id: u64) {
        let task_key = DataKey::Task(id);
        if let Some(mut task) = env.storage().persistent().get::<_, Task>(&task_key) {
            // Verify ownership
            if task.owner == caller {
                let was_done = task.done;
                task.done = !task.done;

                env.storage().persistent().set(&task_key, &task);

                // ── Inter-contract call pattern ──
                // When toggling to done (false → true), mint a reward token.
                // This simulates a cross-contract call where TaskRegistry invokes
                // the reward minting logic, similar to calling another contract's
                // mint() function via env.invoke_contract().
                if !was_done && task.done {
                    Self::mint_reward(&env, &caller, 10);
                }

                env.events().publish(
                    ("task_toggled",),
                    (id, caller, task.done),
                );
            }
        }
    }

    /// Get task by ID
    pub fn get_task(env: Env, id: u64) -> Option<Task> {
        let task_key = DataKey::Task(id);
        env.storage().persistent().get(&task_key)
    }

    /// Get all task IDs for a user
    pub fn get_user_task_ids(env: Env, user: Address) -> Vec<u64> {
        let user_key = DataKey::UserTaskIds(user);
        env.storage()
            .persistent()
            .get(&user_key)
            .unwrap_or_else(|| Vec::new(&env))
    }

    /// Get reward token balance for a user
    pub fn get_reward_balance(env: Env, user: Address) -> u64 {
        let balance_key = DataKey::RewardBalance(user);
        env.storage()
            .persistent()
            .get(&balance_key)
            .unwrap_or(0u64)
    }

    /// Get total rewards minted across all users
    pub fn get_total_rewards(env: Env) -> u64 {
        let total_key = DataKey::TotalRewardsMinted;
        env.storage()
            .persistent()
            .get(&total_key)
            .unwrap_or(0u64)
    }

    // ── Internal: Reward Token Minting (Inter-Contract Pattern) ──
    //
    // In a production multi-contract setup, this would be a separate
    // deployed contract invoked via:
    //   env.invoke_contract::<()>(&reward_contract_id, &symbol, &args);
    //
    // Here we implement the reward logic within the same contract but as
    // a distinct module to demonstrate the inter-contract call pattern.
    // The toggle_task method calls mint_reward the same way it would
    // invoke a separate contract's mint function.

    fn mint_reward(env: &Env, recipient: &Address, amount: u64) {
        // Update user balance
        let balance_key = DataKey::RewardBalance(recipient.clone());
        let current: u64 = env.storage()
            .persistent()
            .get(&balance_key)
            .unwrap_or(0u64);
        env.storage().persistent().set(&balance_key, &(current + amount));

        // Update global counter
        let total_key = DataKey::TotalRewardsMinted;
        let total: u64 = env.storage()
            .persistent()
            .get(&total_key)
            .unwrap_or(0u64);
        env.storage().persistent().set(&total_key, &(total + amount));

        // Emit reward event
        env.events().publish(
            ("reward_minted",),
            (recipient.clone(), amount),
        );
    }
}

// ── Tests ───────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::Address as AddressTestUtils;

    #[test]
    fn test_create_task() {
        let env = Env::default();
        env.ledger().set_timestamp(100);
        
        let contract = TaskRegistry;
        let user = Address::random(&env);
        
        contract.init(env.clone());
        
        let id = contract.create_task(env.clone(), user.clone(), String::from_slice(&env, "Test task"));
        assert_eq!(id, 1);
        
        if let Some(task) = contract.get_task(env, id) {
            assert_eq!(task.content, String::from_slice(&env, "Test task"));
            assert_eq!(task.done, false);
        }
    }

    #[test]
    fn test_toggle_task() {
        let env = Env::default();
        env.ledger().set_timestamp(100);
        
        let contract = TaskRegistry;
        let user = Address::random(&env);
        
        contract.init(env.clone());
        
        let id = contract.create_task(env.clone(), user.clone(), String::from_slice(&env, "Toggle test"));
        
        if let Some(task) = contract.get_task(env.clone(), id) {
            assert_eq!(task.done, false);
        }
        
        contract.toggle_task(env.clone(), user.clone(), id);
        
        if let Some(updated) = contract.get_task(env, id) {
            assert_eq!(updated.done, true);
        }
    }

    #[test]
    fn test_multiple_users() {
        let env = Env::default();
        let contract = TaskRegistry;
        let user1 = Address::random(&env);
        let user2 = Address::random(&env);
        
        contract.init(env.clone());
        
        contract.create_task(env.clone(), user1.clone(), String::from_slice(&env, "User 1 task"));
        contract.create_task(env.clone(), user2.clone(), String::from_slice(&env, "User 2 task"));
        
        let user1_tasks = contract.get_user_task_ids(env.clone(), user1);
        let user2_tasks = contract.get_user_task_ids(env, user2);
        
        assert_eq!(user1_tasks.len(), 1);
        assert_eq!(user2_tasks.len(), 1);
    }

    #[test]
    fn test_reward_minting_on_task_completion() {
        let env = Env::default();
        env.ledger().set_timestamp(200);
        
        let contract = TaskRegistry;
        let user = Address::random(&env);
        
        contract.init(env.clone());

        // Create a task
        let id = contract.create_task(env.clone(), user.clone(), String::from_slice(&env, "Reward task"));

        // Before toggling: reward balance should be 0
        let balance_before = contract.get_reward_balance(env.clone(), user.clone());
        assert_eq!(balance_before, 0);

        // Toggle to done → should mint 10 reward tokens
        contract.toggle_task(env.clone(), user.clone(), id);

        let balance_after = contract.get_reward_balance(env.clone(), user.clone());
        assert_eq!(balance_after, 10);

        // Total rewards should be 10
        let total = contract.get_total_rewards(env.clone());
        assert_eq!(total, 10);
    }

    #[test]
    fn test_no_double_reward_on_re_toggle() {
        let env = Env::default();
        env.ledger().set_timestamp(300);

        let contract = TaskRegistry;
        let user = Address::random(&env);

        contract.init(env.clone());

        let id = contract.create_task(env.clone(), user.clone(), String::from_slice(&env, "Double toggle"));

        // Toggle to done → +10 reward
        contract.toggle_task(env.clone(), user.clone(), id);
        assert_eq!(contract.get_reward_balance(env.clone(), user.clone()), 10);

        // Toggle back to pending → no additional reward
        contract.toggle_task(env.clone(), user.clone(), id);
        assert_eq!(contract.get_reward_balance(env.clone(), user.clone()), 10);

        // Toggle to done again → another +10
        contract.toggle_task(env.clone(), user.clone(), id);
        assert_eq!(contract.get_reward_balance(env.clone(), user.clone()), 20);
    }

    #[test]
    fn test_multiple_tasks_reward_accumulation() {
        let env = Env::default();
        env.ledger().set_timestamp(400);

        let contract = TaskRegistry;
        let user = Address::random(&env);

        contract.init(env.clone());

        let id1 = contract.create_task(env.clone(), user.clone(), String::from_slice(&env, "Task A"));
        let id2 = contract.create_task(env.clone(), user.clone(), String::from_slice(&env, "Task B"));
        let id3 = contract.create_task(env.clone(), user.clone(), String::from_slice(&env, "Task C"));

        // Complete all three tasks
        contract.toggle_task(env.clone(), user.clone(), id1);
        contract.toggle_task(env.clone(), user.clone(), id2);
        contract.toggle_task(env.clone(), user.clone(), id3);

        // 3 tasks × 10 tokens = 30
        assert_eq!(contract.get_reward_balance(env.clone(), user.clone()), 30);
        assert_eq!(contract.get_total_rewards(env.clone()), 30);
    }
}
