"use client";

import { Airdrop } from "@/@types/airdrop";
import {
  fadeInUp,
  scaleIn,
  staggerContainer,
} from "@/components/templates/HomeTemplate";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

function getTimeLeft(target: Date) {
  const total = target.getTime() - Date.now();

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds };
}

export default function CountdownTimerCard({ airdrop }: { airdrop: Airdrop }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(airdrop.time_left);
    const updateTime = () => setTimeLeft(getTimeLeft(target));

    updateTime(); // initial
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [airdrop.time_left]);

  return (
    <motion.div variants={fadeInUp}>
      <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 max-w-2xl mx-auto mb-8">
        <CardContent className="p-6 space-y-4">
          <CardTitle className="text-orange-500 font-semibold">{airdrop.title}</CardTitle>
          <motion.div
            className="flex items-center justify-center space-x-2 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "backOut" }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Clock className="w-5 h-5 text-orange-500" />
            </motion.div>
            <span className="text-orange-500 font-semibold">
              Airdrop Ends In:
            </span>
          </motion.div>

          <motion.div
            className="grid grid-cols-4 gap-4 text-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Minutes" },
              { value: timeLeft.seconds, label: "Seconds" },
            ].map((item, index) => (
              <motion.div key={index} variants={scaleIn}>
                <motion.div
                  className="text-2xl md:text-3xl font-bold text-orange-500"
                  key={item.value}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {String(item.value).padStart(2, "0")}
                </motion.div>
                <div className="text-sm text-gray-400">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
