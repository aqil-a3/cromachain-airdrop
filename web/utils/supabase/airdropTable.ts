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

export async function getAllAirdrop() {
  const { data, error } = await supabase.from(tableName).select("*");

  if (error || !data) {
    console.error(error);
    throw error;
  }

  return data as Airdrop[];
}

export async function deleteAirdrop(id: string) {
  const { error } = await supabase.from(tableName).delete().eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
}