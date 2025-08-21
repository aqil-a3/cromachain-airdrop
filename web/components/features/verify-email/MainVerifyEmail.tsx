"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  confirmVerificationCode,
  getVerificationCode,
} from "./api/getVerificationCode";
import { useRouter, useSearchParams } from "next/navigation";

export default function MainVerifyEmail() {
  const [isSent, setIsSent] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const handleSendVerification = async () => {
    setLoading(true);
    const { message, success } = await getVerificationCode();
    setLoading(false);

    if (!success) {
      setMessage(message ?? "Something went wrong");
      return;
    }
    
    setMessage(message);
    setIsSent(true);
    setResendCooldown(30);
    startCooldown();
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    const { message, success } = await getVerificationCode();
    setLoading(false);

    if (!success) {
      setMessage(message ?? "Something went wrong");
      return;
    }
    setMessage(message);
    setResendCooldown(30);
    startCooldown();
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { message, success } = await confirmVerificationCode(code);
    setLoading(false);

    if (!success) {
      setMessage(message ?? "Something went wrong");
      return;
    }

    setMessage(message);
    setTimeout(() => router.replace("/"), 1000);
  };

  const startCooldown = () => {
    let counter = 30;
    const interval = setInterval(() => {
      counter -= 1;
      setResendCooldown(counter);
      if (counter <= 0) clearInterval(interval);
    }, 1000);
  };

  useEffect(() => {
    if (token) {
      setIsSent(true);
      setCode(token);
      setMessage("Enter your verification token to verify your email is valid");
    }
  }, [token]);

  return (
    <div className="w-full max-w-md bg-black/70 p-6 rounded-lg backdrop-blur text-center text-white space-y-4">
      <h1 className="font-bold text-3xl">Email Verification</h1>

      {message && (
        <p className="text-sm text-orange-400 bg-orange-950/30 p-2 rounded-lg">
          {message}
        </p>
      )}

      {!isSent ? (
        <>
          <em>
            We will send a verification code to your email. Make sure your email
            is active!
          </em>
          <Button
            onClick={handleSendVerification}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {loading ? "Sending..." : "Send Verification Email"}
          </Button>
        </>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter a verification token"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-black text-center tracking-widest"
            autoFocus
          />

          <div className="flex justify-between gap-2">
            <Button
              onClick={handleResend}
              disabled={loading || resendCooldown > 0}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
              type="button"
            >
              {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend"}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              type="button"
            >
              {loading ? "Verifying..." : "Submit"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
