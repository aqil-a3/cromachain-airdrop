import AdminTaskEditTemplate from "@/components/templates/admin/AdminTaskEditTemplate";
import { getTaskById } from "@/utils/supabase/taskTable";

interface EditTaskPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;
  const task = await getTaskById(id);

  return <AdminTaskEditTemplate task={task} />;
}
