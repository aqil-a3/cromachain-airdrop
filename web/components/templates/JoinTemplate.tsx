"use client";

import MainJoin from "../features/join/components/Main";
import { CustomParticlesBackground } from "../layouts/custom-particles-background";

export default function JoinTemplate() {
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

      <MainJoin />
    </div>
  );
}
