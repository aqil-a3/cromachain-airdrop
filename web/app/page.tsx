import { LeaderboardUser } from "@/@types/user";
import HomeTemplate from "@/components/templates/HomeTemplate";
import { getActiveAirdrop } from "@/utils/supabase/airdropTable";
import { getTotalParticipants } from "@/utils/supabase/rpc/rpc-users";
import { getFictionUserLeaderboard } from "@/utils/supabase/sitesettingsTable";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [airdrop, totalParticipants, fictionParticipants] = await Promise.all([
    getActiveAirdrop(),
    getTotalParticipants(),
    getFictionUserLeaderboard(),
  ]);

  const fictionParticipantsCount = fictionParticipants.map((fiction) => {
      const value = fiction.value as LeaderboardUser;
      return value.invitationCount;
    }).reduce((acc, curr) => acc+curr, 0);

  return (
    <HomeTemplate airdrop={airdrop} totalParticipants={totalParticipants + fictionParticipantsCount} />
  );
}
