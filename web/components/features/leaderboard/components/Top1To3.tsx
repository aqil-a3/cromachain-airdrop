import { LeaderboardUser } from "@/@types/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

import "./top1to3.css";
import { Crown } from "lucide-react";

interface Props {
  data: LeaderboardUser[];
}

type RankStyleType = {
  color: string;
  medal: string;
};

const rankStyles: Record<number, RankStyleType> = {
  1: { color: "from-yellow-400 to-yellow-600", medal: "🥇" },
  2: { color: "from-gray-300 to-gray-500", medal: "🥈" },
  3: { color: "from-amber-600 to-amber-800", medal: "🥉" },
};

const sprinkleColors: Record<number, string> = {
  1: "bg-yellow-400",
  2: "bg-gray-300",
  3: "bg-amber-600",
};

const crownColors: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-gray-300",
  3: "text-amber-600",
};

export default function Top1To3Card({ data }: Props) {
  const maxInvites = Math.max(...data.map((d) => d.invitationCount));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-4 items-end !mt-20">
      {data.map((d, i) => {
        const rankStyle = rankStyles[d.ranking] || {};
        const progress = (d.invitationCount / maxInvites) * 100;
        const sprinkleColor = sprinkleColors[d.ranking];
        const crownColor = crownColors[d.ranking];
        const smartContract = `${d.smartContract.slice(0, 6)}...${d.smartContract.slice(-4)}`;

        return (
          <motion.div
            key={i + 1}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: d.ranking * 0.2,
              ease: "easeOut",
            }}
          >
            <Card
              key={d.id}
              className="relative bg-black/80 text-white shadow-lg pt-12"
            >
              {/* Sprinkle effect */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className={`absolute w-2 h-2 ${sprinkleColor} rounded-full animate-sprinkle`}
                    style={{
                      top: `${Math.random() * 80}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>

              {/* Avatar floating */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-float">
                <Crown
                  className={`absolute -top-8 left-1/2 -translate-x-1/2 w-10 h-10 ${crownColor} drop-shadow-lg animate-bounce-slow`}
                  strokeWidth={2.5}
                />
                <Avatar
                  className={`w-20 h-20 border-4 border-white ring-4 ring-offset-2 ring-offset-black/80 animate-glow`}
                  style={{
                    boxShadow:
                      d.ranking === 1
                        ? "0 0 15px rgba(255, 215, 0, 0.6)"
                        : d.ranking === 2
                          ? "0 0 15px rgba(192, 192, 192, 0.6)"
                          : "0 0 15px rgba(205, 127, 50, 0.6)",
                  }}
                >
                  <AvatarFallback className={`${sprinkleColor} outline-black`}>
                    {d.fullName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <CardHeader className="items-center mt-4">
                <div className="text-4xl">{rankStyle.medal}</div>
                <CardTitle className="mt-2">{d.fullName}</CardTitle>
                <CardDescription className="text-white/80">
                  {smartContract}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col items-center">
                <p className="text-2xl font-bold">
                  {d.invitationCount} Invites
                </p>
                <Progress value={progress} className="w-full mt-2" />
              </CardContent>

              <CardFooter className="text-xs text-white/60 justify-center">
                Joined: {new Date(d.createdAt).toLocaleDateString()}
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
