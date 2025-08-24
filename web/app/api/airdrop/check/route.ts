import { DBCodeType, ResponseWithData } from "@/@types/http";
import { TotalUserPoints } from "@/@types/user-points";
import { getUserPoints } from "@/utils/supabase/rpc/rpc-points";
import { getUserByEthAddress } from "@/utils/supabase/userTable";
import { NextRequest, NextResponse } from "next/server";

type CodeType = "ETHERIUM_REQUIRED" | DBCodeType;
type Response = ResponseWithData<null | TotalUserPoints, CodeType>;
type GetResponse = Promise<NextResponse<Response>>;

const messageResponse: Record<CodeType, string> = {
  BANNED_ACCOUNT: "Your account is banned",
  ERROR_DB: "Something went error",
  ETHERIUM_REQUIRED: "Etherium is required",
  NOT_FOUND: "Account not found",
  SUCCESS: "Success",
};

export async function GET(req: NextRequest): GetResponse {
  const { searchParams } = req.nextUrl;
  const eth_address = searchParams.get("ethAddressInput");

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

  const { data: user, success, code } = await getUserByEthAddress(eth_address);
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
