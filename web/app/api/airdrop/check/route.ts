import { DBCodeType, ResponseWithData } from "@/@types/http";
import { TotalUserPoints } from "@/@types/user-points";
import { auth } from "@/auth";
import { getGalxeDataByEthAddress } from "@/utils/supabase/galxeTable";
import {
  getMigrationDataByUserId,
  updatePointsByUserId,
} from "@/utils/supabase/migrationTable";
import { getUserPoints } from "@/utils/supabase/rpc/rpc-points";
import { getUserByEthAddress } from "@/utils/supabase/userTable";
import { getUserTaskByBulksTaskIdAndUserId } from "@/utils/supabase/userTaskTable";
import { NextRequest, NextResponse } from "next/server";

type CodeType =
  | "ETHERIUM_REQUIRED"
  | "SOURCE_REQUIRED"
  | "LOGIN_REQUIRED"
  | "NFT_BUY_REQUIRED"
  | DBCodeType;
type Response = ResponseWithData<null | TotalUserPoints, CodeType>;
type GetResponse = Promise<NextResponse<Response>>;

const messageResponse: Record<CodeType, string> = {
  BANNED_ACCOUNT: "Your account is banned",
  ERROR_DB: "Something went error",
  ETHERIUM_REQUIRED: "Etherium is required",
  SOURCE_REQUIRED: "Source data is required",
  NOT_FOUND: "Account not found",
  SUCCESS: "Success",
  LOGIN_REQUIRED: "You have to login to continue this action!",
  NFT_BUY_REQUIRED: "You have to buy at least 1 NFT to see your ballance",
};

const NFTBuyTasksId: string[] = [
  "f7f89788-d176-4d8c-a5e4-f87f4500bb1e", // Buy NFTs & Unlock Extra CROMA
  "4038bc6d-a2ce-4bb1-8ced-9e91468197b1", // Buy NFTs Pavel Durov & Unlock Extra CROMA
  "ee74e98e-eb6b-4dbf-afd6-a02550489573", // Buy NFTs The Visionary’s Smile & Unlock Extra CROMA
  "11f4a316-5a69-4893-b70e-79e260c2aca3", // Buy the 2nd NFT & Unlock Extra CROMA
  "06e075ae-721f-416a-9251-07db24c05c40", //Verify NFT Purchase
  "302bd96e-5ec7-4be7-b83a-c557638e485f", // Token 11
];

export async function GET(req: NextRequest): GetResponse {
  const { searchParams } = req.nextUrl;
  const session = await auth();
  const eth_address = searchParams.get("ethAddressInput");
  const source = searchParams.get("source") as "galxe" | "web" | "all" | null;

  if (!session)
    return NextResponse.json(
      {
        data: null,
        success: false,
        code: "LOGIN_REQUIRED",
        message: messageResponse["LOGIN_REQUIRED"],
      },
      {
        status: 401,
      }
    );

  const NFTBuyTasks = await getUserTaskByBulksTaskIdAndUserId(
    NFTBuyTasksId,
    session.user.userId!
  );

  const NFTTaskStatus = NFTBuyTasks.filter(
    (task) => task.status === "completed"
  );

  if (NFTTaskStatus.length < 1)
    return NextResponse.json(
      {
        data: null,
        success: false,
        code: "NFT_BUY_REQUIRED",
        message: messageResponse["NFT_BUY_REQUIRED"],
      },
      { status: 400 }
    );

  if (!source)
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: messageResponse["SOURCE_REQUIRED"],
      },
      { status: 400 }
    );

  if (source === "web") {
    if (!eth_address)
      return NextResponse.json(
        {
          data: null,
          message: messageResponse["ETHERIUM_REQUIRED"],
          code: "ETHERIUM_REQUIRED",
          success: false,
        },
        { status: 400 }
      );

    const {
      data: user,
      success,
      code,
    } = await getUserByEthAddress(eth_address.toLowerCase());
    if (!success)
      return NextResponse.json({
        data: null,
        success,
        message: messageResponse[code as CodeType],
      });

    const userId = user!.id;

    const userPoint = await getUserPoints(userId);

    return NextResponse.json({
      message: messageResponse["SUCCESS"],
      data: userPoint[0],
      success: true,
    });
  }

  if (source === "all") {
    const userPoint = await getMigrationDataByUserId(session.user.userId!);

    if (!userPoint)
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: "Data not found! Have you update your wallet?",
        },
        {
          status: 400,
        }
      );

    const points: TotalUserPoints = {
      total_points: userPoint.points,
      user_id: userPoint.user_id,
    };

    // TODO : Ini kayaknya pisah aja dah

    // const [web, galxe] = await Promise.all([
    //   getUserPoints(session.user.userId!),
    //   getGalxeDataByEthAddress(session.user.ethAddress),
    // ]);

    // let galxePoints: number = 0;

    // if (galxe.data) galxePoints = galxe.data.total_points;
    // const total_points = web[0].total_points + galxePoints;

    // await updatePointsByUserId(total_points, session.user.userId!)

    return NextResponse.json({
      message: "Success",
      data: points,
      success: true,
    });
  }

  if (!eth_address)
    return NextResponse.json(
      {
        data: null,
        message: messageResponse["ETHERIUM_REQUIRED"],
        code: "ETHERIUM_REQUIRED",
        success: false,
      },
      { status: 400 }
    );

  const userPoint = await getGalxeDataByEthAddress(eth_address);

  if (!userPoint.success)
    return NextResponse.json({
      message: messageResponse[userPoint.code!],
      success: userPoint.success,
      data: null,
    });

  return NextResponse.json({
    message: messageResponse["SUCCESS"],
    data: userPoint.data,
    success: true,
  });
}
