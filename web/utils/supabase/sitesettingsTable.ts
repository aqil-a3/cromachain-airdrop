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
