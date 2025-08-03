import { randomBytes } from "crypto";
import dayjs from "dayjs";
import { supabase } from "./client";
import { PasswordResetToken } from "@/@types/auth";

const tableName = "telegram_verification_token";

export async function createNewTelegramToken(
  userId: string,
  telegramUsername: string
) {
  const token = randomBytes(32).toString("hex");

  const expired_at = dayjs().add(10, "minutes").toISOString();

  const payload = {
    user_id: userId,
    token,
    used: false,
    expired_at,
    telegram_username: telegramUsername,
  };

  const { error } = await supabase.from(tableName).insert(payload);

  if (error) {
    console.error(error);
    throw error;
  }

  return token;
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

export async function getTokenDataByToken(token: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("token", token);

  if (error) {
    console.error(error);
    throw error;
  }

  if (!data || data.length === 0) return null;

  return data[0] as PasswordResetToken;
}
