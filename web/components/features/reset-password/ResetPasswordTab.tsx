"use client";

import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ResetPasswordForm from "./ResetPasswordForm";
import axios, { isAxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordTab() {
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token");
  const [token, setToken] = useState(urlToken || "");
  const [tokenSubmitted, setTokenSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const { data } = await axios.post("/api/reset-password/verify-token", {
        token,
      });

      alert(data?.message || "Token valid");
      setTokenSubmitted(data.isSuccess);
      router.replace(
        `?token=${token}&email=${data.email}&userId=${data.userId}`
      );
    } catch (error) {
      console.error(error);
      if (isAxiosError(error)) {
        const data = error.response?.data;
        console.log(data);
        alert(data?.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TabsContent
      value="reset-password"
      className="bg-black/90 border border-white/10 backdrop-blur-md text-white sm:max-w-md p-6 rounded-lg space-y-6"
    >
      {!tokenSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-2xl font-bold">Enter Reset Token</h1>
          <div className="space-y-2">
            <Label htmlFor="token" className="text-gray-300">
              Paste the token you received in your email
            </Label>
            <Input
              id="token"
              disabled={isLoading}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Your reset token"
              className="bg-black text-white border-white/20"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Processing..." : "Submit"}
          </Button>
        </form>
      ) : (
        <ResetPasswordForm />
      )}
    </TabsContent>
  );
}
