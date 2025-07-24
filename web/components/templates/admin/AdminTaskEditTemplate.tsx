"use client";
import { Task } from "@/@types/tasks";
import { putTask } from "@/components/features/admin/task/actions/putTask";
import TaskForm from "@/components/features/admin/task/components/form";
import AdminContainer from "@/components/layouts/container/AdminContainer";

interface AdminTaskEditTemplateProps {
  task: Task;
}

export default function AdminTaskEditTemplate({
  task,
}: AdminTaskEditTemplateProps) {
  return (
    <AdminContainer>
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Edit Task</h1>
          <p className="text-sm text-gray-200">
            Fill out the details below to edit a CromaChain task.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <TaskForm
            context={{
              async submitHandler(values) {
                return await putTask(values);
              },
              defaultValues: task,
            }}
          />
        </div>
      </div>
    </AdminContainer>
  );
}
