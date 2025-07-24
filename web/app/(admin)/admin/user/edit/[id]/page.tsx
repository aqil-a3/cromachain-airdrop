import AdminUserEditTemplate from "@/components/templates/admin/AdminUserEditTemplate";
import { getUserById } from "@/utils/supabase/userTable";

interface EditUserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const id = (await params).id;
  const user = await getUserById(id)

  return <AdminUserEditTemplate user={user} />;
}
