import { LeaderboardUser } from "@/@types/user";
import LeaderboardTemplate from "@/components/templates/LeaderboardTemplate";
import { getTopReferrers } from "@/utils/supabase/rpc/rpc-referrals";
import { getTotalParticipants } from "@/utils/supabase/rpc/rpc-users";
import { getUserByIdBulks } from "@/utils/supabase/userTable";

type LeaderboardNoRank = Omit<LeaderboardUser, "ranking">;

export default async function LeaderboardPage() {
  const topRefererrs = await getTopReferrers(10);
  const userIds = topRefererrs.map((top) => top.user_id);

  const [userProfiles, totalParticipants] = await Promise.all([
    getUserByIdBulks(userIds),
    getTotalParticipants(),
  ]);

  const raw: LeaderboardNoRank[] = userProfiles
    .map((user) => {
      const invitationCount = topRefererrs.find(
        (top) => top.user_id === user.id!
      )!.referral_count;

      return {
        createdAt: String(user.createdAt),
        smartContract: user.ethAddress,
        fullName: user.name,
        id: user.id!,
        invitationCount,
      };
    })
    .sort((a, b) => b.invitationCount - a.invitationCount);

  const data: LeaderboardUser[] = raw.map((d, i) => ({ ...d, ranking: i + 1 }));

  return (
    <LeaderboardTemplate
      leaderboarData={data}
      totalParticipants={totalParticipants}
    />
  );
}
