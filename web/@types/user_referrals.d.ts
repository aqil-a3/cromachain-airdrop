export interface UserReferrals {
  id?: number;
  referrer_id: string | UserReferralsReferrerId;
  referred_id: string | UserReferralsReferrerId;
  points: number;
  source: string;
  referral_code: string;
  created_at?: string;
}

export interface UserReferralsReferrerId {
  email: string;
  id: string;
}

export interface UserReferralsReferredId {
  email: string;
  id: string;
}
