import {
  createNewAirdrop,
  deleteAirdrop,
  editAirdrop,
} from "@/utils/supabase/airdropTable";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  await createNewAirdrop(data);

  return NextResponse.json({ message: "Success" }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "No ID provided" }, { status: 400 });
  }

  try {
    await deleteAirdrop(id);

    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete API error:", error);
    return NextResponse.json(
      { message: error.message ?? "Failed to delete airdrop" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.json();

    await editAirdrop(formData);

    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (error: any) {
    console.error("Edit Airdrop Error:", error);

    return NextResponse.json(
      { message: error.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}
