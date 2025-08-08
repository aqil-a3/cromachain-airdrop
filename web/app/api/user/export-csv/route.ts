import { convertToCSV } from "@/utils/paparse/exportToCsv";
import { getAllActiveUser } from "@/utils/supabase/userTable";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await getAllActiveUser();
  const csv = convertToCSV(users);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="airdrop-user.csv"',
    },
  });
}
