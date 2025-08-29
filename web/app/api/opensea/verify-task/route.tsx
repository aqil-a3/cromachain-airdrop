import { TaskUser } from "@/@types/task-user";
import { auth } from "@/auth";
import { opensea } from "@/utils/opensea/api";
import { gettaskRewardByTaskIdBulks } from "@/utils/supabase/taskTable";
import { updateStatusUserTasksBulks } from "@/utils/supabase/userTaskTable";
import { NextResponse } from "next/server";

const CROMA_WALLET_ADDRESS = "0x119fd986e1c30cc6e2e28993c9bdbc1b5e466116";
const TASK_IDS: string[] = [];

// const BASE_URL = "http://localhost:3000";
const BASE_URL = "https://airdrop.cromachain.com";

export async function GET() {
  const session = await auth();
  const { getEventSalesByAccount } = opensea;

  if (!session) {
    return NextResponse.redirect(new URL("/", BASE_URL));
  }

  const user = session.user;
  const { ethAddress, userId } = user;

  const res = await getEventSalesByAccount(CROMA_WALLET_ADDRESS);
  const assets = res.asset_events;

  // Filter transaksi tersebut agar hanya dari collection "croma-executive-portrait-series"
  const selectedCollections =
    assets.filter(
      (val) => val.nft.collection.toLowerCase() === "croma-executive-portrait-series"
    ) ?? [];

  // Kalau belum ada yang beli, otomatis user belum beli.
    if (selectedCollections.length === 0)
      return NextResponse.redirect(
        new URL(
          "/profile?opensea-task-message=You haven't bought NFT from our store.",
          BASE_URL
        )
      );

  //  Cari pembelinya
  const buyer = selectedCollections.find(
    (col) => col.buyer.toLowerCase() === ethAddress.toLowerCase()
  );

  //   Kalo pembeli tidak ditemukan, redirect dan beri pesan bahwa user belum beli
  if (!buyer)
    return NextResponse.redirect(
      new URL(
        "/profile?opensea-task-message=You haven't bought NFT from our store.",
        BASE_URL
      )
    );

  //   Kalo pembeli ditemukan, mapping dulu agar valid disimpan ke db

  //   Pertama-tama, ambil data dari tugas terkait
  const tasks = await gettaskRewardByTaskIdBulks(TASK_IDS);

  //   Selanjutnya, mapping agar sesuai bentuk DB
  const payloads: TaskUser[] = tasks.map((task) => ({
    taskId: task.id,
    userId: userId!,
    status: "completed",
    rewardEarned: task.reward,
    rewardType: task.reward_type,
  }));

  //   Simpan
  await updateStatusUserTasksBulks(payloads, "completed");

  return NextResponse.redirect(
    new URL(
      "/profile?opensea-task-message=Task Sucess! Thank's for buying from our store.",
      BASE_URL
    )
  );
}
