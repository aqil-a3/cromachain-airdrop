import { UserProfile } from "@/@types/user";
import { fadeInUp } from "@/components/templates/HomeTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { motion } from "framer-motion";
import { CirclePlus, Copy, LoaderCircle } from "lucide-react";
import React, { useState } from "react";

interface ReferralCardProps {
  userData: UserProfile;
}

export default function ReferralCard({ userData }: ReferralCardProps) {
  const [referralCode, setReferralCode] = useState<string>(
    userData.referralCode
  );
  const referralLink = `https://airdrop.cromachain.com/join?ref=${referralCode}`;

  return (
    <motion.div variants={fadeInUp}>
      <Card className="bg-black/40 backdrop-blur-md border border-green-500/30 p-6 md:p-8 text-left">
        <h2 className="text-2xl font-bold text-white mb-4">
          Your Referral Code
        </h2>
        <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-4">
          <span className="text-green-500 font-mono text-lg break-all line-clamp-1">
            {referralCode ? referralLink : "Create or load your referral link now!"}
          </span>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            {referralCode ? (
              <CopyButton referralLink={referralLink} />
            ) : (
              <CreateReferralButton setReferralCode={setReferralCode} />
            )}
          </motion.div>
        </div>
        <p className="text-gray-400 mt-4">
          Share this link to earn bonus CROMA tokens!
        </p>
      </Card>
    </motion.div>
  );
}

const CopyButton: React.FC<{ referralLink: string }> = ({ referralLink }) => {
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied to clipboard!");
  };
  return (
    <Button
      onClick={copyReferralLink}
      variant="outline"
      className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white bg-transparent ml-4"
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

      alert(data.message);
      setReferralCode(data.referralCode);
    } catch (error) {
      console.error(error);
      alert("Something wrong!");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      onClick={createReferralHandler}
      disabled={isLoading}
      variant="outline"
      className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white bg-transparent ml-4"
    >
      {isLoading ? (
        <LoaderCircle className="w-4 h-4 animate-spin" />
      ) : (
        <CirclePlus className="w-4 h-4" />
      )}
    </Button>
  );
};
