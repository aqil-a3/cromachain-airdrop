import AdminContainer from "@/components/layouts/container/AdminContainer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AdminTaskTemplate() {
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
    </AdminContainer>
  );
}
