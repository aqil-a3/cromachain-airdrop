export interface UserReferrals {
  id?: number;
  referrer_id: string;
  referred_id: string;
  points: number;
  source: string;
  referral_code: string;
  created_at?: string;
}
