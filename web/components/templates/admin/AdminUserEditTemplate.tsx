"use client";
import { UserProfile } from "@/@types/user";
import { putUser } from "@/components/features/admin/user/actions/putUser";
import UserForm from "@/components/features/admin/user/components/form";
import AdminContainer from "@/components/layouts/container/AdminContainer";

interface AdminTaskEditTemplateProps {
  user: UserProfile;
}

export default function AdminUserEditTemplate({
  user,
}: AdminTaskEditTemplateProps) {
  return (
    <AdminContainer>
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Edit User</h1>
          <p className="text-sm text-gray-200">
            Fill out the details below to edit a CromaChain user.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <UserForm
            context={{
              defaultValue: user,
              async onSubmit(data) {
                return await putUser(data);
              },
            }}
          />
        </div>
      </div>
    </AdminContainer>
  );
}
