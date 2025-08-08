import { mapClientTaskToDbTask } from "@/lib/map-data/mapClientTaskToDb";
import { TaskFormSchema } from "../../../../../schemas/taskSchema";
import axios from "axios";

export async function putTask(values: TaskFormSchema) {
  const dbData = mapClientTaskToDbTask(values);

  try {
    await axios.put(`/api/tasks`, dbData);

    alert("Edit task is success");
  } catch (error) {
    alert("Something wrong");
    console.error(error);
  }
}
