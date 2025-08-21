import { PasswordResetToken } from "@/@types/auth";
import { UserProfileDb } from "@/@types/user";
import { randomBytes } from "crypto";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { supabase } from "./client";
import { sendEmailVerificationCode } from "@/lib/resend/sendVerificationEmail";
import {
  getUserById,
  getUserByReferrerCode,
  patchUserEmailVerifiedById,
} from "./userTable";
import { createNewUserReferrals } from "./userReferralsTable";

dayjs.extend(utc);

const tableName = "email_verification_tokens";

export async function createNewEmailVerification(data: UserProfileDb) {
  const { id, email } = data;

  const token = randomBytes(32).toString("hex");

  const expired_at = dayjs().add(10, "minutes").toISOString();

  const payload: PasswordResetToken = {
    user_id: String(id),
    token,
    used: false,
    expired_at,
  };

  const { error } = await supabase.from(tableName).insert(payload);

  await sendEmailVerificationCode(email, token);

  if (error) {
    console.error(error);
    return {
      message: error.message,
      status: 500,
    };
  }

  return {
    message: "Check your email for password reset link",
    status: 200,
  };
}

export async function isValidToken(token: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*, user: user_id(email)")
    .eq("token", token)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {
      message: "Internal error",
      isSuccess: false,
      status: 500,
      userId: "",
    };
  }

  if (!data) {
    return {
      message: "Token is invalid!",
      isSuccess: false,
      status: 400,
      userId: "",
    };
  }

  const { expired_at, used, user_id, user } = data;
  const email = user?.email;
  const now = dayjs.utc();

  if (dayjs.utc(expired_at).isBefore(now)) {
    return {
      message: "Token has expired!",
      email,
      isSuccess: false,
      status: 410,
      userId: "",
    };
  }

  if (used) {
    return {
      message: "Token already used!",
      email,
      isSuccess: false,
      status: 409,
      userId: "",
    };
  }

  // Mark as used atomically
  const { error: updateError } = await supabase
    .from(tableName)
    .update({ used: true })
    .eq("token", token)
    .eq("used", false);

  if (updateError) {
    console.error(updateError);
    return {
      message: "Failed to update token",
      isSuccess: false,
      status: 500,
      userId: "",
    };
  }

  // Verify email
  await patchUserEmailVerifiedById(user_id);

  // Handle referral
  const { referredBy } = await getUserById(user_id);
  if (referredBy) {
    const referrer = await getUserByReferrerCode(referredBy);
    if (referrer) {
      await createNewUserReferrals(
        user_id,
        referrer.id!,
        referrer.referralCode!
      );
    }
  }

  return {
    message: "Email verified successfully!",
    email,
    isSuccess: true,
    status: 200,
    userId: user_id,
  };
}
