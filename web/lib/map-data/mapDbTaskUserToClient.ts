import { TaskUser, TaskUserDb } from "@/@types/task-user";

export function mapDbTaskUserToClient(raw: TaskUserDb): TaskUser {
  return {
    status: raw.status,
    id: raw.id,
    taskId: raw.task_id,
    createdAt: raw.created_at,
    userId: raw.user_id,
    user: {
      email: raw.user?.email ?? "",
      fullName: raw.user?.full_name ?? "",
    },
    task: {
      category: raw.task?.category ?? "",
      title: raw.task?.title ?? "",
    },
  };
}
