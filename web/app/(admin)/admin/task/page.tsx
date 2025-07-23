import { Task } from "@/@types/tasks";
import AdminTaskTemplate from "@/components/templates/admin/AdminTaskTemplate";
import { mapDbTaskToClient } from "@/lib/map-data/mapDbTaskToClient";
import { tasksTable } from "@/utils/supabase/client";

const getTasks = async () => {
  const res = await tasksTable.select("*");
  if (res.error) {
    throw res.error;
  }
  const data: Task[] = [];

  for (const d of res.data) {
    data.push(mapDbTaskToClient(d));
  }

  return data;
};

export default async function AdminTaskPage() {
  const tasks = await getTasks();

  return <AdminTaskTemplate tasks={tasks} />;
}
