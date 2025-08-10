import { UserPoints } from "@/@types/user-points";
import AdminUserTemplate from "@/components/templates/admin/AdminUserTemplate";
import {
  getUserReferralsPoints,
  getUserTasksPoints,
} from "@/utils/supabase/rpc/rpc-points";
import { getAllUserReferrals } from "@/utils/supabase/userReferralsTable";
import { getAllActiveUser } from "@/utils/supabase/userTable";

const getUserPoints = async () => {
  const [userTasksPointsRaw, userReferralsPoints] = await Promise.all([
    getUserTasksPoints(),
    getUserReferralsPoints(),
  ]);

  const userTasksPoints = userTasksPointsRaw.map((ut) => ({
    ...ut,
    reward_type: ut.reward_type || "CRM",
  }));

  const referralPoints: UserPoints[] = userReferralsPoints.map((ur) => ({
    reward_earned: ur.points,
    reward_type: "referral",
    user_id: ur.referrer_id,
  }));

  const userPoints = referralPoints.concat(userTasksPoints);

  return userPoints;
};

export default async function UserPage() {
  const [users, userReferrals, userPoints] = await Promise.all([
    getAllActiveUser(),
    getAllUserReferrals(),
    getUserPoints(),
  ]);

  return (
    <AdminUserTemplate
      users={users}
      userReferrals={userReferrals}
      userPoints={userPoints}
    />
  );
}
