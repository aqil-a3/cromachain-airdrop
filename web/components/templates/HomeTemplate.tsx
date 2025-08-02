"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Twitter,
  MessageCircle,
  ExternalLink,
  Check,
  Clock,
  Flame,
  Copy,
  Gift,
  User,
  AlertTriangle,
  BookOpen,
  Globe,
  CheckCircle,
  Info,
  Palette,
  Zap,
  Shield,
  Newspaper,
  Eye,
  Wrench,
  Lightbulb,
  Target,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layouts/navbar"; // Import Navbar
import { CustomParticlesBackground } from "@/components/layouts/custom-particles-background";
import axios, { isAxiosError } from "axios";
import { UserProfile } from "@/@types/user";
import { toast } from "sonner";
import GoogleLoginButton from "@/components/google-login";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "@/components/login-form";
import CountdownTimerCard from "@/components/features/home/CountdownTimer";
import ProgressStatsCard from "../features/home/ProgressStatsCard";
import ProgressBarCard from "../features/home/ProgressBarCard";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  icon: React.ReactNode;
}

// Animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const scaleIn = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5, ease: "backOut" },
};

const slideInLeft = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const slideInRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export default function HomeTemplate() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "twitter-follow",
      title: "Follow our official X (Twitter) account",
      completed: false,
      icon: <Twitter className="w-4 h-4" />,
    },
    {
      id: "twitter-retweet",
      title: "Retweet the latest pinned post",
      completed: false,
      icon: <Twitter className="w-4 h-4" />,
    },
    {
      id: "community-join",
      title: "Join Discord or Telegram",
      completed: false,
      icon: <MessageCircle className="w-4 h-4" />,
    },
  ]);
  const [claimed, setClaimed] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [showRegistration, setShowRegistration] = useState(false); // For new user registration dialog
  const [showSignInDialog, setShowSignInDialog] = useState(false); // For existing user sign-in dialog
  const [showCommunityModal, setShowCommunityModal] = useState(false); // New state for community modal
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
    telegramUsername: "",
    discordUsername: "",
    twitterUsername: "",
    ethAddress: "",
  });
  const [registrationErrors, setRegistrationErrors] = useState<string[]>([]);
  const [displayedNowText, setDisplayedNowText] = useState(""); // State for "Now!" typing animation
  const [displayedClaimText, setDisplayedClaimText] = useState(""); // State for "Claim Your Airdrop" typing animation
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const code = searchParams.get("code");
  const router = useRouter();

  // Refs for scroll animations
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const ecosystemRef = useRef(null);
  const communityRef = useRef(null);
  const tasksRef = useRef(null);
  const howToClaimRef = useRef(null); // New ref for Airdrop Guide section

  // Scroll progress
  const { scrollYProgress } = useScroll();

  // In view hooks
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" });
  const ecosystemInView = useInView(ecosystemRef, {
    once: true,
    margin: "-100px",
  });
  const communityInView = useInView(communityRef, {
    once: true,
    margin: "-100px",
  });
  const tasksInView = useInView(tasksRef, { once: true, margin: "-100px" });
  const howToClaimInView = useInView(howToClaimRef, {
    once: true,
    margin: "-100px",
  }); // New inView hook

  // Load user profile from local storage on initial mount
  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
      setIsRegistered(true);
    }
  }, []);

  // Typing animation for "Claim Your Airdrop"
  useEffect(() => {
    const fullClaimText = "Claim Your Airdrop";
    let currentIndex = 0;
    let typingIntervalId: NodeJS.Timeout | null = null;

    if (heroInView) {
      typingIntervalId = setInterval(() => {
        if (currentIndex < fullClaimText.length) {
          setDisplayedClaimText(fullClaimText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          if (typingIntervalId) clearInterval(typingIntervalId);
        }
      }, 100); // Kecepatan mengetik (ms per karakter)
    } else {
      setDisplayedClaimText(""); // Reset when out of view
    }

    return () => {
      if (typingIntervalId) clearInterval(typingIntervalId);
    };
  }, [heroInView]);

  // Typing animation for "Now!"
  useEffect(() => {
    const fullNowText = "Now!";
    let currentIndex = 0;
    let typingIntervalId: NodeJS.Timeout | null = null;

    // Start typing "Now!" after "Claim Your Airdrop" has finished or a slight delay
    if (
      heroInView &&
      displayedClaimText.length === "Claim Your Airdrop".length
    ) {
      typingIntervalId = setInterval(() => {
        if (currentIndex < fullNowText.length) {
          setDisplayedNowText(fullNowText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          if (typingIntervalId) clearInterval(typingIntervalId);
        }
      }, 100); // Kecepatan mengetik (ms per karakter)
    } else {
      setDisplayedNowText(""); // Reset when out of view or claim text not fully typed
    }

    return () => {
      if (typingIntervalId) clearInterval(typingIntervalId);
    };
  }, [heroInView, displayedClaimText]); // Depend on displayedClaimText to start after it finishes

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setIsRegistered(true);
    }
  }, []);

  useEffect(() => {
    if (reason?.includes("not-found")) {
      alert("Account not found! Please register!");
      router.replace("/");
      return;
    }
    if (code?.includes("invalid_credentials")) {
      alert("Email or password is wrong");
      router.replace("/");
      return;
    }
    if (code?.includes("no_password")) {
      alert("You haven't set a password! Please login with Google!");
      router.replace("/");
      return;
    }
  }, [code, reason]);

  const completeTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
  };

  const allTasksCompleted = tasks.every((task) => task.completed);

  const claimAirdrop = () => {
    if (allTasksCompleted) {
      setClaimed(true);
      setReferralCode(
        "CROMA-" + Math.random().toString(36).substr(2, 8).toUpperCase()
      );
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(
      `https://cromachain.com/airdrop?ref=${referralCode}`
    );
  };

  // Function for new user registration flow (via Google simulation)
  const handleNewUserRegistration = useCallback(() => {
    setShowRegistration(true); // Open the full registration dialog
  }, []);

  const validateRegistration = () => {
    const errors: string[] = [];

    if (!userProfile.telegramUsername.trim()) {
      errors.push("Telegram username is required");
    }
    if (!userProfile.discordUsername.trim()) {
      errors.push("Discord username is required");
    }
    if (!userProfile.twitterUsername.trim()) {
      errors.push("Twitter/X username is required");
    }
    if (!userProfile.ethAddress.trim()) {
      errors.push("Ethereum address is required");
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(userProfile.ethAddress)) {
      errors.push("Invalid Ethereum address format");
    }

    setRegistrationErrors(errors);
    return errors.length === 0;
  };

  const completeRegistration = async () => {
    if (validateRegistration()) {
      try {
        setIsRegistering(true);
        await axios.post(`/api/user`, userProfile);

        alert("Registration Complete! Please login with your google account");
      } catch (error) {
        console.error(error);
        if (isAxiosError(error)) {
          const data = error.response?.data;
          alert(data.message);
        }
      } finally {
        setIsRegistering(false);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setUserProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCommunityClick = useCallback(() => {
    setShowCommunityModal(true);
  }, []);

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      {/* Background Gradients (lowest z-index) */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-[-3]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,69,0,0.1),transparent_50%)] z-[-2]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,0,0,0.05),transparent_50%)] z-[-2]" />

      {/* Particles layer (middle z-index) */}
      <div className="fixed inset-0 z-[-1]">
        <CustomParticlesBackground />
      </div>

      {/* Navbar */}
      <Navbar
        onRegisterClick={handleNewUserRegistration}
        onSignInClick={() => setShowSignInDialog(true)}
        onCommunityClick={handleCommunityClick} // Pass the new handler
        userName={userProfile.name}
      />

      {/* Hero Section (and all other content - default z-index, highest) */}
      <section
        ref={heroRef}
        id="hero"
        className="relative min-h-screen flex items-center justify-center px-4 py-20 pt-24"
      >
        <motion.div
          className="container mx-auto text-center space-y-8"
          variants={staggerContainer}
          initial="initial"
          animate={heroInView ? "animate" : "initial"}
        >
          {/* Placeholder to maintain spacing after removing Logo/Brand */}
          <div className="h-[60px] mb-8" />

          {/* Main Title */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            variants={fadeInUp}
          >
            <motion.span
              className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              style={{ backgroundSize: "200% 200%" }}
            >
              {displayedClaimText}
            </motion.span>
            <br />
            <motion.span
              className="text-white"
              initial={{ opacity: 0 }}
              animate={
                heroInView &&
                displayedClaimText.length === "Claim Your Airdrop".length
                  ? { opacity: 1 }
                  : { opacity: 0 }
              }
              transition={{ delay: 0.1, duration: 0.8 }} // Slight delay after first part finishes
            >
              {displayedNowText}
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8"
            variants={fadeInUp}
          >
            Join the future of blockchain technology. Claim your free CROMA
            tokens and become part of our revolutionary ecosystem.
          </motion.p>

          <CountdownTimerCard />

          {/* Progress Stats */}
          <ProgressStatsCard heroInView={heroInView} />

          {/* Progress Bar */}
          <ProgressBarCard />

          {/* Registration/Login Dialogs (now controlled by Navbar) */}
          {/* Registration Dialog (for new users) */}
          <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
            <DialogContent className="bg-black/90 border border-orange-500/30 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Complete Your Registration
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  Fill in your social media accounts and wallet address to
                  participate in the airdrop.
                </DialogDescription>
              </DialogHeader>

              <Alert className="bg-yellow-900/20 border-yellow-500/30 mb-6">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-yellow-200">
                  <strong>Important:</strong> Make sure to use the exact
                  usernames from your social media accounts. When the airdrop is
                  distributed, our AI will audit whether these accounts actually
                  completed the tasks. Using different names may cause issues
                  during the claim process.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={userProfile.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="bg-gray-900/50 border-orange-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={userProfile.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="bg-gray-900/50 border-orange-500/30 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="telegram" className="text-white">
                    Telegram Username *
                  </Label>
                  <Input
                    id="telegram"
                    placeholder="@yourusername"
                    value={userProfile.telegramUsername}
                    onChange={(e) =>
                      handleInputChange("telegramUsername", e.target.value)
                    }
                    className="bg-gray-900/50 border-orange-500/30 text-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <Label htmlFor="discord" className="text-white">
                    Discord Username *
                  </Label>
                  <Input
                    id="discord"
                    placeholder="username#1234"
                    value={userProfile.discordUsername}
                    onChange={(e) =>
                      handleInputChange("discordUsername", e.target.value)
                    }
                    className="bg-gray-900/50 border-orange-500/30 text-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter" className="text-white">
                    Twitter/X Username *
                  </Label>
                  <Input
                    id="twitter"
                    placeholder="@yourusername"
                    value={userProfile.twitterUsername}
                    onChange={(e) =>
                      handleInputChange("twitterUsername", e.target.value)
                    }
                    className="bg-gray-900/50 border-orange-500/30 text-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <Label htmlFor="ethAddress" className="text-white">
                    Ethereum Address *
                  </Label>
                  <Input
                    id="ethAddress"
                    placeholder="0x..."
                    value={userProfile.ethAddress}
                    onChange={(e) =>
                      handleInputChange("ethAddress", e.target.value)
                    }
                    className="bg-gray-900/50 border-orange-500/30 text-white focus:border-orange-500"
                  />
                </div>

                {registrationErrors.length > 0 && (
                  <Alert className="bg-red-900/20 border-red-500/30">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-200">
                      <ul className="list-disc list-inside">
                        {registrationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={completeRegistration}
                  disabled={isRegistering}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-lg font-semibold rounded-xl"
                >
                  {isRegistering ? "Processing" : "Complete Registration"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Simple Sign-In Dialog (for existing users) */}
          <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
            <DialogContent className="bg-black/90 border border-orange-500/30 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Sign In
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  Click below to access your existing airdrop profile.
                </DialogDescription>
              </DialogHeader>
              <LoginForm />
              <span className="text-center text-2xl font-bold font-mono">
                OR
              </span>
              <GoogleLoginButton />
            </DialogContent>
          </Dialog>

          {isRegistered && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                onClick={claimAirdrop}
                disabled={!allTasksCompleted || claimed}
                className={`px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 ${
                  allTasksCompleted && !claimed
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-green-500/25"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                <Gift className="w-5 h-5 mr-2" />
                {claimed ? "Airdrop Claimed!" : "Claim Airdrop"}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Claim Requirements Section */}
      <AnimatePresence>
        {isRegistered && (
          <motion.section
            ref={tasksRef}
            id="tasks"
            className="py-20 px-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="container mx-auto max-w-4xl">
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-center mb-12"
                initial={{ opacity: 0, y: 50 }}
                animate={
                  tasksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.6 }}
              >
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Complete Tasks to Claim
                </span>
              </motion.h2>

              <motion.div
                className="grid gap-6"
                variants={staggerContainer}
                initial="initial"
                animate={tasksInView ? "animate" : "initial"}
              >
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    variants={slideInLeft}
                    whileHover={{ scale: 1.02, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <motion.div
                              className={`p-2 rounded-full ${
                                task.completed
                                  ? "bg-green-500/20"
                                  : "bg-orange-500/20"
                              }`}
                              animate={
                                task.completed ? { scale: [1, 1.2, 1] } : {}
                              }
                              transition={{ duration: 0.5 }}
                            >
                              <AnimatePresence mode="wait">
                                {task.completed ? (
                                  <motion.div
                                    key="check"
                                    initial={{ scale: 0, rotate: -90 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 90 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <Check className="w-5 h-5 text-green-500" />
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="icon"
                                    initial={{ scale: 1 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                  >
                                    {task.icon}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                            <span
                              className={`text-lg ${
                                task.completed ? "text-green-500" : "text-white"
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>
                          <AnimatePresence>
                            {!task.completed ? (
                              <motion.div
                                initial={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Button
                                  onClick={() => completeTask(task.id)}
                                  variant="outline"
                                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                                >
                                  Complete
                                </Button>
                              </motion.div>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                              >
                                <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                                  Completed
                                </Badge>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* How to Claim / Airdrop Guide Section */}
      <section ref={howToClaimRef} id="how-to-claim" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={
              howToClaimInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              CromaChain Airdrop Guide
            </span>
          </motion.h2>

          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={
              howToClaimInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              Participate in the CromaChain Airdrop through two convenient
              methods. Choose the platform that works best for you - both lead
              to the same reward distribution.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 mb-12"
            variants={staggerContainer}
            initial="initial"
            animate={howToClaimInView ? "animate" : "initial"}
          >
            {/* Galxe Campaign Option */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 h-full">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-orange-500/20">
                      <Globe className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Galxe Campaign
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Join our official Galxe campaign to complete social tasks
                    and earn your airdrop eligibility through their gamified
                    platform.
                  </p>
                  <div className="space-y-3 text-left mb-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Complete social media tasks
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Earn XP and NFT rewards
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Automatic eligibility tracking
                      </span>
                    </div>
                  </div>
                  <Link
                    href="https://app.galxe.com/quest/XmXcMRwf85UwLjEm5MuSaz/GCZfitfwb2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Join Galxe Campaign
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Direct Website Option */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 h-full">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-orange-500/20">
                      <Globe className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Direct Registration
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Register directly on our website and complete the required
                    social tasks to become eligible for the airdrop.
                  </p>
                  <div className="space-y-3 text-left mb-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Quick registration process
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Manual task completion
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Direct wallet connection
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={handleNewUserRegistration}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Claim Process */}
          <motion.div
            className="space-y-8"
            variants={staggerContainer}
            initial="initial"
            animate={howToClaimInView ? "animate" : "initial"}
          >
            <motion.div variants={fadeInUp} className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Universal Claim Process
              </h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Regardless of which method you choose, all participants will
                claim their tokens through this website when distribution is
                announced.
              </p>
            </motion.div>

            {[
              {
                step: "1",
                title: "Complete Your Participation",
                description:
                  "Finish all required tasks either through Galxe campaign or direct website registration. Ensure all social media requirements are met.",
                icon: <CheckCircle className="w-6 h-6 text-orange-500" />,
              },
              {
                step: "2",
                title: "Wait for Distribution Announcement",
                description:
                  "Follow our official channels (Twitter, Discord, Telegram) for the airdrop distribution announcement. We will notify all participants when claiming begins.",
                icon: <MessageCircle className="w-6 h-6 text-orange-500" />,
              },
              {
                step: "3",
                title: "Claim Your CROMA Tokens",
                description:
                  "Visit our 'Claim Airdrop' page, enter your registered Ethereum address, and verify your eligibility. Approved participants can claim their tokens directly to their wallet.",
                icon: <Gift className="w-6 h-6 text-orange-500" />,
              },
              {
                step: "4",
                title: "Share and Earn Bonus",
                description:
                  "After claiming, share your referral code with friends. Earn additional CROMA tokens for every successful referral who completes the program and claims their airdrop.",
                icon: <Copy className="w-6 h-6 text-orange-500" />,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex items-start space-x-4 bg-black/40 backdrop-blur-md border border-orange-500/30 p-6 rounded-lg shadow-lg"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/20 text-orange-500 font-bold text-lg">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {step.icon}
                    <h4 className="text-xl font-semibold text-white">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Important Notice */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate={howToClaimInView ? "animate" : "initial"}
            className="mt-12"
          >
            <Alert className="bg-yellow-900/20 border-yellow-500/30">
              <Info className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-200">
                <strong>Important:</strong> All airdrop claims will be processed
                through this official website regardless of your participation
                method. Keep your registered Ethereum address safe and monitor
                our official channels for distribution announcements.
              </AlertDescription>
            </Alert>
          </motion.div>
        </div>
      </section>

      {/* About Section - Completely Redesigned */}
      <section ref={aboutRef} id="about" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              About Our Vision
            </span>
          </motion.h2>

          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              We believe that the future of Web3 must be built on the
              foundations of{" "}
              <span className="text-orange-500 font-semibold">
                transparency
              </span>
              , <span className="text-orange-500 font-semibold">speed</span>,
              and{" "}
              <span className="text-orange-500 font-semibold">
                authentic art
              </span>
              . Every project in our ecosystem carries a mission to deliver real
              innovation without compromising integrity.
            </p>
          </motion.div>

          {/* Core Principles */}
          <motion.div
            className="grid md:grid-cols-4 gap-6 mb-16"
            variants={staggerContainer}
            initial="initial"
            animate={aboutInView ? "animate" : "initial"}
          >
            {[
              {
                icon: <Eye className="w-8 h-8 text-orange-500" />,
                title: "Transparency",
                description: "Full auditability in everything we build",
              },
              {
                icon: <Wrench className="w-8 h-8 text-orange-500" />,
                title: "Real Infrastructure",
                description: "Actual solutions, not empty promises",
              },
              {
                icon: <Lightbulb className="w-8 h-8 text-orange-500" />,
                title: "Human & Tech",
                description: "Authentic art meets cutting-edge technology",
              },
              {
                icon: <Target className="w-8 h-8 text-orange-500" />,
                title: "Honest Education",
                description: "Curated information you can trust",
              },
            ].map((principle, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className="flex justify-center mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {principle.icon}
                    </motion.div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {principle.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Ecosystem Section - New Comprehensive Section */}
      <section
        ref={ecosystemRef}
        id="ecosystem"
        className="py-20 px-4 bg-black/20"
      >
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={
              ecosystemInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Our Complete Ecosystem
            </span>
          </motion.h2>

          <motion.div
            className="grid lg:grid-cols-2 gap-12"
            variants={staggerContainer}
            initial="initial"
            animate={ecosystemInView ? "animate" : "initial"}
          >
            {/* CromaArt */}
            <motion.div variants={slideInLeft}>
              <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 rounded-full bg-orange-500/20">
                      <Palette className="w-8 h-8 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        CromaArt.io
                      </h3>
                      <p className="text-orange-500 font-semibold">
                        Authentic Digital Art Revolution
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    CromaArt is an exclusive NFT project that revives manual
                    artistry in the digital world. Each collection depicts
                    legendary figures like Nick Szabo, Einstein, and Elon Musk
                    as hand-painted artworks published on the Base network.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Powered by $CRM token (950M supply)
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Zero team allocation - 100% community focused
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Transparent distribution dashboard
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Roadmap to major CEX listings
                      </span>
                    </div>
                  </div>
                  <Link
                    href="https://cromaart.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Explore CromaArt
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* CromaChain */}
            <motion.div variants={slideInRight}>
              <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 rounded-full bg-orange-500/20">
                      <Zap className="w-8 h-8 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        CromaChain.com
                      </h3>
                      <p className="text-orange-500 font-semibold">
                        High-Performance Modular Layer 2
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    CromaChain is a high-performance modular Layer 2 designed
                    for the future. With over 22,500 TPS throughput, sub-15ms
                    finality, and near-zero transaction costs, it brings
                    post-quantum cryptography (zk-STARKs) and EigenDA to
                    developers.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        AI Builder for no-code smart contracts
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        zkBridge for cross-chain interoperability
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Dual-token economy: $CRM + $CMC
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Up to 12.5% APY staking rewards
                      </span>
                    </div>
                  </div>
                  <Link
                    href="https://cromachain.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Discover CromaChain
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* TrixWallet */}
            <motion.div variants={slideInLeft}>
              <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 rounded-full bg-orange-500/20">
                      <Shield className="w-8 h-8 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        TrixWallet.com
                      </h3>
                      <p className="text-orange-500 font-semibold">
                        Institutional-Grade Multi-Chain Wallet
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    TrixWallet is a multi-chain Web3 wallet with
                    institutional-grade features, designed for active users
                    managing multiple assets across networks. It's not just a
                    wallet—it's your personal financial control center in the
                    Web3 era.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Built-in trading tools & portfolio analyzer
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Cross-chain swap & high privacy analytics
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Multi-signature security & hardware support
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Military-grade encryption
                      </span>
                    </div>
                  </div>
                  <Link
                    href="https://trixwallet.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Get TrixWallet
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* TrixNews */}
            <motion.div variants={slideInRight}>
              <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 rounded-full bg-orange-500/20">
                      <Newspaper className="w-8 h-8 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        TrixNews.com
                      </h3>
                      <p className="text-orange-500 font-semibold">
                        Independent Crypto News & Research
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    TrixNews is the world's first independent crypto news and
                    research portal that refuses all paid promotions from scam
                    projects. We position ourselves as the pillar of education
                    and transparency for crypto users hungry for trustworthy
                    information sources.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Zero paid promotions from fake projects
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Full editorial integrity & KYC standards
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Real-time price feeds & portfolio tracking
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">
                        Expert analysis + educational content
                      </span>
                    </div>
                  </div>
                  <Link
                    href="https://trixnews.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read TrixNews
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Community Section */}
      <section ref={communityRef} id="community" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={
              communityInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Join Our Community
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={
              communityInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Connect with thousands of CromaChain enthusiasts and stay updated
            with the latest news.
          </motion.p>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            animate={communityInView ? "animate" : "initial"}
          >
            {[
              {
                name: "Discord",
                icon: MessageCircle,
                url: "https://discord.gg/SWj8TWfu9k",
              },
              {
                name: "Telegram",
                icon: MessageCircle,
                url: "https://t.me/Cromaartofficial",
              },
              {
                name: "Twitter",
                icon: Twitter,
                url: "https://x.com/cromachain",
              },
              {
                name: "OpenSea",
                icon: ExternalLink,
                url: "https://opensea.io/collection/croma-art",
              },
            ].map((social, index) => (
              <motion.div
                key={social.name}
                variants={scaleIn}
                whileHover={{ scale: 1.1, y: -10 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 p-8">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.2,
                      }}
                    >
                      <social.icon className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    </motion.div>
                    <span className="text-white font-semibold">
                      {social.name}
                    </span>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Referral Section */}
      <AnimatePresence>
        {claimed && referralCode && (
          <motion.section
            className="py-20 px-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="container mx-auto max-w-4xl text-center">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  Share & Earn More
                </span>
              </motion.h2>
              <motion.p
                className="text-xl text-gray-300 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Invite friends and earn bonus tokens for each successful
                referral!
              </motion.p>

              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "backOut" }}
              >
                <Card className="bg-black/40 backdrop-blur-md border border-green-500/30 max-w-2xl mx-auto">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-4">
                      <span className="text-green-500 font-mono text-lg">
                        https://cromachain.com/airdrop?ref={referralCode}
                      </span>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          onClick={copyReferralCode}
                          variant="outline"
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white bg-transparent"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                    <p className="text-gray-400 mt-4">
                      Your referral code:{" "}
                      <span className="text-green-500 font-bold">
                        {referralCode}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-orange-500/30">
        <div className="container mx-auto">
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp}>
              <div className="flex items-center space-x-2 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Flame className="w-6 h-6 text-orange-500" />
                </motion.div>
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

      {/* Community CTA Modal */}
      <Dialog open={showCommunityModal} onOpenChange={setShowCommunityModal}>
        <DialogContent className="bg-black/90 border border-orange-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Join Our Community
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Connect with us on our official social channels to stay updated!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {[
              {
                name: "Join Discord",
                icon: MessageCircle,
                url: "https://discord.gg/SWj8TWfu9k",
              },
              {
                name: "Join Telegram",
                icon: MessageCircle,
                url: "https://t.me/Cromaartofficial",
              },
              {
                name: "Follow on X",
                icon: Twitter,
                url: "https://x.com/cromachain",
              },
            ].map((social) => (
              <Link
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className="w-full gradient-border-btn py-3 text-lg font-semibold rounded-xl"
                  onClick={() => setShowCommunityModal(false)} // Close modal on click
                >
                  <social.icon className="w-5 h-5 mr-2" />
                  {social.name}
                </Button>
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
