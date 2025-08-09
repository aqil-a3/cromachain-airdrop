import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAdminUserData } from "../provider";
import { Info } from "lucide-react";
import { UserReferralsReferrerId } from "@/@types/user_referrals";

export default function ReferredCountCell({ referralCode }: { referralCode?: string }) {
  const { userReferrals } = useAdminUserData();

  const userReferred = referralCode
    ? userReferrals.filter((user) => user.referral_code === referralCode)
    : [];

  const hasInvited = userReferred.length > 0;

  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-2">
        <span>{userReferred.length}</span>
        <Info size={16} />
      </PopoverTrigger>
      <PopoverContent className="w-64">
        {hasInvited ? (
          <ul className="list-disc list-inside space-y-1">
            {userReferred.map((user, index) => {
              const referredEmail = (user.referred_id as UserReferralsReferrerId)?.email;
              return (
                <li key={index}>
                  {referredEmail || <em className="text-gray-400">No email available</em>}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            This user hasn’t invited anyone yet.
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
