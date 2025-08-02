"use client";

import { postAirdrop } from "@/components/features/admin/airdrop/actions/postAirdrop";
import AirdropForm from "@/components/features/admin/airdrop/components/form";
import AdminContainer from "@/components/layouts/container/AdminContainer";

export default function AdminAirdropAddTemplate() {
  return (
    <AdminContainer>
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Add New Airdrop</h1>
          <p className="text-sm text-gray-200">
            Fill out the details below to create a new Airdrop.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <AirdropForm submitHandler={postAirdrop} />
        </div>
      </div>
    </AdminContainer>
  );
}
