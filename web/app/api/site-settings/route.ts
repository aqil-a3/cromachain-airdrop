import { SiteSettings } from "@/@types/site-settings";
import { updateSiteSetting } from "@/utils/supabase/sitesettingsTable";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body: SiteSettings = await req.json();

  await updateSiteSetting(body);

  return NextResponse.json({ message: "OK" });
}
