import { UserProfile, UserProfileDb } from "@/@types/user";
import { mapClientUserToDb } from "@/lib/map-data/mapClientUserToDb";
import { userTable } from "@/utils/supabase/client";
import {
  createNewUser,
  deleteSoftUSer,
  isDupplicateUser,
} from "@/utils/supabase/userTable";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const raw: UserProfile = await req.json();
  const data = mapClientUserToDb(raw);

  const isDupplicate = await isDupplicateUser(data);

  if (isDupplicate) {
    return NextResponse.json(
      { message: isDupplicate.message },
      { status: 409 }
    );
  }

  await createNewUser(data);

  return NextResponse.json(
    { message: "User berhasil ditambah" },
    { status: 200 }
  );
}

export async function PUT(req: NextRequest) {
  const raw = await req.json();
  const userId = raw.userId ?? raw.id;

  const formData = mapClientUserToDb(raw);

  const { data, error } = await userTable
    .update(formData)
    .eq("id", userId)
    .select();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ user: data }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");

  if (!id) throw new Error("Id is nothing!");

  await deleteSoftUSer(id);

  return NextResponse.json({ message: "Delete user success" }, { status: 200 });
}
