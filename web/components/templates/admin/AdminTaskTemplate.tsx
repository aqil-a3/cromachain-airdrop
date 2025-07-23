"use client";

import { Task } from "@/@types/tasks";
import { taskColumns } from "@/components/features/admin/task/variables/columnDef";
import AdminContainer from "@/components/layouts/container/AdminContainer";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AdminTaskTemplate({ tasks }: { tasks: Task[] }) {
  return (
    <AdminContainer>
      {/* Header */}
      <div className="flex justify-between">
        <span>Task Table</span>
        <Link href="/admin/task/add">
          <Button className="bg-slate-300 text-slate-800 hover:bg-slate-200">
            <Plus /> Tambah Tugas
          </Button>
        </Link>
      </div>

      {/* Table */}
      <DataTable columns={taskColumns} data={tasks} />
    </AdminContainer>
  );
}
