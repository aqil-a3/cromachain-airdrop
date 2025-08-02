"use client";

import { UserProfile } from "@/@types/user";
import { userColumns } from "@/components/features/admin/user/variables/columnDef";
import AdminContainer from "@/components/layouts/container/AdminContainer";
import AdminDataHeader, {
  AdminDataHeaderContext,
} from "@/components/molecules/Header/AdminDataHeader";
import { DataTable } from "@/components/ui/data-table";

const headerConext: AdminDataHeaderContext = {
  title: "Airdrop",
  addLink: "/admin/airdrop/add",
  addLabel: "Add New Airdrop",
};

export default function AdminAirdropTemplate() {
  return (
    <AdminContainer>
      <AdminDataHeader context={headerConext} />
      <DataTable columns={userColumns} data={[]} />
    </AdminContainer>
  );
}
