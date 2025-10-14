import { supabase } from "./client";

const tableName = "migration_data";

export interface MigrationDataDB {
  readonly id: number;
  readonly created_at: string;
  readonly user_id: string;
  wallet_address: string;
  points: number;
  from_address: string;
}

export type MigrationDataFromClient = Pick<
  MigrationDataDB,
  "wallet_address" | "points" | "from_address" | "user_id"
>;

export async function getMigrationData(): Promise<MigrationDataDB[]> {
  const { data, error } = await supabase.from(tableName).select("*");

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function getMigrationDataByUserId(
  user_id: string
): Promise<MigrationDataDB | null> {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("user_id", user_id)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function getMigrationDataByAddress(
  wallet_address: string
): Promise<MigrationDataDB | null> {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("wallet_address", wallet_address)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function getMigrationDataByCurrentAddress(
  from_address: string
): Promise<MigrationDataDB | null> {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("from_address", from_address)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function createNewMigrationData(payload: MigrationDataFromClient) {
  const { error } = await supabase.from(tableName).insert(payload);

  if (error) {
    console.error(error);
    throw error;
  }
}

export async function updatePointsByUserId(points: number, user_id: string) {
  const { error } = await supabase
    .from(tableName)
    .update({ points })
    .eq("user_id", user_id);

  if (error) {
    console.error(error);
    throw error;
  }
}
