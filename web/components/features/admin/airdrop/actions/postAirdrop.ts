import { Airdrop } from "@/@types/airdrop";
import { AirdropSchemaType } from "../../../../../schemas/airdropSchema";
import axios from "axios";

export async function postAirdrop(values: AirdropSchemaType) {
  const formData: Airdrop = {
    ...values,
    created_at: undefined,
    id: undefined,
    time_left: values.time_left.toISOString(),
  };

  try {
    await axios.post(`/api/airdrop`, formData);
    alert("Create new airdrop is success");
  } catch (error) {
    alert("Something Wrong!");
    console.error(error);
    throw error;
  }
}
