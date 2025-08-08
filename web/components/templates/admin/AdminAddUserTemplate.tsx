"use client";

import { postUser } from "@/components/features/admin/user/actions/postUser";
import UserForm from "@/components/molecules/Form/UserForm";
import AdminContainer from "@/components/layouts/container/AdminContainer";

export default function AdminAddUserTemplate() {
  return (
    <AdminContainer>
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Add New User</h1>
          <p className="text-sm text-gray-200">
            Fill out the details below to create a new CromaChain user.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <UserForm
          onSubmit={async (data) => await postUser(data)}
          />
        </div>
      </div>
    </AdminContainer>
  );
}
