"use client";

import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ResetPasswordForm from "./ResetPasswordForm";
import axios from "axios";

export default function ResetPasswordTab() {
  const [token, setToken] = useState("");
  const [tokenSubmitted, setTokenSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const { data } = await axios.post("apisoon", {
        token,
      });

      setTokenSubmitted(data.isSuccess);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
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
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Your reset token"
              className="bg-black text-white border-white/20"
            />
          </div>
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      ) : (
        <ResetPasswordForm />
      )}
    </TabsContent>
  );
}
