"use client";

import { postTask } from "@/components/features/admin/task/actions/postTask";
import TaskForm from "@/components/features/admin/task/components/form";
import AdminContainer from "@/components/layouts/container/AdminContainer";

export default function AdminTaskAddTemplate() {
  return (
    <AdminContainer>
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Add New Task</h1>
          <p className="text-sm text-gray-200">
            Fill out the details below to create a new CromaChain task.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <TaskForm context={{ submitHandler: postTask }} />
        </div>
      </div>
    </AdminContainer>
  );
}
