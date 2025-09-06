import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import z from "zod";
import axios, { isAxiosError } from "axios";
import { BasicHttpResponse } from "@/@types/http";

const walletAddressSchema = z
  .string()
  .min(42, { message: "Wallet address must be 42 characters long" })
  .max(42, { message: "Wallet address must be 42 characters long" })
  .regex(/^0x[a-fA-F0-9]{40}$/, { message: "Invalid wallet address format" });

export function ChangeWalletDialog() {
  const walletRef = useRef<HTMLInputElement | null>(null);
  const oldWalletRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clickHandler = async () => {
    const walletElement = walletRef.current;
    const oldWalletElement = oldWalletRef.current;
    if (!walletElement || !oldWalletElement) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    const parsed = walletAddressSchema.safeParse(walletElement.value);

    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post<BasicHttpResponse>(
        "/api/user/wallet/update",
        {
          new_wallet_address: walletElement.value,
          old_wallet_address: oldWalletElement.value,
        }
      );
      if (data.success) {
        setSuccess(data.message ?? "Wallet updated successfully!");
      } else {
        setError(data.message ?? "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      if (isAxiosError(error)) {
        const data = error.response?.data;
        setError(data?.message ?? "Something went wrong!");
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          Update Your Wallet!
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/80 text-white border-orange-500">
        <DialogHeader>
          <DialogTitle>Update Wallet</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Enter your old wallet address"
            className="bg-black/50 text-white placeholder:text-gray-400"
            ref={oldWalletRef}
          />
          <Input
            placeholder="Enter your new wallet address"
            className="bg-black/50 text-white placeholder:text-gray-400"
            ref={walletRef}
          />

          {/* Pesan error */}
          {error && <p className="text-sm text-red-400 font-medium">{error}</p>}

          {/* Pesan sukses */}
          {success && (
            <p className="text-sm text-green-400 font-medium">{success}</p>
          )}

          <Alert
            variant="destructive"
            className="bg-red-900/50 border-red-500 text-white"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Please make sure the wallet address you enter is correct. Airdrop
              distribution will be sent to this address.
            </AlertDescription>
          </Alert>

          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            onClick={clickHandler}
            disabled={loading}
          >
            {loading ? "Updating..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
