"use client";
import { Airdrop } from "@/@types/airdrop";
import { putAirdrop } from "@/components/features/admin/airdrop/actions/putAirdrop";
import AirdropForm from "@/components/features/admin/airdrop/components/form";
import { AirdropSchemaType } from "@/components/features/admin/airdrop/variables/schema";
import AdminContainer from "@/components/layouts/container/AdminContainer";

interface AdminAirdropEditTemplateProps {
  airdrop: Airdrop;
}

export default function AdminAirdropEditTemplate({
  airdrop,
}: AdminAirdropEditTemplateProps) {
  const data:AirdropSchemaType = {
    ...airdrop,
    time_left : new Date(airdrop.time_left)
  }
    return (
    <AdminContainer>
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Edit Airdrop</h1>
          <p className="text-sm text-gray-200">
            Fill out the details below to edit a CromaChain airdrop.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <AirdropForm defaultData={data} submitHandler={putAirdrop} />
        </div>
      </div>
    </AdminContainer>
  );
}
