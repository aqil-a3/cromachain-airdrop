import { createNewAirdrop, deleteAirdrop } from "@/utils/supabase/airdropTable";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  await createNewAirdrop(data);

  return NextResponse.json({ message: "Success" }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");

  if (!id) throw new Error("No Id");

  await deleteAirdrop(id);

  return NextResponse.json({ message: "ok" });
}
