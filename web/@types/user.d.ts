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
  createdAt?: string;
  referralCount?: number;
  verifiedAt?: string;
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
  created_at?: string;
  referral_code?: string;
  referred_by?: string;
  verified_at?: string;
}

export interface UserChangePassword {
  userId?: string;
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

export interface LeaderboardUser {
  id: string;
  ranking: number;
  fullName: string;
  smartContract: string;
  invitationCount: number;
  createdAt: string;
}

export interface TopReferrerRpc {
  user_id: string;
  referral_count: 1;
}
