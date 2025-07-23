"use client";

import { CustomParticlesBackground } from "@/components/layouts/custom-particles-background";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden flex flex-col items-center justify-center relative">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-[-3]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,69,0,0.1),transparent_50%)] z-[-2]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,0,0,0.05),transparent_50%)] z-[-2]" />

      {/* Particles layer */}
      <div className="fixed inset-0 z-[-1]">
        <CustomParticlesBackground />
      </div>

      {/* Animated Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src={"/glitch-error-404-page.png"}
          alt="error page"
          width={480}
          height={480}
          priority
        />
      </motion.div>

      {/* Animated Text & Button */}
      <motion.div
        className="text-center mt-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold">Oops! Page Not Found</h2>
        <p className="text-gray-400">The page you’re looking for doesn’t exist or has been moved.</p>
        <Link href="/" passHref>
          <Button className="mt-2 border-white text-white hover:bg-white hover:text-black transition">
            ← Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
