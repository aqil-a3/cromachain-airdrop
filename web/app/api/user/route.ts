import { UserProfile, UserProfileDb } from "@/@types/user";
import { mapClientUserToDb } from "@/lib/map-data/mapClientUserToDb";
import { userTable } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const raw: UserProfile = await req.json();
  const data = mapClientUserToDb(raw);

  const { data: allUSers, error: errorUsers } = await userTable.select("*");

  if (!allUSers || errorUsers){
    console.error(errorUsers)
    throw new Error("Something wrong when fetching data");
  }

  for (const user of allUSers) {
    const compared: UserProfileDb = user;

    if (compared.email === data.email)
      return NextResponse.json(
        {
          message: `Email for ${data.email} already used!`,
        },
        { status: 409 }
      );
    else if (compared.telegram_username === data.telegram_username)
      return NextResponse.json(
        {
          message: `Telegram username ${data.telegram_username} already used!`,
        },
        { status: 409 }
      );
    else if (compared.discord_username === data.discord_username)
      return NextResponse.json(
        {
          message: `Discord username ${data.discord_username} already used!`,
        },
        { status: 409 }
      );
    else if (compared.twitter_username === data.twitter_username)
      return NextResponse.json(
        {
          message: `Twitter username ${data.twitter_username} already used!`,
        },
        { status: 409 }
      );
    else if (compared.eth_address === data.eth_address)
      return NextResponse.json(
        {
          message: `Etherium adrress ${data.eth_address} already used!`,
        },
        { status: 409 }
      );
  }

  const { error } = await userTable.insert(data);

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error, message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const raw = await req.json();
  const userId = raw.userId;

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
