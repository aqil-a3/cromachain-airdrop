import { SiteSettings } from "@/@types/site-settings";
import { supabase } from "./client";

const tableName = "site_settings";

export async function getAllSiteSettings() {
  const { data, error } = await supabase.from(tableName).select("*");

  if (error) {
    console.error(error);
    throw error;
  }

  if (!data) return [] as SiteSettings[];

  return data as SiteSettings[];
}

export async function getFictionUserLeaderboard() {
  const key = [
    "first_rank_leaderboard",
    "second_rank_leaderboard",
    "third_rank_leaderboard",
  ];

  const { error, data } = await supabase
    .from(tableName)
    .select("*")
    .in("key", key)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    throw error;
  }

  return data as SiteSettings[];
}

export async function getReferralLimitPerDay() {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("key", "user_referrals_limit_per_day")
    .single();

  if (error || !data) {
    console.error(error);
    throw error;
  }

  const resData: SiteSettings<number> = data;

  return Number(resData.value);
}

export async function updateSiteSetting(payload: SiteSettings) {
  const { error } = await supabase
    .from(tableName)
    .update(payload)
    .eq("key", payload.key);

  if (error) {
    console.error(error);
    throw error;
  }
}
