"use client";

import { UserProfile } from "@/@types/user";
import { UserPoints } from "@/@types/user-points";
import { UserReferrals } from "@/@types/user_referrals";
import UserDataProvider from "@/components/features/admin/user/provider";
import { userColumns } from "@/components/features/admin/user/variables/columnDef";
import AdminContainer from "@/components/layouts/container/AdminContainer";
import AdminDataHeader, {
  AdminDataHeaderContext,
} from "@/components/molecules/Header/AdminDataHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import axios from "axios";
import { FileSpreadsheet, Loader } from "lucide-react";
import { useState } from "react";

const headerConext: AdminDataHeaderContext = {
  title: "User Data",
  addLink: "/admin/user/add",
  addLabel: "Add New User",
};

export default function AdminUserTemplate({
  users,
  userReferrals,
  userPoints,
}: {
  users: UserProfile[];
  userReferrals: UserReferrals[];
  userPoints: UserPoints[];
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const csvHandler = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserDataProvider
      users={users}
      userReferrals={userReferrals}
      userPoints={userPoints}
    >
      <AdminContainer className="space-y-4">
        <AdminDataHeader context={headerConext} />
        <Button
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600"
          onClick={csvHandler}
        >
          {isLoading ? (
            <Loader className="animate-spin" />
          ) : (
            <FileSpreadsheet />
          )}
          {isLoading ? "Preparing..." : "CSV"}
        </Button>
        <DataTable columns={userColumns} data={users} />
      </AdminContainer>
    </UserDataProvider>
  );
}
