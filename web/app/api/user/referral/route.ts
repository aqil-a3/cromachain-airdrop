import { auth } from "@/auth";
import {
  createNewReferralCode,
  isHaveReferralCode,
} from "@/utils/supabase/userTable";
import { NextResponse } from "next/server";

export async function POST() {
  const authData = await auth();
  const user = authData?.user;
  if (!user)
    return NextResponse.json(
      { message: "Account not found! Please login" },
      { status: 404 }
    );

  let referralCode: string = "";

  const isHaveReferral = await isHaveReferralCode(user.userId as string);
  if (isHaveReferral) referralCode = isHaveReferral;
  else referralCode = await createNewReferralCode(user.userId as string);

  return NextResponse.json({
    message: "Referral code have been created!",
    referralCode,
  });
}
