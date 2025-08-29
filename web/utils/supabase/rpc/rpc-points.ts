import { TotalUserPoints, UserPoints, UserReferralsPoint, UserTasksPoint } from "@/@types/user-points";
import { supabase } from "../client";

export async function getUserTasksPoints() {
  const { data, error } = await supabase.rpc("get_user_tasks_points");

  if (error) {
    console.error(error);
    throw error;
  }

  return data as UserTasksPoint[];
}

export async function getUserReferralsPoints() {
  const { data, error } = await supabase.rpc("get_user_referrals_points");

  if (error) {
    console.error(error);
    throw error;
  }

  return data as UserReferralsPoint[];
}

export async function getUserPoints(userId?: string) {
  const { data, error } = await supabase.rpc("get_user_points", {
    p_user_id: userId,
  });
  
  if(error){
    console.error(error)
    throw error;
  };

  return data as TotalUserPoints[]
}

export async function getAllUserPoints() {
  let from = 0;
  let to = 999;
  let allPoints: any[] = [];

  while (true) {
    const { data, error } = await supabase
      .rpc("get_all_user_points")
      .range(from, to);

    if (error) throw error;

    allPoints.push(...(data ?? []));
    if (!data || data.length < 1000) break; // sudah habis

    from += 1000;
    to += 1000;
  }

  return allPoints;
}
