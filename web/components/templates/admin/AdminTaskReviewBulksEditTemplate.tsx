"use client";

import { TaskUser } from "@/@types/task-user";
import AdminContainer from "@/components/layouts/container/AdminContainer";

type Props = {
  userTaskReviews: TaskUser[];
};
export default function AdminTaskReviewBulksEditTemplate({
  userTaskReviews,
}: Props) {
  return (
    <AdminContainer>
      <div className="bg-white">
        <p>Soon</p>
        {userTaskReviews.map((tur) => (
          <div key={tur.id}>
            <p>{tur.user?.email}</p>
            <p>{tur.task?.title}</p>
            <p>{tur.status}</p>
          </div>
        ))}
      </div>
    </AdminContainer>
  );
}
