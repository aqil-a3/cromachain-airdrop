import { UserProfile, UserProfileDb } from "@/@types/user";

export function mapDbUserToClient(raw: UserProfileDb): UserProfile {
  return {
    name: raw.full_name,
    email: raw.email,
    telegramUsername: raw.telegram_username,
    discordUsername: raw.discord_username,
    ethAddress: raw.eth_address,
    twitterUsername: raw.twitter_username,
  };
}
