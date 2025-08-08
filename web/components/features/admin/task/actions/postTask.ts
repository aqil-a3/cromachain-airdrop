import { mapClientTaskToDbTask } from "@/lib/map-data/mapClientTaskToDb";
import { TaskFormSchema } from "../../../../../schemas/taskSchema";
import axios from "axios";

export async function postTask(values: TaskFormSchema) {
  const dbData = mapClientTaskToDbTask(values);

  try {
    await axios.post(`/api/tasks`, dbData);

    alert("Create new tasks is success");
  } catch (error) {
    alert("Something wrong");
    console.error(error);
  }
}
