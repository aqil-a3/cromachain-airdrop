import { ResponseWithData } from "@/@types/http";
import { TotalUserPoints } from "@/@types/user-points";
import { fadeInUp } from "@/components/templates/HomeTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import axios, { isAxiosError } from "axios";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ChangeWalletDialog } from "./ChangeDialog";

export default function CheckEligibility() {
  const [ethAddressInput, setEthAddressInput] = useState<string>("");
  const [cromaPoint, setCromaPoint] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [source, setSource] = useState<"galxe" | "web">("web");
  const usdtConvert = 0.09;

  const handleCheckEligibility = async () => {
    setIsChecking(true);
    setErrorMessage("");
    setCromaPoint(null);

    try {
      const { data } = await axios.get<
        ResponseWithData<TotalUserPoints | null>
      >("/api/airdrop/check", {
        params: { ethAddressInput, source },
      });

      if (!data.success) {
        setErrorMessage(data?.message ?? "Something went error");
        return;
      }

      setCromaPoint(data.data!.total_points);
    } catch (error) {
      console.error(error);
      if (isAxiosError(error)) {
        const data: ResponseWithData<null> | null = error.response?.data;
        setErrorMessage(data?.message ?? "Something went wrong");
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <motion.div variants={fadeInUp}>
      <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 max-w-xl mx-auto p-6">
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Button
              variant={source === "web" ? "outline" : "default"}
              className={cn(
                "",
                source !== "web" && "hover:bg-white hover:text-black"
              )}
              onClick={() => setSource("web")}
            >
              Web
            </Button>
            <Button
              variant={source === "galxe" ? "outline" : "default"}
              className={cn(
                "",
                source !== "galxe" && "hover:bg-white hover:text-black"
              )}
              onClick={() => setSource("galxe")}
            >
              Galxe
            </Button>
          </div>
          {/* Input Address */}
          <div className="space-y-2 text-left">
            <Label htmlFor="ethAddress" className="text-white">
              Your Ethereum Address
            </Label>
            <Input
              id="ethAddress"
              placeholder="0x..."
              value={ethAddressInput}
              onChange={(e) => setEthAddressInput(e.target.value)}
              className="bg-gray-900/50 border-orange-500/30 text-white focus:border-orange-500"
              disabled={isChecking}
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-400 text-sm font-medium">
              {errorMessage}
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={handleCheckEligibility}
            disabled={isChecking}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-lg font-semibold rounded-xl"
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Checking...
              </>
            ) : (
              "Check Eligibility"
            )}
          </Button>

          {/* Success Result */}
          {cromaPoint !== null && (
<<<<<<< HEAD
            <div className="mt-6 flex justify-center items-center gap-8">
              {/* Points Section */}
              <div className="text-center">
                <p className="text-gray-400 text-sm">Your total points</p>
                {/* <p className="text-4xl font-bold tracking-wide bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
                  {cromaPoint}
                </p> */}
                <p className="text-4xl font-bold tracking-wide text-green-500">
                  {cromaPoint.toLocaleString("en-US")} CRM = $
                  {(cromaPoint * usdtConvert).toLocaleString("en-US")}
                </p>
=======
            <>
              <div className="mt-6 flex justify-center items-center gap-8">
                {/* Points Section */}
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Your total points</p>
                  <p className="text-4xl font-bold tracking-wide text-green-500">
                    {cromaPoint.toLocaleString("en-US")} CRM = $
                    {(cromaPoint * usdtConvert).toLocaleString("en-US")}
                  </p>
                </div>
>>>>>>> 91697ef (Update change token)
              </div>
              <ChangeWalletDialog />
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

//   {cromaPoint !== null && (
//     <div className="mt-6 space-y-6">
//       {/* Points Section */}
//       <div className="text-center">
//         <p className="text-gray-400 text-sm">Your total points</p>
//         <p className="text-4xl font-extrabold text-orange-400 tracking-wide">
//           {cromaPoint}
//         </p>
//       </div>

//       {/* Conversion Section */}
//       <div className="flex items-center justify-center gap-6">
//         <div className="flex flex-col items-center">
//           <Image
//             src="/logo.png"
//             alt="Cromachain logo"
//             width={36}
//             height={36}
//             className="mb-1"
//           />
//           <p className="text-white font-semibold">1 CRM</p>
//         </div>

//         <span className="text-orange-400 text-xl font-bold">=</span>

//         <div className="flex flex-col items-center">
//           <Image
//             src="/usdt-logo.png"
//             alt="USDT logo"
//             width={36}
//             height={36}
//             className="mb-1"
//           />
//           <p className="text-white font-semibold">$0.09 USDT</p>
//         </div>
//       </div>
//     </div>
//   )}
