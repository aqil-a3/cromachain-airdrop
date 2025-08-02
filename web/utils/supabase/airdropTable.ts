import { Airdrop } from "@/@types/airdrop";
import { supabase } from "./client";

const tableName = "airdrop";

export async function createNewAirdrop(formData: Airdrop) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert(formData)
      .select("id")
      .single();

    if (!data || error) throw error;
    const { id } = data;

    const { error: editError } = await supabase
      .from(tableName)
      .update({ is_active: false })
      .neq("id", id);

    if (editError) throw editError;
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

export async function getActiveAirdrop() {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .is("is_active", true)
    .single();

  if (error || !data) {
    console.error(error);
    throw error;
  }

  return data as Airdrop;
}

export async function getAirdropById(id: string) {
  const raw = await supabase.from(tableName).select("*").eq("id", id).single();
  const { data, error } = raw;

  if (error || !data) {
    console.error(error);
    throw error;
  }

  return data as Airdrop;
}

export async function deleteAirdrop(id: string) {
  const { data: allAirdrops, error: fetchError } = await supabase
    .from(tableName)
    .select("id");

  if (fetchError) {
    console.error("Failed to fetch airdrops:", fetchError);
    throw fetchError;
  }

  if (!allAirdrops || allAirdrops.length <= 1) {
    throw new Error("You cannot delete the last remaining airdrop.");
  }

  const { error } = await supabase.from(tableName).delete().eq("id", id);

  if (error) {
    console.error("Failed to delete airdrop:", error);
    throw error;
  }
}


export async function editAirdrop(data: Airdrop) {
  if (!data.id) throw new Error("Missing airdrop ID.");

  if ("is_active" in data && data.is_active === false) {
    throw new Error(
      "You can't set this airdrop to false manually. Set another airdrop to active (true) instead."
    );
  }

  try {
    // Jika ingin aktifkan airdrop ini, nonaktifkan semua lainnya dulu
    if (data.is_active === true) {
      const { error: deactivateError } = await supabase
        .from(tableName)
        .update({ is_active: false })
        .neq("id", data.id);

      if (deactivateError) throw deactivateError;
    }

    const { error } = await supabase
      .from(tableName)
      .update(data)
      .eq("id", data.id);

    if (error) throw error;
  } catch (error) {
    console.error("Failed to edit airdrop:", error);
    throw error;
  }
}
