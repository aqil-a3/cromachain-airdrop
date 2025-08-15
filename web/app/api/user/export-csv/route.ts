import { convertToCSV } from "@/utils/paparse/exportToCsv";
import { getUserPoints } from "@/utils/supabase/rpc/rpc-points";
import { getAllActiveUser } from "@/utils/supabase/userTable";
import { NextResponse } from "next/server";

export async function GET() {
  const [users, points] = await Promise.all([
    getAllActiveUser(),
    getUserPoints(),
  ]);
  const data = users.map((user) => {
    const userPoint = points.find((p) => p.user_id === user.id);
    return {
      ...user,
      point: userPoint?.total_points ?? 0,
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
