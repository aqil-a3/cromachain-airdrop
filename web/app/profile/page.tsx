import { auth } from "@/auth";
import UserProfileTemplate from "@/components/templates/ProfileTemplate";
import { getUserPoints } from "@/utils/supabase/rpc/rpc-points";
import { getUnlockedTasks } from "@/utils/supabase/taskTable";
import { getUserById } from "@/utils/supabase/userTable";
import { getUnlockedUserTasksByUserId } from "@/utils/supabase/userTaskTable";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  const userId = session?.user.userId ?? "";

  const [tasks, userTasks, user] = await Promise.all([
    getUnlockedTasks(),
    getUnlockedUserTasksByUserId(userId),
    getUserById(userId),
  ]);

  const userPoints = await getUserPoints(userId);
  const selectedPoints =
    userPoints.find((up) => up.user_id === userId)?.total_points || 0;

  return (
    <UserProfileTemplate
      tasks={tasks}
      user={user}
      userTasks={userTasks}
      userPoints={selectedPoints}
    />
  );
}
