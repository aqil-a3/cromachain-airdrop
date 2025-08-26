import { PreviewCsv } from "@/components/features/admin/task-review/logics";
import { getUsersByEthAddresses } from "@/utils/supabase/userTable";
import { NextRequest, NextResponse } from "next/server";

const taskId = "Tunggu dulu"

export async function POST(req: NextRequest) {
  const eth_address_obj:PreviewCsv[] = await req.json();
  const eth_address = eth_address_obj.map((val) => val.eth_address);

  const userDb = await getUsersByEthAddresses(eth_address);

  return NextResponse.json({ message: "OK" });
}
