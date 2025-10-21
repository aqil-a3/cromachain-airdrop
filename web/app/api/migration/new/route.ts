import { TaskUserDb } from "@/@types/task-user";
import { UserProfileDb } from "@/@types/user";
import { supabase } from "@/utils/supabase/client";
import { getGalxeDataByEthAddress } from "@/utils/supabase/galxeTable";
import { getMigrationData } from "@/utils/supabase/migrationTable";
import { getUserPoints } from "@/utils/supabase/rpc/rpc-points";
import { getAllActiveUser } from "@/utils/supabase/userTable";
// import { getUserTaskByTaskIdAndUserId } from "@/utils/supabase/userTaskTable";
import { NextRequest, NextResponse } from "next/server";

export interface MigrationDb {
  id?: number;
  created_at?: string;
  wallet_address: string;
  source: string;
  points: number;
  airdrop_nft_tasks?: string[];
}

const NFT_TASKS = [
  "f7f89788-d176-4d8c-a5e4-f87f4500bb1e",
  "4038bc6d-a2ce-4bb1-8ced-9e91468197b1",
  "ee74e98e-eb6b-4dbf-afd6-a02550489573",
  "11f4a316-5a69-4893-b70e-79e260c2aca3",
];

const getUserByEthAddress = async (wallet_address: string) => {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("eth_address", wallet_address)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw error;
  }

  return data as UserProfileDb | null;
};

async function getUserTaskByTaskIdAndUserId(
  taskId: string,
  userId: string
): Promise<TaskUserDb> {
  const { data } = await supabase
    .from("user_tasks")
    .select("*")
    .eq("task_id", taskId)
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

export async function GET(req: NextRequest) {
  const headers = req.headers;
  const apiKey = headers.get("x-api-key");
  const correctKey = process.env.AIRDROP_SHARED_SECRET_KEY;

  if (!apiKey)
    return NextResponse.json({ message: "Key required" }, { status: 401 });
  if (apiKey !== correctKey)
    return NextResponse.json(
      { message: "Key is invalid! Access Denied" },
      { status: 401 }
    );

  const finalData: MigrationDb[] = [];

  const [userMigrated, userNonMigrated] = await Promise.all([
    getMigrationData(),
    getAllActiveUser(),
  ]);

  for (const user of userMigrated) {
    const selectedUser = await getUserByEthAddress(user.wallet_address);

    if (selectedUser) {
      const { id } = selectedUser;

      const nftTaskProgress = await Promise.all(
        NFT_TASKS.map((taskId) => getUserTaskByTaskIdAndUserId(taskId, id!))
      );

      const userTasks = nftTaskProgress
        .filter((t): t is TaskUserDb => t !== null)
        .filter((t) => t.status === "completed")
        .map((task) => task.task_id);

      const data: MigrationDb = {
        points: user.points,
        source: "airdrop",
        wallet_address: user.wallet_address,
        airdrop_nft_tasks: userTasks,
      };

      finalData.push(data);
    }
  }

  for (const user of userNonMigrated) {
    const nftTaskProgress = await Promise.all(
      NFT_TASKS.map((taskId) => getUserTaskByTaskIdAndUserId(taskId, user.id!))
    );

    let webPoints = 0;

    const [web, galxe] = await Promise.all([
      getUserPoints(user.id!),
      getGalxeDataByEthAddress(user.ethAddress),
    ]);

    if (web && web.length > 0) {
      webPoints = web[0].total_points;
    }

    let galxePoints: number = 0;

    if (galxe.data) galxePoints = galxe.data.total_points;

    const total_points = webPoints + galxePoints;

    const userTasks = nftTaskProgress
      .filter((t): t is TaskUserDb => t !== null)
      .filter((t) => t.status === "completed")
      .map((task) => task.task_id);

    const data: MigrationDb = {
      points: total_points,
      source: "airdrop",
      wallet_address: user.ethAddress,
      airdrop_nft_tasks: userTasks,
    };

    finalData.push(data);
  }

  return NextResponse.json({ totalData: finalData.length, finalData });
}
