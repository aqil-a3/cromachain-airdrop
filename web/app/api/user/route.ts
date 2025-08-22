import { BasicHttpResponse } from "@/@types/http";
import { mapClientUserToDb } from "@/lib/map-data/mapClientUserToDb";
import { userSchema, UserSchemaType } from "@/schemas/userSchema";
import { userTable } from "@/utils/supabase/client";
import { createNewEmailVerification } from "@/utils/supabase/emailVerificatonCode";
import {
  createNewUser,
  deleteSoftUSer,
  isDupplicateUser,
} from "@/utils/supabase/userTable";
import { NextRequest, NextResponse } from "next/server";

type PostResponse = Promise<NextResponse<BasicHttpResponse>>;
export async function POST(req: NextRequest): PostResponse {
  const raw: UserSchemaType = await req.json();
  let parsedRaw = {} as UserSchemaType;

  try {
    parsedRaw = userSchema.parse(raw);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Format form is not valid", success: false },
      { status: 400 }
    );
  }

  if (!parsedRaw.isHuman)
    return NextResponse.json(
      {
        message: "Sorry, this action can't be continued because you're bot",
        success: false,
      },
      { status: 400 }
    );

  const data = await mapClientUserToDb(parsedRaw);

  const isDupplicate = await isDupplicateUser(data);

  if (isDupplicate) {
    return NextResponse.json(
      { message: isDupplicate.message, success: false },
      { status: 409 }
    );
  }

  const user = await createNewUser(data);
  await createNewEmailVerification(user);

  return NextResponse.json(
    {
      message: `Last step! We've sent an email verification to your email! ${user.email}.`,
      success: true,
    },
    { status: 200 }
  );
}

export async function PUT(req: NextRequest) {
  const raw = await req.json();
  const userId = raw.userId ?? raw.id;

  const formData = await mapClientUserToDb(raw);

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
