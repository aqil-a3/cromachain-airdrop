import HomeTemplate from "@/components/templates/HomeTemplate";
import { getActiveAirdrop } from "@/utils/supabase/airdropTable";
import { getTotalParticipants } from "@/utils/supabase/rpc/rpc-users";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [airdrop, totalParticipants] = await Promise.all([getActiveAirdrop(), getTotalParticipants()]);

  return <HomeTemplate airdrop={airdrop} totalParticipants={totalParticipants} />;
}
