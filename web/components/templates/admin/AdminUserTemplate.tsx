"use client";

import { UserProfile } from "@/@types/user";
import { userColumns } from "@/components/features/admin/user/variables/columnDef";
import AdminContainer from "@/components/layouts/container/AdminContainer";
import AdminDataHeader, {
  AdminDataHeaderContext,
} from "@/components/molecules/Header/AdminDataHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import axios from "axios";
import { FileSpreadsheet } from "lucide-react";

const headerConext: AdminDataHeaderContext = {
  title: "User Data",
  addLink: "/admin/user/add",
  addLabel: "Add New User",
};

export default function AdminUserTemplate({ users }: { users: UserProfile[] }) {
  const csvHandler = async () => {
    try {
      const { data } = await axios.get(`/api/user/export-csv`, {
        responseType: "blob",
      });

      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "cromachain-airdrop-user.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  return (
    <AdminContainer className="space-y-4">
      <AdminDataHeader context={headerConext} />
      <Button className="bg-green-500 hover:bg-green-600" onClick={csvHandler}>
        <FileSpreadsheet />
        CSV
      </Button>
      <DataTable columns={userColumns} data={users} />
    </AdminContainer>
  );
}
