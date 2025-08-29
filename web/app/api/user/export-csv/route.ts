import { convertToCSV } from "@/utils/paparse/csv";
import { getAllUserPoints, getUserPoints } from "@/utils/supabase/rpc/rpc-points";
import { getTopReferrers } from "@/utils/supabase/rpc/rpc-referrals";
import { getAllActiveUser } from "@/utils/supabase/userTable";
import { NextResponse } from "next/server";

export async function GET() {
  const [users, points, referrals] = await Promise.all([
    getAllActiveUser(),
    getAllUserPoints(),
    getTopReferrers(),
  ]);
  const data = users.map((user) => {
    const userPoint = points.find((p) => p.user_id === user.id);
    const userReferral = referrals.find((p) => p.user_id === user.id);
    return {
      ...user,
      point: userPoint?.total_points ?? 0,
      referralCount: userReferral?.referral_count ?? 0,
    };
  });

  const csv = convertToCSV(data);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="airdrop-user.csv"',
    },
  });
}
