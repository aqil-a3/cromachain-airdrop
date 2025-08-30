import { UserNftRewardsDB } from "@/@types/user_nft_rewards";
import { supabase } from "./client";

const tableName = "user_nft_rewards";

export async function saveNftData(raw: UserNftRewardsDB[]) {
  const { data, error } = await supabase
    .from(tableName)
    .upsert(raw, { onConflict: "tx_hash", ignoreDuplicates: true });

  if (error) {
    console.error("❌ Error saving NFT data:", error);
    throw error;
  }

  return data;
}

export async function getNFTReferralsByInviterId(
  inviterId: string
): Promise<number> {
  const { data, error, count } = await supabase
    .from(tableName)
    .select("*", { count: "exact" })
    .eq("inviter_id", inviterId);

  if (error) {
    console.error(error);
    throw error;
  }

  if (!data || !count) return 0;

  return count;
}
