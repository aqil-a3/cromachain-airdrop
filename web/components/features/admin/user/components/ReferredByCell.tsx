import { UserReferralsReferrerId } from "@/@types/user_referrals";
import { useAdminUserData } from "../provider";

export default function ReferredByCell({ userId }: { userId: string }) {
  const { userReferrals } = useAdminUserData();
  const selectedUser = userReferrals.find(
    (user) => (user.referred_id as UserReferralsReferrerId).id === userId
  );

  const referrerId = selectedUser?.referrer_id as UserReferralsReferrerId;

  return <div>{referrerId?.email ?? "-"}</div>;
}
