import HomeTemplate from "@/components/templates/HomeTemplate";
import { getActiveAirdrop } from "@/utils/supabase/airdropTable";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const airdrop = await getActiveAirdrop();

  return <HomeTemplate airdrop={airdrop} />;
}
