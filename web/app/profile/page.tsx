import { Task } from "@/@types/tasks";
import UserProfileTemplate from "@/components/templates/ProfileTemplate";
import { mapDbTaskToClient } from "@/lib/map-data/mapDbTaskToClient";
import { tasksTable } from "@/utils/supabase/client";

const getTasks = async () => {
  const { data, error } = await tasksTable.select("*");

  if (error) {
    console.log(error);
    throw error;
  }

  if(!data){
    return []
  }
  const tasks:Task[]= [];

  for(const d of data){
    tasks.push(mapDbTaskToClient(d));
  }

  return tasks
};

export default async function ProfilePage() {
  const tasks = await getTasks()
  return <UserProfileTemplate initialTasks={tasks} />;
}
