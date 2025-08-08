import { CustomParticlesBackground } from "@/components/layouts/custom-particles-background";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maintenance",
};

export default function MaintenancePage() {
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

      {/* Content */}
      <div className="w-4/5 text-center max-w-xl">
        <h1 className="text-4xl font-bold mb-4">We&rsquo;ll Be Back Soon!</h1>
        <p className="text-lg text-gray-300">
          Our website is currently undergoing scheduled maintenance.  
          <br />
          We appreciate your patience and understanding. Please check back later.
        </p>
      </div>
    </div>
  );
}
