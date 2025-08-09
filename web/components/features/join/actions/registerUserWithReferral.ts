import { UserSchemaType } from "@/schemas/userSchema";
import axios, { isAxiosError } from "axios";

export async function registerUserWithReferral(
  formData: UserSchemaType,
  referralCode?: string | null
) {
  try {
    const { data } = await axios.post("/api/user/with-referral", {
      formData,
      referralCode,
    });

    alert(data.message ?? "Success");
    document.location = "/";
  } catch (error) {
    console.error(error);
    if (isAxiosError(error)) {
      const data = error.response?.data;
      alert(data.message ?? "Something Error");
      throw error;
    }
  }
}
