import { UserProfile } from "@/@types/user";
import { useProfileData } from "@/components/provider/ProfileProvider";
import { fadeInUp } from "@/components/templates/HomeTemplate";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { motion } from "framer-motion";
import {
  CirclePlus,
  Copy,
  Info,
  LoaderCircle,
  Users,
  Sparkles,
} from "lucide-react";
import React, { useState } from "react";

interface ReferralCardProps {
  userData: UserProfile;
}

export default function ReferralCard() {
  const { user, userReferralCount } = useProfileData();
  const [referralCode, setReferralCode] = useState<string>(
    user?.referralCode ?? ""
  );
  const referralLink = `https://airdrop.cromachain.com/join?ref=${referralCode}`;

  return (
    <motion.div variants={fadeInUp}>
      <Card className="bg-black/50 backdrop-blur-lg border border-green-500/30 p-6 md:p-8 rounded-2xl shadow-lg text-left space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Your Referral Code</h2>
          <Sparkles className="w-6 h-6 text-green-400 animate-pulse" />
        </div>

        {/* Referral Link Box */}
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-900/60 to-black/50 border border-green-500/20 rounded-xl p-4 shadow-md">
          <span className="text-green-400 font-mono text-lg break-all line-clamp-1">
            {referralCode
              ? referralLink
              : "Create or load your referral link now!"}
          </span>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            {referralCode ? (
              <CopyButton referralLink={referralLink} />
            ) : (
              <CreateReferralButton setReferralCode={setReferralCode} />
            )}
          </motion.div>
        </div>

        <p className="text-gray-400">
          Share this link to earn bonus{" "}
          <span className="text-green-400 font-semibold">CROMA tokens!</span>
        </p>

        {/* Referral Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
          <StatCard
            icon={<Users className="w-5 h-5 text-green-400" />}
            label="Total Referrals"
            value={`${userReferralCount} ${userReferralCount > 1 ? "Users" : "User"}`}
          />
          <StatCard
            icon={<Sparkles className="w-5 h-5 text-green-400" />}
            label="NFT Buyer Referrals"
            value="COMING SOON"
          />
        </div>

        {/* Reward Alert */}
        <Alert className="bg-green-500/10 border-green-500/30 text-green-100">
          <Info className="text-green-400" />
          <AlertTitle>Reward Notification</AlertTitle>
          <AlertDescription>
            <ul className="list-disc ml-5 space-y-1">
              <li>You earned +10% balance from your referral.</li>
              <li>You earned 40 CROMA points from your referral.</li>
            </ul>
          </AlertDescription>
        </Alert>
      </Card>
    </motion.div>
  );
}

/* ========== SUB COMPONENTS ========== */

const CopyButton: React.FC<{ referralLink: string }> = ({ referralLink }) => {
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied to clipboard.");
  };

  return (
    <Button
      onClick={copyReferralLink}
      variant="outline"
      className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white bg-transparent ml-4 rounded-xl shadow"
    >
      <Copy className="w-4 h-4" />
    </Button>
  );
};

const CreateReferralButton: React.FC<{
  setReferralCode: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setReferralCode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createReferralHandler = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("/api/user/referral");

      setReferralCode(data.referralCode);
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert("something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={createReferralHandler}
      disabled={isLoading}
      variant="outline"
      className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white bg-transparent ml-4 rounded-xl shadow"
    >
      {isLoading ? (
        <LoaderCircle className="w-4 h-4 animate-spin" />
      ) : (
        <CirclePlus className="w-4 h-4" />
      )}
    </Button>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between bg-gray-900/40 border border-green-500/20 rounded-xl p-4 shadow-md">
    <div className="flex items-center space-x-3">
      {icon}
      <span className="text-gray-300">{label}</span>
    </div>
    <span className="text-green-400 font-semibold">{value}</span>
  </div>
);
