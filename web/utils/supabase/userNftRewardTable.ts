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
