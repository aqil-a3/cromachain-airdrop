import { UserProfile, UserProfileDb } from "@/@types/user";

export function mapClientUserToDb(raw: UserProfile): UserProfileDb {
  return {
    full_name: raw.name,
    email: raw.email,
    telegram_username: raw.telegramUsername,
    discord_username: raw.discordUsername,
    eth_address: raw.ethAddress,
    twitter_username: raw.twitterUsername,
    role: raw.role ?? "user",
  };
}
