import {
  fadeInUp,
  staggerContainer,
} from "@/components/templates/HomeTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ProgressStatsCard {
  heroInView: boolean;
}

export default function ProgressStatsCard({ heroInView }: ProgressStatsCard) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8"
      variants={staggerContainer}
      initial="initial"
      animate={heroInView ? "animate" : "initial"}
    >
      {[
        { value: "1,000,000", label: "Total Tokens", color: "orange" },
        { value: "750,000", label: "Tokens Claimed", color: "red" },
        { value: "15,432", label: "Participants", color: "orange" },
      ].map((stat, index) => (
        <motion.div key={index} variants={fadeInUp}>
          <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <motion.div
                className={`text-2xl font-bold text-${stat.color}-500`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "backOut",
                }}
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-400">{stat.label}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
