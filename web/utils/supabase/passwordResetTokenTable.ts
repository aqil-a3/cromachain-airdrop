import { PasswordResetToken } from "@/@types/auth";
import { UserProfileDb } from "@/@types/user";
import { randomBytes } from "crypto"; // Untuk membuat token
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { supabase } from "./client";
import { sendResetPassword } from "@/lib/resend/sendResetPassword";
import { deleteUserPasswordById } from "./userTable";

dayjs.extend(utc);

const tableName = "password_reset_tokens";

export async function createNewResetToken(data: UserProfileDb) {
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

  await sendResetPassword(email, token);

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
    .eq("token", token);

  if (!data || error) {
    console.error(error);
    throw error;
  }
  const tokenData: PasswordResetToken = data[0];
  const email = data[0]?.user?.email as string | undefined;
  if (!tokenData)
    return {
      message: "Token is invalid!",
      email,
      isSuccess: false,
      status: 400,
      userId: "",
    };

  const { expired_at, used, user_id } = tokenData;

  const now = dayjs.utc();
  const expiredDate = dayjs.utc(expired_at);

  if (now > expiredDate) {
    return {
      message: "Token has expired!",
      email,
      isSuccess: false,
      status: 400,
      userId: "",
    };
  }

  if (used) {
    return {
      message: "Token has used!",
      email,
      isSuccess: false,
      status: 400,
      userId: "",
    };
  }

  await Promise.all([
    updateTokenToUsed(token),
    deleteUserPasswordById(user_id),
  ]);

  return {
    message: "Token is valid!",
    email,
    isSuccess: true,
    status: 200,
    userId: user_id,
  };
}

export async function updateTokenToUsed(token: string) {
  const { error } = await supabase
    .from(tableName)
    .update({ used: true })
    .eq("token", token);

  if (error) {
    console.error(error);
    throw error;
  }
}
