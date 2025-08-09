import AdminUserTemplate from "@/components/templates/admin/AdminUserTemplate";
import { getAllUserReferrals } from "@/utils/supabase/userReferralsTable";
import { getAllActiveUser } from "@/utils/supabase/userTable";

export default async function UserPage() {
  const [users, userReferrals] = await Promise.all([
    getAllActiveUser(),
    getAllUserReferrals(),
  ]);

  return <AdminUserTemplate users={users} userReferrals={userReferrals} />;
}
