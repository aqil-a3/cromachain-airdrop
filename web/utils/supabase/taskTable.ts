import { v4 as uuidv4 } from "uuid";
import { mapDbTaskToClient } from "@/lib/map-data/mapDbTaskToClient";
import { supabase } from "./client";
import { Task, TaskDB } from "@/@types/tasks";

export async function addNewTask(formData: TaskDB) {
  formData.id = uuidv4();

  const { error } = await supabase.from("tasks").insert(formData);

  if (error) {
    console.log(error);
    throw error;
  }
}

export async function editTask(formData: TaskDB) {
  const { error } = await supabase
    .from("tasks")
    .update(formData)
    .eq("id", formData.id);

  if (error) {
    console.error(error);
    throw error;
  }
}

export async function getTaskById(id: string) {
  const raw = await supabase.from("tasks").select("*").eq("id", id).single();
  const { data, error } = raw;

  if (error || !data) {
    console.error(error);
    throw error;
  }

  const task = mapDbTaskToClient(data);

  return task;
}

export async function getAllTask() {
  const { data, error } = await supabase.from("tasks").select("*");

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
