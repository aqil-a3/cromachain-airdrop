import axios from "axios";
import { AirdropSchemaType } from "../variables/schema";

export async function putAirdrop(values: AirdropSchemaType) {
  try {
    await axios.put(`/api/airdrop`, values);

    alert("Edit airdrop is success");
  } catch (error) {
    alert("Something wrong");
    console.error(error);
  }
}
