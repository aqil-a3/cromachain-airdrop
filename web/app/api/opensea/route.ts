import { OpenseaEventSaleResponse } from "@/@types/opensea";
import { UserNftRewardsDB } from "@/@types/user_nft_rewards";
import { opensea } from "@/utils/opensea/api";
import { saveNftData } from "@/utils/supabase/userNftRewardTable";
import {
  getUsersByEthAddresses,
  getUsersByReferrerCode,
} from "@/utils/supabase/userTable";
import { NextResponse } from "next/server";

const CROMA_WALLET_ADDRESS = "0x119fd986e1c30cc6e2e28993c9bdbc1b5e466116";

export async function GET() {
  const { getEventSalesByAccount } = opensea;

  // Ambil data apakah ada transaksi di akun penjual?
  const res = await getEventSalesByAccount(CROMA_WALLET_ADDRESS);

  // Filter transaksi tersebut agar hanya dari collection "croma-executive-portrait-series"?
  const selectedCollections =
    res?.asset_events?.filter(
      (val) => val.nft.collection === "croma-executive-portrait-series"
    ) ?? [];

  // Jika belum ada transaksi, hentikan
  if (selectedCollections.length === 0) return NextResponse.json({ data: [] });

  // Jika ada transaksi, saring siapa saja yang beli
  const ethAddresses = [
    ...new Set(selectedCollections.map((col) => col.buyer.toLowerCase())),
  ];

  // Ambil semua data user pembelinya
  const users = await getUsersByEthAddresses(ethAddresses);

  // Dari data pembeli tersebut, saring referrer codenya;
  const referers = [
    ...new Set(
      users.data
        .map((col) => col.referred_by)
        .filter((col) => col !== undefined)
    ),
  ];

  // Cari tahu ID pengundangnya
  const inviters = await getUsersByReferrerCode(referers);

  // Mapping untuk simpan DB
  const userNFtRewardData: UserNftRewardsDB[] = users.data
    .map((buyer) => {
      const inviter = inviters.find(
        (inv) => inv.referral_code === buyer.referred_by
      );

      if (!inviter) return null;
      const tx_hash =
        selectedCollections.find(
          (col) => col.buyer.toLowerCase() === buyer.eth_address.toLowerCase()
        )?.transaction ?? null;

      if (!tx_hash) return null;

      return {
        buyer_id: buyer.id!,
        points: 40,
        tx_hash,
        inviter_id: inviter?.id,
      };
    })
    .filter((row) => row !== null);

  // Simpan DB
  await saveNftData(userNFtRewardData);

  return NextResponse.json({ data: selectedCollections });
}
