import { UserProfile, UserProfileDb } from "@/@types/user";
import bcrypt from "bcryptjs";

export async function mapClientUserToDb(
  raw: UserProfile
): Promise<UserProfileDb> {
  const hashedPassword = await bcrypt.hash(String(raw.password), 10);

  return {
    full_name: raw.name,
    email: raw.email,
    password: hashedPassword,
    telegram_username: raw.telegramUsername,
    discord_username: raw.discordUsername,
    eth_address: raw.ethAddress,
    twitter_username: raw.twitterUsername,
    role: raw.role ?? "user",
    referral_code: raw.referralCode,
    referred_by: raw.referredBy,
  };
}
