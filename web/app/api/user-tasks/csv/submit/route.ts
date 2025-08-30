import { TaskUser } from "@/@types/task-user";
import { PreviewCsv } from "@/components/features/admin/task-review/logics";
import {
  gettaskRewardByTaskId,
  gettaskRewardByTaskIdBulks,
} from "@/utils/supabase/taskTable";
import { getUsersByEthAddresses } from "@/utils/supabase/userTable";
import {
  getUserTaskByTaskIdAndUserId,
  updateStatusUserTasksBulks,
} from "@/utils/supabase/userTaskTable";
import { NextRequest, NextResponse } from "next/server";

const TASK_IDS: string[] = [
  "f7f89788-d176-4d8c-a5e4-f87f4500bb1e",
  "06e075ae-721f-416a-9251-07db24c05c40",
];
const BUY_TASK_ID = "f7f89788-d176-4d8c-a5e4-f87f4500bb1e";
const VERIFY_TASK_ID = "06e075ae-721f-416a-9251-07db24c05c40";

export async function POST(req: NextRequest) {
  const eth_address_obj: PreviewCsv[] = await req.json();
  const eth_address = eth_address_obj.map((val) => val.eth_address);

  if (eth_address.length > 100)
    return NextResponse.json(
      { message: "Maximal 100 data per file!" },
      { status: 400 }
    );

  const userDb = await getUsersByEthAddresses(
    eth_address.map((eth) => eth.toLowerCase())
  );

  if (userDb.data.length === 0)
    return NextResponse.json(
      { message: "These users are not found in our system!" },
      { status: 404 }
    );

  const buyTaskReward = await gettaskRewardByTaskId(BUY_TASK_ID);
  const buyUserTasks = (
    await Promise.all(
      userDb.data.map((user) =>
        getUserTaskByTaskIdAndUserId(BUY_TASK_ID, user.id!)
      )
    )
  ).flat();
  const payloadBuyTasks: TaskUser[] = userDb.data
    .map((user) => {
      const { reward, reward_type } = buyTaskReward;
      const taskUserId = buyUserTasks.find((tu) => tu.user_id === user.id!);
      return {
        userId: user.id!,
        taskId: BUY_TASK_ID,
        rewardType: reward_type,
        rewardEarned: reward,
        status: "completed",
        id: Number(taskUserId?.id),
      };
    })
    .filter((data) => !isNaN(data.id));

  const verifyTaskReward = await gettaskRewardByTaskId(VERIFY_TASK_ID);
  const verifyUserTasks = (
    await Promise.all(
      userDb.data.map((user) =>
        getUserTaskByTaskIdAndUserId(VERIFY_TASK_ID, user.id!)
      )
    )
  ).flat();
  const payloadVerifyTasks: TaskUser[] = userDb.data
    .map((user) => {
      const { reward, reward_type } = verifyTaskReward;
      const taskUserId = verifyUserTasks.find((tu) => tu.user_id === user.id!);
      return {
        userId: user.id!,
        taskId: VERIFY_TASK_ID,
        rewardType: reward_type,
        rewardEarned: reward,
        status: "completed",
        id: Number(taskUserId?.id),
      };
    })
    .filter((data) => !isNaN(data.id));

  await updateStatusUserTasksBulks(payloadBuyTasks, "completed");
  await updateStatusUserTasksBulks(payloadVerifyTasks, "completed");
  return NextResponse.json({ message: "OK" });
}
