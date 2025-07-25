import AdminTaskReviewTemplate from "@/components/templates/admin/AdminTaskReviewTemplate";
import { getAllTask } from "@/utils/supabase/taskTable";

export default async function TaskReviewPage() {
  const tasks = await getAllTask();
  return <AdminTaskReviewTemplate tasks={tasks} />;
}
