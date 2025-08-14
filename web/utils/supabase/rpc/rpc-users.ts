import { supabase } from "../client";

export async function getTotalParticipants() {
  const { data, error } = await supabase.rpc("get_total_participants");

  if (error) {
    console.error(error);
    throw error;
  }

  if (!data) return 0;
  return data as number;
}
