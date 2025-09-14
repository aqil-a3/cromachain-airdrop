import { DBCodeType, ResponseWithData } from "@/@types/http";
import { TotalUserPoints } from "@/@types/user-points";
import { getGalxeDataByEthAddress } from "@/utils/supabase/galxeTable";
import {
  getMigrationDataByUserId,
  updatePointsByUserId,
} from "@/utils/supabase/migrationTable";
import { getUserPoints } from "@/utils/supabase/rpc/rpc-points";
import { getUserByEthAddress } from "@/utils/supabase/userTable";
import { NextRequest, NextResponse } from "next/server";

type CodeType = "ETHERIUM_REQUIRED" | "SOURCE_REQUIRED" | DBCodeType;
type Response = ResponseWithData<null | TotalUserPoints, CodeType>;
type GetResponse = Promise<NextResponse<Response>>;

const messageResponse: Record<CodeType, string> = {
  BANNED_ACCOUNT: "Your account is banned",
  ERROR_DB: "Something went error",
  ETHERIUM_REQUIRED: "Etherium is required",
  SOURCE_REQUIRED: "Source data is required",
  NOT_FOUND: "Account not found",
  SUCCESS: "Success",
};

export async function GET(req: NextRequest): GetResponse {
  const { searchParams } = req.nextUrl;
  const eth_address = searchParams.get("ethAddressInput");
  const source = searchParams.get("source") as "galxe" | "web" | "all" | null;

<<<<<<< HEAD
  if (!eth_address)
    return NextResponse.json(
      {
        data: null,
        message: messageResponse["ETHERIUM_REQUIRED"],
        code: "ETHERIUM_REQUIRED",
        success: false,
=======
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
>>>>>>> a338d9a (Check elig update)
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
