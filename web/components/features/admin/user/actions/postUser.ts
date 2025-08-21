import { BasicHttpResponse } from "@/@types/http";
import { UserSchemaType } from "../../../../../schemas/userSchema";
import axios, { isAxiosError } from "axios";

export async function postUser(values: UserSchemaType) {
  try {
    const {data} = await axios.post<BasicHttpResponse>(`/api/user`, values);

    alert(data.message ?? "Create new user is success");
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error);
      if (error.status === 409) {
        const data = error.response?.data;
        alert(data.message);
        return;
      }
      alert("Something wrong");
    }
  }
}
