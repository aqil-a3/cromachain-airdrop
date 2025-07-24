import AdminTaskTemplate from "@/components/templates/admin/AdminTaskTemplate";
import { getAllTask } from "@/utils/supabase/taskTable";

export default async function AdminTaskPage() {
  const tasks = await getAllTask();

  return <AdminTaskTemplate tasks={tasks} />;
}
