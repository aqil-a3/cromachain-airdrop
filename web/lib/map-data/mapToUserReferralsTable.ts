import { UserReferrals } from "@/@types/user_referrals";

export function mapToUserReferralsTable(
  points: number,
  referral_code: string,
  referred_id: string,
  referrer_id: string
) {
  const result: UserReferrals = {
    points,
    referral_code,
    referred_id,
    referrer_id,
    source: "referrer",
  };

  return result;
}
