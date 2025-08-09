export interface UserProfile {
  readonly id?: string;
  readonly userId?: string;
  name: string;
  email: string;
  password?: string;
  telegramUsername: string;
  discordUsername: string;
  twitterUsername: string;
  ethAddress: string;
  role?: string;
  referralCode?: string;
  referredBy?: string;
  referralCount?: number;
}

export interface UserProfileDb {
  id?: string;
  full_name: string;
  email: string;
  password?: string;
  telegram_username: string;
  discord_username: string;
  twitter_username: string;
  eth_address: string;
  role: string;
  referral_code?: string;
  referred_by?: string;
}

export interface UserChangePassword {
  userId?: string;
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}
