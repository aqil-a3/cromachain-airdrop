import { v4 as uuidv4 } from "uuid";
import { mapDbTaskToClient } from "@/lib/map-data/mapDbTaskToClient";
import { supabase } from "./client";
import { Task, TaskDB } from "@/@types/tasks";

/** Helper Function for "tasks" Table in Supabase */
const tableName = "tasks";

export async function addNewTask(formData: TaskDB) {
  formData.id = uuidv4();

  const { error } = await supabase.from(tableName).insert(formData);

  if (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from(tableName).delete().eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
}

export async function editTask(formData: TaskDB) {
  const { error } = await supabase
    .from(tableName)
    .update(formData)
    .eq("id", formData.id);

  if (error) {
    console.error(error);
    throw error;
  }
}

export async function getTaskById(id: string) {
  const raw = await supabase.from(tableName).select("*").eq("id", id).single();
  const { data, error } = raw;

  if (error || !data) {
    console.error(error);
    throw error;
  }

  const task = mapDbTaskToClient(data);

  return task;
}

export async function getAllTask() {
  const { data, error } = await supabase.from(tableName).select("*");

  if (error || !data) {
    console.error(error);
    throw error;
  }
  const tasksData: TaskDB[] = data;
  const taskClient: Task[] = [];

  for (const task of tasksData) {
    taskClient.push(mapDbTaskToClient(task));
  }

  return taskClient;
}
