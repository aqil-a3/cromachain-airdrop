"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Twitter,
  MessageCircle,
  Copy,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Flame,
  BookOpen,
  Gift,
  Target,
  ExternalLink,
  Wallet,
  Loader2,
  Info,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { CustomParticlesBackground } from "@/components/layouts/custom-particles-background";
import { Navbar } from "@/components/layouts/navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTaskIcon } from "@/lib/tasks";
import { updateProfile } from "@/app/actions";
import { signIn, signOut, useSession } from "next-auth/react";
import { UserProfile } from "@/@types/user";
import { Task } from "@/@types/tasks";
import PlayDialog from "../features/protected/profile/playDialog";
import { TaskUser } from "@/@types/task-user";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function UserProfileTemplate({
  tasks,
  userTasks,
}: {
  tasks: Task[];
  userTasks: TaskUser[];
}) {
  const session = useSession();
  const userData = session.data?.user;
  const authStatus = session.status;

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [editProfileData, setEditProfileData] = useState<UserProfile | null>(
    null
  );
  const [editErrors, setEditErrors] = useState<string[]>([]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileUpdateMessage, setProfileUpdateMessage] = useState<{
    type: "success" | "error" | null;
    description: string;
  } | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const profileRef = useRef(null);
  const profileInView = useInView(profileRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (authStatus === "authenticated") {
      setUserProfile(userData as UserProfile);
      setReferralCode(
        `CROMA-${userData?.ethAddress.slice(2, 8).toUpperCase()}`
      );
      setIsDemoMode(false);
    }
  }, [authStatus]);

  const completedTasksCount = userTasks.filter(
    (task) => task.status === "completed"
  ).length;
  const totalTasksCount = tasks.length;
  const progressPercentage =
    totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;

  const handleNewUserRegistration = useCallback(() => {
    alert("Please register first!");
  }, []);

  const handleExistingUserSignIn = useCallback(() => {
    alert("Simulating existing user sign-in...");
  }, []);

  const handleCommunityClick = useCallback(() => {
    setShowCommunityModal(true);
  }, []);

  const copyReferralLink = () => {
    if (referralCode) {
      const referralLink = `https://cromachain.com/airdrop?ref=${referralCode}`;
      navigator.clipboard.writeText(referralLink);
      alert("Referral link copied to clipboard!");
    }
  };

  const getTaskStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "started":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending-verification":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "not-started":
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const handleEditProfileClick = useCallback(() => {
    if (userProfile) {
      setEditProfileData({ ...userProfile });
      setEditErrors([]);
      setProfileUpdateMessage(null);
      setShowEditProfileDialog(true);
    }
  }, [userProfile]);

  const handleEditInputChange = useCallback(
    (field: keyof UserProfile, value: string) => {
      if (editProfileData) {
        setEditProfileData((prev) => ({
          ...(prev as UserProfile),
          [field]: value,
        }));
      }
    },
    [editProfileData]
  );

  const validateEditProfile = (data: UserProfile) => {
    const errors: string[] = [];

    if (!data.telegramUsername.trim()) {
      errors.push("Telegram username is required");
    }
    if (!data.discordUsername.trim()) {
      errors.push("Discord username is required");
    }
    if (!data.twitterUsername.trim()) {
      errors.push("Twitter/X username is required");
    }
    if (!data.ethAddress.trim()) {
      errors.push("Ethereum address is required");
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(data.ethAddress)) {
      errors.push("Invalid Ethereum address format");
    }

    setEditErrors(errors);
    return errors.length === 0;
  };

  const handleSaveProfile = useCallback(async () => {
    if (!editProfileData) return;

    if (!validateEditProfile(editProfileData)) {
      setProfileUpdateMessage({
        type: "error",
        description: "Please correct the errors in your profile information.",
      });
      return;
    }

    setIsSavingProfile(true);
    setProfileUpdateMessage(null);

    try {
      const result = await updateProfile(editProfileData);
      if (result.success && result.updatedProfile) {
        setUserProfile(result.updatedProfile);
        localStorage.setItem(
          "userProfile",
          JSON.stringify(result.updatedProfile)
        );
        setProfileUpdateMessage({
          type: "success",
          description: result.message,
        });
        setShowEditProfileDialog(false);
        signIn("google", { redirectTo: "/profile" });
      } else {
        setProfileUpdateMessage({
          type: "error",
          description: result.message || "Failed to update profile.",
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setProfileUpdateMessage({
        type: "error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  }, [editProfileData]);

  const totalCroma = userTasks
    .map((task) => task.cromaEarned)
    .reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="min-h-screen text-white overflow-x-hidden flex flex-col">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-[-3]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,69,0,0.1),transparent_50%)] z-[-2]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,0,0,0.05),transparent_50%)] z-[-2]" />

      {/* Particles layer */}
      <div className="fixed inset-0 z-[-1]">
        <CustomParticlesBackground />
      </div>

      {/* Navbar */}
      <Navbar
        onRegisterClick={handleNewUserRegistration}
        onSignInClick={handleExistingUserSignIn}
        onCommunityClick={handleCommunityClick}
        userName={userProfile?.name || "Guest"}
      />

      {/* Profile Section */}
      <section
        ref={profileRef}
        className="relative min-h-screen flex items-center justify-center px-4 py-20 pt-24"
      >
        <motion.div
          className="container mx-auto text-center space-y-8 max-w-5xl"
          variants={staggerContainer}
          initial="initial"
          animate={profileInView ? "animate" : "initial"}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            variants={fadeInUp}
          >
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
              Your Profile & Progress
            </span>
          </motion.h1>

          {!userProfile ? (
            <motion.div variants={fadeInUp}>
              <Alert className="bg-yellow-900/20 border-yellow-500/30 max-w-2xl mx-auto">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-yellow-200">
                  <strong>Not Registered:</strong> Please register or sign in to
                  view your profile and progress.
                  <Button
                    onClick={handleNewUserRegistration}
                    className="ml-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Register Now
                  </Button>
                </AlertDescription>
              </Alert>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {isDemoMode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Alert className="bg-blue-900/20 border-blue-500/30 max-w-2xl mx-auto mb-4">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="text-blue-200">
                      You are viewing a demo profile. To save your own data,
                      please register or sign in. To return to demo mode, clear
                      site data from your browser localStorage.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {profileUpdateMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Alert
                    className={`mt-4 max-w-2xl mx-auto ${
                      profileUpdateMessage.type === "success"
                        ? "bg-green-900/20 border-green-500/30"
                        : "bg-red-900/20 border-red-500/30"
                    }`}
                  >
                    {profileUpdateMessage.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <AlertDescription
                      className={`${
                        profileUpdateMessage.type === "success"
                          ? "text-green-200"
                          : "text-red-200"
                      }`}
                    >
                      {profileUpdateMessage.description}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* User Info Card */}
              <motion.div variants={fadeInUp}>
                <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 p-6 md:p-8 text-left">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <h2 className="text-2xl font-bold text-white">
                      Personal Information
                    </h2>
                    <Button
                      variant="outline"
                      className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white bg-transparent"
                      onClick={handleEditProfileClick}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white bg-transparent"
                      onClick={async () => await signOut({ redirectTo: "/" })}
                    >
                      Logout
                    </Button>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-orange-500" />
                      <span>
                        Name:{" "}
                        <span className="font-semibold text-white">
                          {authStatus === "loading" ? (
                            <span className="inline-block bg-gray-700 rounded w-24 h-4 animate-pulse"></span>
                          ) : (
                            userProfile.name
                          )}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-orange-500" />
                      <span>
                        Email:{" "}
                        <span className="font-semibold text-white">
                          {authStatus === "loading" ? (
                            <span className="inline-block bg-gray-700 rounded w-32 h-4 animate-pulse"></span>
                          ) : (
                            userProfile.email
                          )}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5 text-orange-500" />
                      <span>
                        Telegram:{" "}
                        <span className="font-semibold text-white">
                          {authStatus === "loading" ? (
                            <span className="inline-block bg-gray-700 rounded w-20 h-4 animate-pulse"></span>
                          ) : (
                            userProfile.telegramUsername
                          )}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5 text-orange-500" />
                      <span>
                        Discord:{" "}
                        <span className="font-semibold text-white">
                          {authStatus === "loading" ? (
                            <span className="inline-block bg-gray-700 rounded w-20 h-4 animate-pulse"></span>
                          ) : (
                            userProfile.discordUsername
                          )}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Twitter className="w-5 h-5 text-orange-500" />
                      <span>
                        Twitter/X:{" "}
                        <span className="font-semibold text-white">
                          {authStatus === "loading" ? (
                            <span className="inline-block bg-gray-700 rounded w-20 h-4 animate-pulse"></span>
                          ) : (
                            userProfile.twitterUsername
                          )}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-5 h-5 text-orange-500" />
                      <span>
                        ETH Address:{" "}
                        <span className="font-semibold text-white break-all">
                          {authStatus === "loading" ? (
                            <span className="inline-block bg-gray-700 rounded w-48 h-4 animate-pulse"></span>
                          ) : (
                            userProfile.ethAddress
                          )}
                        </span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Progress & Rewards Summary */}
              <motion.div variants={fadeInUp}>
                <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-white text-left mb-4">
                    Your Progress
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Tasks Completed</span>
                        <span>
                          {completedTasksCount}/{totalTasksCount}
                        </span>
                      </div>
                      <Progress
                        value={progressPercentage}
                        className="h-3 bg-gray-800"
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{
                            delay: 0.2,
                            duration: 1.5,
                            ease: "easeOut",
                          }}
                        />
                      </Progress>
                    </div>
                    <div className="flex items-center justify-center space-x-2 bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                      <Coins className="w-6 h-6 text-orange-500" />
                      <div>
                        <div className="text-sm text-gray-400">
                          Total CROMA Earned
                        </div>
                        <div className="text-xl font-bold text-orange-500">
                          {totalCroma}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Referral Code */}
              {referralCode && (
                <motion.div variants={fadeInUp}>
                  <Card className="bg-black/40 backdrop-blur-md border border-green-500/30 p-6 md:p-8 text-left">
                    <h2 className="text-2xl font-bold text-white mb-4">
                      Your Referral Code
                    </h2>
                    <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-4">
                      <span className="text-green-500 font-mono text-lg break-all">
                        {`https://cromachain.com/airdrop?ref=${referralCode}`}
                      </span>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          onClick={copyReferralLink}
                          variant="outline"
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white bg-transparent ml-4"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                    <p className="text-gray-400 mt-4">
                      Share this link to earn bonus CROMA tokens!
                    </p>
                  </Card>
                </motion.div>
              )}

              {/* Task List */}
              <motion.div variants={fadeInUp}>
                <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 p-6 md:p-8 text-left">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Your Tasks
                  </h2>
                  <div className="space-y-4">
                    {tasks.map((task) => {
                      const IconComponent = getTaskIcon(task.iconName);
                      const userTask = userTasks.find(
                        (t) => t.taskId === task.id
                      );
                      const userTaskStatus = userTask?.status as Task["status"];
                      const taskStatus = userTaskStatus ?? task.status;
                      const taskReward = task.reward;

                      return (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-900/30"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-full ${getTaskStatusColor(
                                task.status
                              )}`}
                            >
                              {task.status === "completed" ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <IconComponent className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex flex-col gap-1">
                              <span
                                className={`font-semibold ${
                                  task.status === "completed"
                                    ? "text-green-400"
                                    : "text-white"
                                }`}
                              >
                                {task.title}
                              </span>
                              <span>
                                <Badge className="text-orange-500 border-orange-500">
                                  {task.reward} CRM{" "}
                                </Badge>
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge
                              className={getTaskStatusColor(
                                userTaskStatus ?? task.status
                              )}
                            >
                              {taskStatus
                                .replace(/-/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Badge>
                            {taskStatus === "not-started" && (
                              <PlayDialog task={task} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            </div>
          )}
        </motion.div>
      </section>

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
                  { name: "Claim", href: "/claim", icon: Gift },
                  { name: "Tasks", href: "/tasks", icon: Target },
                  { name: "Guide", href: "/guide", icon: BookOpen },
                  {
                    name: "Community",
                    href: "/#community",
                    icon: MessageCircle,
                  },
                ].map((item, index) => (
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
                ].map((link, index) => (
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

      {/* Edit Profile Dialog */}
      <Dialog
        open={showEditProfileDialog}
        onOpenChange={setShowEditProfileDialog}
      >
        <DialogContent className="bg-black/90 border border-orange-500/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Edit Your Profile
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Update your social media usernames and Ethereum address.
            </DialogDescription>
          </DialogHeader>

          {profileUpdateMessage && profileUpdateMessage.type === "error" && (
            <Alert className="bg-red-900/20 border-red-500/30">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-200">
                {profileUpdateMessage.description}
              </AlertDescription>
            </Alert>
          )}

          {editErrors.length > 0 && (
            <Alert className="bg-red-900/20 border-red-500/30">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-200">
                <ul className="list-disc list-inside">
                  {editErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {editProfileData && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="edit-name"
                  value={editProfileData.name}
                  className="bg-gray-900/50 border-orange-500/30 text-white"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="edit-email" className="text-white">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  value={editProfileData.email}
                  className="bg-gray-900/50 border-orange-500/30 text-white"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="edit-telegram" className="text-white">
                  Telegram Username *
                </Label>
                <Input
                  id="edit-telegram"
                  placeholder="@yourusername"
                  value={editProfileData.telegramUsername}
                  onChange={(e) =>
                    handleEditInputChange("telegramUsername", e.target.value)
                  }
                  className="bg-gray-900/50 border-orange-500/30 text-white focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="edit-discord" className="text-white">
                  Discord Username *
                </Label>
                <Input
                  id="edit-discord"
                  placeholder="username#1234"
                  value={editProfileData.discordUsername}
                  onChange={(e) =>
                    handleEditInputChange("discordUsername", e.target.value)
                  }
                  className="bg-gray-900/50 border-orange-500/30 text-white focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="edit-twitter" className="text-white">
                  Twitter/X Username *
                </Label>
                <Input
                  id="edit-twitter"
                  placeholder="@yourusername"
                  value={editProfileData.twitterUsername}
                  onChange={(e) =>
                    handleEditInputChange("twitterUsername", e.target.value)
                  }
                  className="bg-gray-900/50 border-orange-500/30 text-white focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="edit-ethAddress" className="text-white">
                  Ethereum Address *
                </Label>
                <Input
                  id="edit-ethAddress"
                  placeholder="0x..."
                  value={editProfileData.ethAddress}
                  onChange={(e) =>
                    handleEditInputChange("ethAddress", e.target.value)
                  }
                  className="bg-gray-900/50 border-orange-500/30 text-white focus:border-orange-500"
                />
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-lg font-semibold rounded-xl"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
            ].map((social, index) => (
              <Link
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className="w-full gradient-border-btn py-3 text-lg font-semibold rounded-xl"
                  onClick={() => setShowCommunityModal(false)}
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
