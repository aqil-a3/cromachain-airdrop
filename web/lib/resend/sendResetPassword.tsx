import { Resend } from "resend";
import ResetPasswordEmail from "../../components/resend/ResetPasswordEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPassword(email: string, token: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Recovery Password",
      react: <ResetPasswordEmail token={token} />,
    });

    if (error || !data) {
      console.error(error);
      throw error;
    }

    console.log(data);

    return data;
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw error;
  }
}
