import { TaskUser } from "@/@types/task-user";
import { supabase } from "./client";
import { mapClientTaskUserToDb } from "@/lib/map-data/mapClientTaskUserToDb";
import { mapDbTaskUserToClient } from "@/lib/map-data/mapDbTaskUserToClient";
import { gettaskRewardByTaskId } from "./taskTable";

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
    .select(
      "*, user: user_id(email, full_name), task: task_id(title, category)"
    )
    .eq("user_id", userId);

  if (!data || error) {
    console.error(error);
    throw error;
  }

  const userTasks = data.map((d) => mapDbTaskUserToClient(d));

  return userTasks;
}

export async function updateStatusUserTask(raw: TaskUser) {
  const dbPayload = mapClientTaskUserToDb(raw);
  const { reward, reward_type } = await gettaskRewardByTaskId(
    dbPayload.task_id
  );

  if (dbPayload.status === "completed") {
    dbPayload.reward_earned = reward;
    dbPayload.reward_type = reward_type;
  } else {
    dbPayload.reward_earned = 0;
    dbPayload.reward_type = "";
  }

  const { error } = await supabase
    .from(tableName)
    .update({
      reward_earned: dbPayload.reward_earned,
      status: dbPayload.status,
    })
    .eq("id", dbPayload.id);

  if (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserTaksCRMPointsByUserId(userId: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select("reward_earned")
    .eq("user_id", userId)
    .eq("reward_type", "CRM");

  if (error) {
    console.error(error);
    throw error;
  }

  if(!data || data.length === 0){
    return 0;
  }

  const points: number = data
    .map((d) => d.reward_earned || 0)
    .reduce((acc, curr) => acc + curr, 0);

  return points;
}
