import { auth } from "@/auth";
import VerificationEmailTemplate from "@/components/templates/VerifyEmailTemplate";
import { getUserById } from "@/utils/supabase/userTable";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export default async function VerificationEmailPage() {
  const session = await auth();

  const { verifiedAt } = await getUserById(session?.user.userId!);
  if (verifiedAt) redirect("/");
  return <VerificationEmailTemplate />;
}
