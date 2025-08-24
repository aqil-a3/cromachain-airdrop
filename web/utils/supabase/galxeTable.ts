import { DBCodeType, ResponseWithData } from "@/@types/http";
import { supabase } from "./client";
import { GalxeDataDB } from "@/@types/galxe";
import { TotalUserPoints } from "@/@types/user-points";

const tableName = "galxe_data";

export async function getGalxeDataByEthAddress(
  eth_address: string
): Promise<ResponseWithData<TotalUserPoints | null, DBCodeType>> {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("eth_address", eth_address);

  if (error) {
    console.error(error);
    return {
      data: null,
      success: false,
      code: "ERROR_DB",
    };
  }

  if (!data)
    return {
      data: null,
      success: false,
      code: "NOT_FOUND",
    };

  const galxeData: GalxeDataDB[] = data;

  const totalAmounts = galxeData
    .map((galxe) => galxe.amount)
    .reduce((acc, curr) => acc + curr, 0);

  const result: TotalUserPoints = {
    user_id: galxeData[0].eth_address,
    total_points: totalAmounts,
  };

  return {
    data: result,
    success: true,
    code: "SUCCESS",
  };
}
