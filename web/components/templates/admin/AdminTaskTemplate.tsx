"use client";

import { Task } from "@/@types/tasks";
import { taskColumns } from "@/components/features/admin/task/variables/columnDef";
import AdminContainer from "@/components/layouts/container/AdminContainer";
import AdminDataHeader, {
  AdminDataHeaderContext,
} from "@/components/molecules/Header/AdminDataHeader";
import { DataTable } from "@/components/ui/data-table";

const headerContext: AdminDataHeaderContext = {
  title: "Task Data",
  addLink: "/admin/task/add",
  addLabel: "Add ",
};

export default function AdminTaskTemplate({ tasks }: { tasks: Task[] }) {
  return (
    <AdminContainer>
      <AdminDataHeader context={headerContext} />

      {/* Table */}
      <DataTable columns={taskColumns} data={tasks} />
    </AdminContainer>
  );
}
