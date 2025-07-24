import UserProfileTemplate from "@/components/templates/ProfileTemplate";
import { getAllTask } from "@/utils/supabase/taskTable";

export default async function ProfilePage() {
  const tasks = await getAllTask();
  console.log(`Tasks from Server`, tasks);
  return <UserProfileTemplate tasks={tasks} />;
}
