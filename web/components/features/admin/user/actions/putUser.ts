import { UserSchemaType } from "../../../../../schemas/userSchema";
import axios, { isAxiosError } from "axios";

export async function putUser(values: UserSchemaType) {
  try {
    await axios.put(`/api/user`, values);

    alert("Update user is success");
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
