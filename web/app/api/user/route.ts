import { mapClientUserToDb } from "@/lib/map-data/mapClientUserToDb";
import { userSchema, UserSchemaType } from "@/schemas/userSchema";
import { userTable } from "@/utils/supabase/client";
import {
  createNewUser,
  deleteSoftUSer,
  isDupplicateUser,
} from "@/utils/supabase/userTable";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const raw: UserSchemaType = await req.json();
  let parsedRaw = {} as UserSchemaType;

  try {
    parsedRaw = userSchema.parse(raw);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Format form is not valid" },
      { status: 400 }
    );
  }

  const data = await mapClientUserToDb(parsedRaw);

  const isDupplicate = await isDupplicateUser(data);

  if (isDupplicate) {
    return NextResponse.json(
      { message: isDupplicate.message },
      { status: 409 }
    );
  }

  await createNewUser(data);

  return NextResponse.json(
    { message: "User registration is success" },
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
