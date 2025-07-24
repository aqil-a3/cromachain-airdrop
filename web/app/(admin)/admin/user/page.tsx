import AdminUserTemplate from "@/components/templates/admin/AdminUserTemplate";
import { getAllActiveUser } from "@/utils/supabase/userTable";

export default async function UserPage() {
  const users = await getAllActiveUser();

  return <AdminUserTemplate users={users} />;
}
