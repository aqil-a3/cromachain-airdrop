import { TopReferrerRpc } from "@/@types/user";
import { supabase } from "../client";

export async function getTopReferrers(limit?: number): Promise<TopReferrerRpc[]> {
  const { data, error } = await supabase.rpc("get_top_referrers", {
    limit_count: limit,
  });

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}
