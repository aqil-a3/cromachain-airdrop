import { auth } from "@/auth";
import UserProfileTemplate from "@/components/templates/ProfileTemplate";
import { getAllTask } from "@/utils/supabase/taskTable";
import { getUserReferralsPointByReferrerId } from "@/utils/supabase/userReferralsTable";
import { getUserTasksByUserId } from "@/utils/supabase/userTaskTable";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  const userId = session?.user.userId ?? "";

  const [tasks, userTasks, pointReferrals] = await Promise.all([
    getAllTask(),
    getUserTasksByUserId(userId),
    getUserReferralsPointByReferrerId(userId),
  ]);

  return (
    <UserProfileTemplate
      tasks={tasks}
      userTasks={userTasks}
      pointReferrals={pointReferrals}
    />
  );
}
