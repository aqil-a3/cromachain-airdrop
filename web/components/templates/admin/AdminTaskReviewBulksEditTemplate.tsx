"use client";

import { TaskUser } from "@/@types/task-user";
import BulkEditPanel from "@/components/features/admin/task-review-bulks-edit/components/BulkEditPannel";
import DataCarousel from "@/components/features/admin/task-review-bulks-edit/components/carousel";
import TRBulksEditProvider from "@/components/features/admin/task-review-bulks-edit/provider";
import AdminContainer from "@/components/layouts/container/AdminContainer";

type Props = {
  userTaskReviews: TaskUser[];
};

export default function AdminTaskReviewBulksEditTemplate({
  userTaskReviews,
}: Props) {
  return (
    <TRBulksEditProvider taskReviews={userTaskReviews}>
      <AdminContainer>
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-slate-800">
            Task Review – Bulk Edit
          </h1>
          <p className="text-slate-600 mt-1">
            Manage and update multiple task reviews in one place for faster administration.
          </p>
          <div className="mt-6">
            <DataCarousel />
          </div>
          <div>
            <BulkEditPanel />
          </div>
        </div>
      </AdminContainer>
    </TRBulksEditProvider>
  );
}
