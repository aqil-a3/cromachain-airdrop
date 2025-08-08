import axios, { isAxiosError } from "axios";
import { AirdropSchemaType } from "../../../../../schemas/airdropSchema";

export async function putAirdrop(values: AirdropSchemaType) {
  try {
    await axios.put(`/api/airdrop`, values);

    alert("Edit airdrop is success");
  } catch (error) {
    console.error(error);
    if (isAxiosError(error)) {
      const data = error.response?.data;

      alert(data.message ?? "Something wrong");
    }
  }
}
