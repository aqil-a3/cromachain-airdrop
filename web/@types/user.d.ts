export interface UserProfile {
  name: string;
  email: string;
  telegramUsername: string;
  discordUsername: string;
  twitterUsername: string;
  ethAddress: string;
}

export interface UserProfileDb {
  full_name: string;
  email: string;
  telegram_username: string;
  discord_username: string;
  twitter_username: string;
  eth_address: string;
}
