import UserProfileTemplate from "@/components/templates/ProfileTemplate";
import { getAllTask } from "@/utils/supabase/taskTable";

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const tasks = await getAllTask();

  return <UserProfileTemplate tasks={tasks} />;
}
