import { Task, TaskDB } from "@/@types/tasks";

export function mapClientTaskToDbTask(raw: Task): TaskDB {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    category: raw.category,
    platform: raw.platform,
    reward: raw.reward,
    difficulty: raw.difficulty,
    time_estimate: raw.timeEstimate,
    status: raw.status,
    locked: raw.locked,
    icon_name: raw.iconName,
    action: raw.action,
    link: raw.link ?? null,
    requirements: raw.requirements ? JSON.stringify(raw.requirements) : null,
  };
}
