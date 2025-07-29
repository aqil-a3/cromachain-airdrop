import { PasswordResetToken } from "@/@types/auth";
import { UserProfileDb } from "@/@types/user";
import { randomBytes } from "crypto"; // Untuk membuat token
import dayjs from "dayjs";
import { supabase } from "./client";
import { sendResetPassword } from "@/lib/resend/sendResetPassword";

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
