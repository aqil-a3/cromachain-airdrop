import { UserSchemaType } from "../variables/schema";
import axios, { isAxiosError } from "axios";

export async function postUser(values: UserSchemaType) {
  try {
    await axios.post(`/api/user`, values);

    alert("Create new user is success");
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
