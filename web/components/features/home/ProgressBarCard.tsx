import { fadeInUp } from "@/components/templates/HomeTemplate";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function ProgressBarCard() {
  return (
    <motion.div className="max-w-2xl mx-auto mb-8" variants={fadeInUp}>
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>Progress</span>
        <span>75%</span>
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
      >
        <Progress value={75} className="h-3 bg-gray-800">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
          />
        </Progress>
      </motion.div>
    </motion.div>
  );
}
