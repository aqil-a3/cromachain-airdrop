import AdminAirdropTemplate from "@/components/templates/admin/AdminAirdropTemplate";
import { getAllAirdrop } from "@/utils/supabase/airdropTable";

export default async function AirdropAdminPage() {
  const airdrops = await getAllAirdrop();
  return <AdminAirdropTemplate airdrops={airdrops} />;
}
