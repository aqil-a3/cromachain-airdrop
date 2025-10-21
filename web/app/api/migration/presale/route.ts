import { TaskUserDb } from "@/@types/task-user";
import { UserProfileDb } from "@/@types/user";
import { supabase } from "@/utils/supabase/client";
import { getGalxeDataByEthAddress } from "@/utils/supabase/galxeTable";
import { getMigrationDataByAddress } from "@/utils/supabase/migrationTable";
import { getUserPoints } from "@/utils/supabase/rpc/rpc-points";
import { NextRequest, NextResponse } from "next/server";

const NFT_TASKS = [
  "f7f89788-d176-4d8c-a5e4-f87f4500bb1e",
  "4038bc6d-a2ce-4bb1-8ced-9e91468197b1",
  "ee74e98e-eb6b-4dbf-afd6-a02550489573",
  "11f4a316-5a69-4893-b70e-79e260c2aca3",
];

export interface MigrationDb {
  id: number;
  created_at: string;
  wallet_address: string;
  source: string;
  points: number;
  airdrop_nft_tasks?: string[];
}
export type MigrationDbInsert = Omit<MigrationDb, "id" | "created_at">;

const getUserByEthAddress = async (wallet_address: string) => {
  const { data, error } = await supabase
    .from("user") // pastikan nama tabel jamak
    .select("*")
    .eq("eth_address", wallet_address.toLowerCase())
    .maybeSingle();

  if (error) {
    console.error("getUserByEthAddress error:", error);
    throw error;
  }

  return data as UserProfileDb | null;
};

const getUserTaskByTaskIdAndUserId = async (
  taskId: string,
  userId: string
): Promise<TaskUserDb | null> => {
  const { data, error } = await supabase
    .from("user_tasks")
    .select("*")
    .eq("task_id", taskId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("getUserTaskByTaskIdAndUserId error:", error);
    return null;
  }
  return data;
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const apiKey = req.headers.get("x-api-key");
  const wallet_address = searchParams.get("wallet_address");
  const correctKey = process.env.AIRDROP_SHARED_SECRET_KEY;

  // 🔸 Validation
  if (!wallet_address)
    return NextResponse.json({ message: "Wallet address required" }, { status: 400 });

  if (!apiKey || apiKey !== correctKey)
    return NextResponse.json({ message: "Invalid API key" }, { status: 401 });

  const user = await getUserByEthAddress(wallet_address);
  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  const migrationData = await getMigrationDataByAddress(wallet_address);

  // 🔸 Cek NFT tasks
  const nftTaskProgress = await Promise.all(
    NFT_TASKS.map((taskId) => getUserTaskByTaskIdAndUserId(taskId, user.id!))
  );

  const completedTasks = nftTaskProgress
    .filter((t): t is TaskUserDb => t !== null && t.status === "completed")
    .map((t) => t.task_id);

  let points = 0;

  // 🔹 Jika user sudah migrasi, pakai poin lama
  if (migrationData) {
    points = migrationData.points ?? 0;
  } else {
    // 🔹 Jika belum, ambil data web + galxe
    const [web, galxe] = await Promise.all([
      getUserPoints(user.id),
      getGalxeDataByEthAddress(user.eth_address),
    ]);

    const webPoints = web?.[0]?.total_points ?? 0;
    const galxePoints = galxe.data?.total_points ?? 0;
    points = webPoints + galxePoints;
  }

  const finalData: MigrationDbInsert = {
    wallet_address: wallet_address.toLowerCase(),
    source: "airdrop",
    points,
    airdrop_nft_tasks: completedTasks,
  };

  return NextResponse.json({ finalData });
}
