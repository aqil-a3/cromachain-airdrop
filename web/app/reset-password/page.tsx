import ResetPasswordTemplate from "@/components/templates/ResetPasswordTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function ResetPassword() {
  return <ResetPasswordTemplate />;
}
