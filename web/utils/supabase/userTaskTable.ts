import { TaskUser } from "@/@types/task-user";
import { supabase } from "./client";
import { mapClientTaskUserToDb } from "@/lib/map-data/mapClientTaskUserToDb";
import { mapDbTaskUserToClient } from "@/lib/map-data/mapDbTaskUserToClient";

const tableName = "user_tasks";

export async function getAllUserTasks() {
  const { data, error } = await supabase
    .from(tableName)
    .select(
      "*, user: user_id(email, full_name), task: task_id(title, category)"
    );

  if (error || !data) {
    console.error(error);
    throw error;
  }

  const userTasks = data.map((d) => mapDbTaskUserToClient(d));

  return userTasks;
}

export async function getUserTasksByTaskId(taskId: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select(
      "*, user: user_id(email, full_name), task: task_id(title, category)"
    )
    .eq("task_id", taskId);

  if (error || !data) {
    console.error(error);
    throw error;
  }

  const userTasks = data.map((d) => mapDbTaskUserToClient(d));

  return userTasks;
}

export async function createNewUserTasks(raw: TaskUser) {
  const data = mapClientTaskUserToDb(raw);

  const { error } = await supabase.from(tableName).insert(data);
  if (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserTasksByUserId(userId: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("user_id", userId);

  if (!data || error) {
    console.error(error);
    throw error;
  }

  const userTasks = data.map((d) => mapDbTaskUserToClient(d));

  return userTasks;
}
