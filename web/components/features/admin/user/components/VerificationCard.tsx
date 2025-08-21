import { UserProfile } from "@/@types/user";
import { fadeInUp } from "@/components/templates/HomeTemplate";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  user: UserProfile;
}

export default function VerificationCard({ user }: Props) {
  const { verifiedAt } = user;
  const router = useRouter();
  if (verifiedAt) return null;

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-black/80 rounded-xl border border-dashed border-orange-500 p-8 flex justify-between gap-4"
    >
      <div className="flex gap-4">
        <AlertCircle className="text-orange-500" />
        <h3 className="font-bold text-orange-500">
          Your account has not been verified!
        </h3>
      </div>
      <Button
        className="bg-none border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
        onClick={() => router.push("/verify-email")}
      >
        Verify Now
      </Button>
    </motion.div>
  );
}
