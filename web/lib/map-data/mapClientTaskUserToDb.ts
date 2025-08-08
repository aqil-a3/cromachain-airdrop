import { TaskUser, TaskUserDb } from "@/@types/task-user";

export function mapClientTaskUserToDb(raw: TaskUser): TaskUserDb {
  return {
    status: raw.status,
    id: raw.id,
    task_id: raw.taskId,
    user_id: raw.userId,
    created_at: raw.createdAt,
    is_bonus: raw.isBonus,
    reward_earned: raw.rewardEarned,
    reward_type: raw.rewardType,
  };
}
