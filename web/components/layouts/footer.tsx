"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../templates/HomeTemplate";
import {
  BookOpen,
  ExternalLink,
  Flame,
  Gift,
  Globe,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-orange-500/30">
      <div className="container mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeInUp} className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Image src={"/logo.png"} alt="Logo" width={32} height={32} />
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                CromaChain
              </span>
            </div>
            <p className="text-gray-400">
              Revolutionizing blockchain technology for the future.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <div className="space-y-2">
              {[
                { name: "Claim", href: "#tasks", icon: Gift },
                {
                  name: "Airdrop Guide",
                  href: "#how-to-claim",
                  icon: BookOpen,
                },
                { name: "Ecosystem", href: "#ecosystem", icon: Globe },
                {
                  name: "Community",
                  href: "#community",
                  icon: MessageCircle,
                },
              ].map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="text-white font-semibold mb-4">Our Ecosystem</h3>
            <div className="space-y-2">
              {[
                { name: "CromaArt", url: "https://cromaart.io" },
                { name: "CromaChain", url: "https://cromachain.com" },
                { name: "TrixWallet", url: "https://trixwallet.com" },
                { name: "TrixNews", url: "https://trixnews.com" },
              ].map((link) => (
                <motion.div
                  key={link.name}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="border-t border-orange-500/30 mt-8 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-gray-400">
            © {new Date().getFullYear()} CromaChain. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
