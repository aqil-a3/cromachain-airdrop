import { Task, TaskDB } from "@/@types/tasks";

export function mapDbTaskToClient(db: TaskDB): Task {
  return {
    id: db.id,
    title: db.title,
    description: db.description,
    category: db.category as Task["category"],
    platform: db.platform,
    reward: db.reward,
    rewardType: db.reward_type,
    difficulty: db.difficulty as Task["difficulty"],
    timeEstimate: String(db.time_estimate),
    status: db.status as Task["status"],
    locked: db.locked,
    iconName: db.icon_name,
    action: db.action,
    link: db.link ?? undefined,
    requirements: db.requirements ? JSON.parse(db.requirements) : undefined,
  };
}
