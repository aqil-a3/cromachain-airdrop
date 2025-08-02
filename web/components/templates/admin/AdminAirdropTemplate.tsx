"use client";

import { Airdrop } from "@/@types/airdrop";
import { airdropColumns } from "@/components/features/admin/airdrop/variables/columnDef";
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

interface AdminAirdropTemplateProps{
  airdrops:Airdrop[]
}
export default function AdminAirdropTemplate({airdrops}:AdminAirdropTemplateProps) {
  return (
    <AdminContainer>
      <AdminDataHeader context={headerConext} />
      <DataTable columns={airdropColumns} data={airdrops} />
    </AdminContainer>
  );
}
