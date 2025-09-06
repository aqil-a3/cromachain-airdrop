// import { TaskUser } from "@/@types/task-user";
// import { auth } from "@/auth";
// import { opensea } from "@/utils/opensea/api";
// import { gettaskRewardByTaskIdBulks } from "@/utils/supabase/taskTable";
// import {
//   getUserTaskByTaskIdAndUserId,
//   updateStatusUserTasksBulks,
// } from "@/utils/supabase/userTaskTable";
// import { NextRequest, NextResponse } from "next/server";

// const CROMA_WALLET_ADDRESS = "0x119fd986e1c30cc6e2e28993c9bdbc1b5e466116";
// const CROMA_SMART_CONTRACT = "0x1d53b6c882ac7fbd5ea0eeca00d59b843ef50525";

// const BASE_URL = "http://localhost:3000";
// // const BASE_URL = "https://airdrop.cromachain.com";
// const allowedToken = ["8", "10"];

// const taskIds: Record<string, string[]> = {
//   "8": [
//     "f7f89788-d176-4d8c-a5e4-f87f4500bb1e",
//     "06e075ae-721f-416a-9251-07db24c05c40",
//   ],
//   "10": ["SOON"],
// };

// export async function GET(req: NextRequest) {
//   const session = await auth();
//   const { getEventSalesByAccount } = opensea;
//   const { searchParams } = req.nextUrl;
//   const token = searchParams.get("token");

//   if (!session) {
//     return NextResponse.redirect(new URL("/", BASE_URL));
//   }

//   if (!token) {
//     return NextResponse.redirect(new URL("/", BASE_URL));
//   }

//   if (!allowedToken.includes(token))
//     return NextResponse.json({ message: "Access denied" });

//   const user = session.user;
//   const { ethAddress, userId } = user;

//   const res = await getEventSalesByAccount(CROMA_WALLET_ADDRESS);
//   const assets = res.asset_events;

//   // Filter transaksi tersebut agar hanya dari collection "croma-executive-portrait-series"
//   const selectedCollections =
//     assets.filter(
//       (val) =>
//         val.nft.contract.toLowerCase() === CROMA_SMART_CONTRACT &&
//         val.nft.identifier === token
//     ) ?? [];

//   // Kalau belum ada yang beli, otomatis user belum beli.
//   if (selectedCollections.length === 0)
//     return NextResponse.redirect(
//       new URL(
//         "/profile?opensea-task-message=You haven't bought NFT from our store.",
//         BASE_URL
//       )
//     );

//   //  Cari pembelinya
//   const buyer = selectedCollections.find(
//     (col) => col.buyer.toLowerCase() === ethAddress.toLowerCase()
//   );

//   //   Kalo pembeli tidak ditemukan, redirect dan beri pesan bahwa user belum beli
//   if (!buyer)
//     return NextResponse.redirect(
//       new URL(
//         "/profile?opensea-task-message=You haven't bought NFT from our store.",
//         BASE_URL
//       )
//     );

//   //   Pertama-tama, ambil data dari tugas terkait
//   if (token === "8") {
//     const TASK_IDS: string[] = taskIds["8"];
//     const tasks = await gettaskRewardByTaskIdBulks(TASK_IDS);
//     const verifTask = await getUserTaskByTaskIdAndUserId(
//       "06e075ae-721f-416a-9251-07db24c05c40",
//       userId!
//     );
//     const buyTask = await getUserTaskByTaskIdAndUserId(
//       "f7f89788-d176-4d8c-a5e4-f87f4500bb1e",
//       userId!
//     );

//     const combinedTask = [...verifTask, ...buyTask];

//     if (verifTask[0].status === "completed")
//       return NextResponse.redirect(
//         new URL(
//           "/profile?opensea-task-message=You've finished the task.",
//           BASE_URL
//         )
//       );

//     //   Selanjutnya, mapping agar sesuai bentuk DB
//     const payloads: TaskUser[] = tasks.map((task) => {
//       const selectedTaskUser = combinedTask.find(
//         (tur) => tur.task_id === task.id
//       );

//       return {
//         id: selectedTaskUser?.id,
//         taskId: task.id,
//         userId: userId!,
//         status: "completed",
//         rewardEarned: task.reward,
//         rewardType: task.reward_type,
//       };
//     });

//     //   Simpan
//     await updateStatusUserTasksBulks(payloads, "completed");
//   } else if (token === "10") {
//     const TASK_IDS: string[] = ["SOON"];
//     const tasks = await gettaskRewardByTaskIdBulks(TASK_IDS);
//     const verifTask = await getUserTaskByTaskIdAndUserId("SOON", userId!);

//     const combinedTask = [...verifTask];

//     if (verifTask[0].status === "completed")
//       return NextResponse.redirect(
//         new URL(
//           "/profile?opensea-task-message=You've finished the task.",
//           BASE_URL
//         )
//       );

//     //   Selanjutnya, mapping agar sesuai bentuk DB
//     const payloads: TaskUser[] = tasks.map((task) => {
//       const selectedTaskUser = combinedTask.find(
//         (tur) => tur.task_id === task.id
//       );

//       return {
//         id: selectedTaskUser?.id,
//         taskId: task.id,
//         userId: userId!,
//         status: "completed",
//         rewardEarned: task.reward,
//         rewardType: task.reward_type,
//       };
//     });

//     //   Simpan
//     await updateStatusUserTasksBulks(payloads, "completed");
//     return NextResponse.json({ message: "Tinggal nunggu taskID" });
//   }

//   return NextResponse.redirect(
//     new URL(
//       "/profile?opensea-task-message=Task Sucess! Thank's for buying from our store.",
//       BASE_URL
//     )
//   );
// }
