import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { z } from "zod";
import type { BasicHttpResponse } from "@/@types/http";
import { getUserById } from "@/utils/supabase/userTable";
import { getUserPoints } from "@/utils/supabase/rpc/rpc-points";
import { getGalxeDataByEthAddress } from "@/utils/supabase/galxeTable";
import {
  createNewMigrationData,
  getMigrationDataByAddress,
  getMigrationDataByCurrentAddress,
  getMigrationDataByUserId,
  MigrationDataFromClient,
} from "@/utils/supabase/migrationTable";

type PatchResponse = Promise<NextResponse<BasicHttpResponse>>;

const evmAddress = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format");

const bodySchema = z.object({
  old_wallet_address: evmAddress,
  new_wallet_address: evmAddress,
});

/**
 * Aturannya
 * 1. Jika user belum login, akan error ("You have to login to continue this action"). Solusi, user harus login.
 * 2. Jika user asal isi address, akan error ("Invalid wallet address format"). Solusi, user harus isi yang benar
 * 3. Jika 'wallet saat ini' tidak sesuai dengan sesi loginnya, akan error ("Your current wallet address doesn't match the session. Please re-login and try again"). Solusi, relog dan coba lagi
 * 4. Jika 'wallet saat ini' tidak sesuai dengan yang ada di Database, akan error ("Your stored wallet does not match the provided old address"). Solusi, relog dan coba lagi.
 * 5. Jika 'wallet address baru' sama dengan 'wallet address saat ini', akan error ("New wallet address must be different"). Solusi, pastikan addressnya berbeda
 * 6. Jika 'wallet address baru' sudah pernah ditambahkan, akan error ("Data with wallet address {new wallet address} is exist! Action dennied"). Solusi, jangan curang! Tobat
 *
 * NOTE:
 * - Harusnya, kalau sudah relog poin 3 dan 4 udah minim.
 */

export async function POST(req: NextRequest): PatchResponse {
  // 1) Auth
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "You have to login to continue this action" },
      { status: 401 }
    );
  }

  // 2) Parse JSON safely
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // 3) Validate body
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return NextResponse.json(
      { success: false, message: first?.message ?? "Invalid request body" },
      { status: 422 }
    );
  }

  const oldAddr = parsed.data.old_wallet_address.toLowerCase();
  const newAddr = parsed.data.new_wallet_address.toLowerCase();

  // 4) Validate session wallet
  const sessionAddr = session.user?.ethAddress?.toLowerCase?.();
  if (!sessionAddr) {
    return NextResponse.json(
      { success: false, message: "Your session has no wallet address" },
      { status: 400 }
    );
  }

  if (sessionAddr !== oldAddr) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Your current wallet address doesn't match the session. Please re-login and try again.",
      },
      { status: 400 }
    );
  }

  // 5) (Optional) Double-check DB state to avoid stale session
  const user = await getUserById(session.user.userId!);
  if (user?.ethAddress?.toLowerCase() !== oldAddr) {
    return NextResponse.json(
      {
        success: false,
        message: "Your stored wallet does not match the provided old address",
      },
      { status: 409 }
    );
  }

  // 6) Denny action if old Address has used
  const existingOldData = await getMigrationDataByCurrentAddress(oldAddr);
  if (existingOldData)
    return NextResponse.json(
      {
        success: false,
        message: `Address ${oldAddr} has used! Action dennied`,
      },
      { status: 400 }
    );

    
    // 7) Denny action if new Address is Exist. One account only one wallet address
    const existingData = await getMigrationDataByAddress(newAddr);

  if (existingData)
    return NextResponse.json(
      {
        success: false,
        message: `Data with wallet address ${newAddr} is exist! Action dennied`,
      },
      { status: 400 }
    );

  // 8) Deny action if user_id is exist.
  const existingUserId = await getMigrationDataByUserId(user.userId!);
  if(existingUserId)
    return NextResponse.json({
        success: false,
        message: `Your account have updated a wallet! Action dennied!`,
      },
      { status: 400 }
    )

  // Get all user point from web and galxe
  const [web, galxe] = await Promise.all([
    getUserPoints(user.userId!),
    getGalxeDataByEthAddress(user.ethAddress),
  ]);

  let galxePoints: number = 0;

  if (galxe.data) galxePoints = galxe.data.total_points;

  const total_points = web[0].total_points + galxePoints;
  const payload: MigrationDataFromClient = {
    user_id: session.user.userId!,
    points: total_points,
    wallet_address: newAddr,
    from_address: oldAddr,
  };

  await createNewMigrationData(payload);

  return NextResponse.json({ success: true, message: "OK" }, { status: 200 });
}
