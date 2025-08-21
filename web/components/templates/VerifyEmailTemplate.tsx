"use client";
import MainVerifyEmail from "../features/verify-email/MainVerifyEmail";
import { CustomParticlesBackground } from "../layouts/custom-particles-background";

export default function VerificationEmailTemplate() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden flex flex-col items-center justify-center">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-[-3]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,69,0,0.1),transparent_50%)] z-[-2]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,0,0,0.05),transparent_50%)] z-[-2]" />

      {/* Particles layer */}
      <div className="fixed inset-0 z-[-1]">
        <CustomParticlesBackground />
      </div>

      <div className="w-4/5 flex items-center justify-center">
        <MainVerifyEmail />
      </div>
    </div>
  );
}
