import { LeaderboardUser } from "@/@types/user";
import LeaderboardTemplate from "@/components/templates/LeaderboardTemplate";
import { getTopReferrers } from "@/utils/supabase/rpc/rpc-referrals";
import { getTotalParticipants } from "@/utils/supabase/rpc/rpc-users";
import { getFictionUserLeaderboard } from "@/utils/supabase/sitesettingsTable";
import { getUserByIdBulks } from "@/utils/supabase/userTable";

type LeaderboardNoRank = Omit<LeaderboardUser, "ranking">;

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const topRefererrs = await getTopReferrers(10);
  const userIds = topRefererrs.map((top) => top.user_id);

  const [userProfiles, totalParticipants, fictionParticipants] =
    await Promise.all([
      getUserByIdBulks(userIds),
      getTotalParticipants(),
      getFictionUserLeaderboard(),
    ]);

  const fictionParticipantsClean: LeaderboardNoRank[] = fictionParticipants
    .map((fiction) => {
      const value = fiction.value as LeaderboardUser;
      const isInvalid =
        Object.values(value).filter(
          (v) => v !== "" && v !== null && v !== undefined
        ).length !== 4;

      if (isInvalid) return undefined;

      return {
        createdAt: value.createdAt,
        fullName: value.fullName,
        smartContract: value.smartContract,
        invitationCount: value.invitationCount,
      };
    })
    .filter((item): item is LeaderboardNoRank => item !== undefined);

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

  const combinedUsers = [...fictionParticipantsClean, ...raw].slice(0, 10);

  const data: LeaderboardUser[] = combinedUsers.map((d, i) => ({
    ...d,
    ranking: i + 1,
  }));

  const fictionParticipantsCount = fictionParticipants.map((fiction) => {
    const value = fiction.value as LeaderboardUser;
    return value.invitationCount;
  }).reduce((acc, curr) => acc+curr, 0);

  return (
    <LeaderboardTemplate
      leaderboarData={data}
      totalParticipants={totalParticipants + fictionParticipantsCount}
    />
  );
}
