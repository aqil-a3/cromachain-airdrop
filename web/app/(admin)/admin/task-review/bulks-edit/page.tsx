import AdminTaskReviewBulksEditTemplate from "@/components/templates/admin/AdminTaskReviewBulksEditTemplate";
import { getBulksUserTaskById } from "@/utils/supabase/userTaskTable";

export default async function BulkEdiPage({
  searchParams,
}: {
  searchParams: Promise<{ ids: string }>;
}) {
  const { ids } = await searchParams;
  const taskIds = ids.split("-").map(Number);
  const data = await getBulksUserTaskById(taskIds);

  return <AdminTaskReviewBulksEditTemplate userTaskReviews={data} />;
}
