import AdminAirdropEditTemplate from "@/components/templates/admin/AdminAirdropEditTemplate";
import { getAirdropById } from "@/utils/supabase/airdropTable";

interface EditAirdropPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAirdropPage({ params }: EditAirdropPageProps) {
  const { id } = await params;
  const airdrop = await getAirdropById(id);

  return <AdminAirdropEditTemplate airdrop={airdrop} />;
}
