import { Airdrop } from "@/@types/airdrop";
import { supabase } from "./client";

const tableName = "airdrop";

export async function createNewAirdrop(data: Airdrop) {
  try {
    const { error } = await supabase.from(tableName).insert(data);

    if (error) throw error;
    
  } catch (error) {
    console.error(error);
    throw error;
  }
}
