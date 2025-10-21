import { UserProfileDb } from "@/@types/user";
import { supabase } from "@/utils/supabase/client";
import { getGalxeDataByEthAddress } from "@/utils/supabase/galxeTable";
import { getMigrationDataByAddress } from "@/utils/supabase/migrationTable";
import { getUserPoints } from "@/utils/supabase/rpc/rpc-points";
import { getUserTaskByTaskIdAndUserId } from "@/utils/supabase/userTaskTable";
// import { getUserByEthAddress } from "@/utils/supabase/userTable";
import { NextRequest, NextResponse } from "next/server";

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

export interface MigrationDb {
  id: number;
  created_at: string;
  wallet_address: string;
  source: string;
  points: number;
  is_valid?: boolean;
}
export type MigrationDbInsert = Omit<MigrationDb, "id" | "created_at">;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const headers = req.headers;
  const apiKey = headers.get("x-api-key");
  const correctKey = process.env.AIRDROP_SHARED_SECRET_KEY;
  const wallet_address = searchParams.get("wallet_address");

  if (!wallet_address)
    return NextResponse.json(
      { message: "Wallet address required" },
      { status: 400 }
    );
  if (!apiKey)
    return NextResponse.json({ message: "Key required" }, { status: 401 });
  if (apiKey !== correctKey)
    return NextResponse.json(
      { message: "Key is invalid! Access Denied" },
      { status: 401 }
    );

  let finalData: MigrationDbInsert = {} as MigrationDbInsert;

  const migrationData = await getMigrationDataByAddress(wallet_address);
  if (migrationData) {
    ((finalData.is_valid = true),
      (finalData.points = migrationData.points),
      (finalData.source = "airdrop"),
      (finalData.wallet_address = migrationData.wallet_address));
  } else {
    const activeUser = await getUserByEthAddress(wallet_address);
    if (!activeUser)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    let webPoints = 0;

    const [web, galxe] = await Promise.all([
      getUserPoints(activeUser.id!),
      getGalxeDataByEthAddress(activeUser.eth_address),
    ]);

    if (web && web.length > 0) {
      webPoints = web[0].total_points;
    }

    let galxePoints: number = 0;

    if (galxe.data) galxePoints = galxe.data.total_points;

    const total_points = webPoints + galxePoints;

    const NFT_TASKS = [
      "f7f89788-d176-4d8c-a5e4-f87f4500bb1e",
      "4038bc6d-a2ce-4bb1-8ced-9e91468197b1",
      "ee74e98e-eb6b-4dbf-afd6-a02550489573",
      "11f4a316-5a69-4893-b70e-79e260c2aca3",
    ];

    const nftTaskProgress = await Promise.all(
      NFT_TASKS.map((taskId) =>
        getUserTaskByTaskIdAndUserId(taskId, activeUser.id!)
      )
    );

    const hasNftTask = nftTaskProgress.some((res) => res && res.length > 0);

    finalData.wallet_address = activeUser.eth_address.toLowerCase();
    finalData.points = total_points;
    finalData.source = "airdrop";
    finalData.is_valid = hasNftTask;
  }

  return NextResponse.json({ finalData });
}
