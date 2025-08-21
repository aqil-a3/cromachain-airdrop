import { Resend } from "resend";
import ResetPasswordEmail from "../../components/resend/ResetPasswordEmail";
import VerifyEmailEmail from "@/components/resend/EmailVerification";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailVerificationCode(email: string, token: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Cromachain <noreply@cromachain.com>",
      to: email,
      subject: "Email Verification",
      react: <VerifyEmailEmail token={token} />,
    });

    if (error || !data) {
      console.error(error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error sending email verification email:", error);
    throw error;
  }
}
