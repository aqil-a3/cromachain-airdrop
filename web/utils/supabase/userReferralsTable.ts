import { UserReferrals } from "@/@types/user_referrals";
import { getUserTaksCRMPointsByUserId } from "./userTaskTable";
import { supabase } from "./client";
import { BasicHttpResponse } from "@/@types/http";
import { getUserByReferrerCode } from "./userTable";
import { getReferralLimitPerDay } from "./sitesettingsTable";

const tableName = "user_referrals";

export async function calculateReferrerPoint(userId: string) {
  const referrerPoints = await getUserTaksCRMPointsByUserId(userId);

  const gainedPoints = (referrerPoints ?? 0) * 0.1;

  return gainedPoints;
}

/**
 *
 * @param referred_id User ID dari yang diundang
 * @param referrer_id User ID dari yang ngundang
 * @param referral_code Referral Code dari yang ngundang
 */
export async function createNewUserReferrals(
  referred_id: string,
  referrer_id: string,
  referral_code: string
) {
  const payload: UserReferrals = {
    referrer_id,
    referred_id,
    referral_code,
    points: await calculateReferrerPoint(referrer_id),
    source: "referrer",
  };

  const { data, error } = await supabase
    .from(tableName)
    .insert(payload)
    .select();

  if (!data || error) {
    console.error(error);
    throw error;
  }

  const userReferral: UserReferrals = data[0];

  return userReferral;
}

export async function getUserReferralsByReferrerId(referrerId: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("referrer_id", referrerId);

  if (!data || error) {
    console.error(error);
    throw error;
  }

  return data as UserReferrals[];
}

export async function getUserReferralsPointByReferrerId(referrerId: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select("points")
    .eq("referrer_id", referrerId);

  if (!data || error) {
    console.error(error);
    throw error;
  }

  const points: number = data
    .map((d) => d.points ?? 0)
    .reduce((acc, curr) => acc + curr, 0);

  return points;
}

export async function getAllUserReferrals() {
  const { data, error } = await supabase
    .from(tableName)
    .select("*, referrer_id(email, id), referred_id(email, id)");

  if (error) {
    console.error(error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data;
}
