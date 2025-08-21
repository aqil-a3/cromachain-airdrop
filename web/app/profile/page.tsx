import { auth, signOut } from "@/auth";
import UserProfileTemplate from "@/components/templates/ProfileTemplate";
import { Button } from "@/components/ui/button";
import { getUserPoints } from "@/utils/supabase/rpc/rpc-points";
import { getUnlockedTasks } from "@/utils/supabase/taskTable";
import { getUserById } from "@/utils/supabase/userTable";
import { getUnlockedUserTasksByUserId } from "@/utils/supabase/userTaskTable";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/");

  const userId = session.user.userId ?? "";

  const [tasksResult, userTasksResult, userResult] = await Promise.allSettled([
    getUnlockedTasks(),
    getUnlockedUserTasksByUserId(userId),
    getUserById(userId),
  ]);

  const userPoints = await getUserPoints(userId);
  const selectedPoints =
    userPoints.find((up) => up.user_id === userId)?.total_points || 0;

  const tasks = tasksResult.status === "fulfilled" ? tasksResult.value : [];
  const userTasks =
    userTasksResult.status === "fulfilled" ? userTasksResult.value : [];
  const user = userResult.status === "fulfilled" ? userResult.value : null;

  if (!user)
    return (
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <Button>Logout</Button>
      </form>
    );

  return (
    <UserProfileTemplate
      tasks={tasks}
      user={user}
      userTasks={userTasks}
      userPoints={selectedPoints}
    />
  );
}
