import { BasicHttpResponse } from "@/@types/http";
import axios, { isAxiosError } from "axios";

export async function getVerificationCode(): Promise<BasicHttpResponse> {
  try {
    const { data } = await axios.post<BasicHttpResponse>(
      "/api/email/verification"
    );

    return data;
  } catch (error) {
    console.error(error);
    if (isAxiosError(error)) {
      const data = error.response?.data;

      return {
        message: data.message,
        success: false,
      };
    }
    return {
      message: "Something wrong",
      success: false,
    };
  }
}

export async function confirmVerificationCode(
  code: string
): Promise<BasicHttpResponse> {
  try {
    const { data } = await axios.post<BasicHttpResponse>(
      "/api/email/verification/confirm",
      { code }
    );

    return data;
  } catch (error) {
    console.error(error);
    if (isAxiosError(error)) {
      const data = error.response?.data;

      return {
        message: data.message,
        success: false,
      };
    }
    return {
      message: "Something error",
      success: false,
    };
  }
}
