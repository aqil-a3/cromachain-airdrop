import { mapClientUserToDb } from "@/lib/map-data/mapClientUserToDb";
import { UserSchemaType } from "@/schemas/userSchema";
import {
  createNewUserReferrals,
} from "@/utils/supabase/userReferralsTable";
import {
  createNewUser,
  isDupplicateUser,
  isLimittedReferral,
  isValidReferralCode,
} from "@/utils/supabase/userTable";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const rawData = await req.json();
  const clientData: UserSchemaType = rawData.formData;
  const referralCode: string | null = rawData.referralCode;

  if (!referralCode?.trim()) {
    return NextResponse.json(
      { message: "You don't have a referral code. Please register normally" },
      { status: 400 }
    );
  }

  const referrerId = await isValidReferralCode(referralCode);

  if (!referrerId) {
    return NextResponse.json(
      { message: "Your referral code is not valid" },
      { status: 400 }
    );
  }

  const isLimitted = await isLimittedReferral(referralCode);
  if (!isLimitted.success)
    return NextResponse.json({ message: isLimitted.message }, { status: 400 });

  const data = await mapClientUserToDb(clientData);
  data.referred_by = referralCode;

  const isDuplicate = await isDupplicateUser(data);

  if (isDuplicate) {
    return NextResponse.json({ message: isDuplicate.message }, { status: 409 });
  }

  await createNewUser(data);

  return NextResponse.json({ message: "Registration success!" });
}
