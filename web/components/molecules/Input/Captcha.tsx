"use client";
import { useState } from "react";
import { BasicHttpResponse } from "@/@types/http";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

interface Props {
  setIsHuman: (state: boolean) => void;
}

export default function CaptchaCheckBox({ setIsHuman }: Props) {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState<null | boolean>(null);

  const changeHandler = async (token: string | null) => {
    if (!token) return;

    setLoading(true);
    setVerified(null);

    try {
      const { data } = await axios.post<BasicHttpResponse>(
        "/api/verify-captcha",
        { token }
      );

      setVerified(data.success);
      setIsHuman(true);
    } catch (error) {
      console.error(error);
      setVerified(false);
      setIsHuman(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        onChange={changeHandler}
      />

      {loading && <p className="text-blue-500">⏳ Verifying captcha...</p>}
      {verified === true && <p className="text-green-500">✅ Verified!</p>}
      {verified === false && (
        <p className="text-red-500">❌ Verification failed</p>
      )}
    </div>
  );
}
