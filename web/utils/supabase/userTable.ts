import { UserProfileDb } from "@/@types/user";
import { supabase } from "./client";
import { mapDbUserToClient } from "@/lib/map-data/mapDbUserToClient";

/** Helper Function for "user" Table in Supabase */
const tableName = "user";

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("email", email);

  if (!data || error) {
    console.error(error);
    throw error;
  }

  const userDb: UserProfileDb = data[0];
  const user = mapDbUserToClient(userDb);

  return user;
}
