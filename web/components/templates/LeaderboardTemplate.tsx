"use client";

import React, { useState } from "react";
import { CustomParticlesBackground } from "../layouts/custom-particles-background";
import RegistrationDialog from "../molecules/Dialog/RegistrationDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import LoginForm from "../login-form";
import GoogleLoginButton from "../google-login";
import { MessageCircle, Twitter } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { LeaderboardUser, UserProfile } from "@/@types/user";
import { Navbar } from "../layouts/navbar";
import MainLeaderboard from "../features/leaderboard/components/Main";
import LeaderboardProvider from "../features/leaderboard/provider";

export default function LeaderboardTemplate({
  leaderboarData,
  totalParticipants
}: {
  leaderboarData: LeaderboardUser[];
  totalParticipants:number;
}) {
  const [showRegistration, setShowRegistration] = useState<boolean>(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
    telegramUsername: "",
    discordUsername: "",
    twitterUsername: "",
    ethAddress: "",
  });

  return (
    <div className="min-h-screen text-white">
      {/* Background Gradients */}
      <>
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-[-3]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,69,0,0.1),transparent_50%)] z-[-2]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,0,0,0.05),transparent_50%)] z-[-2]" />

        {/* Particles layer */}
        <div className="fixed inset-0 z-[-1]">
          <CustomParticlesBackground />
        </div>
      </>

      {/* Navbar Section */}
      <>
        <Navbar
          onRegisterClick={() => setShowRegistration(true)}
          onSignInClick={() => setShowSignInDialog(true)}
          onCommunityClick={() => setShowCommunityModal(true)}
          userName={userProfile?.name || "Guest"}
        />

        <RegistrationDialog
          setShowRegistration={setShowRegistration}
          showRegistration={showRegistration}
        />

        <SignInDialog open={showSignInDialog} setOpen={setShowSignInDialog} />
        <CommunityDialog
          open={showCommunityModal}
          setOpen={setShowCommunityModal}
        />
      </>

      <LeaderboardProvider leaderboardData={leaderboarData} totalParticipants={totalParticipants} >
        <MainLeaderboard />
      </LeaderboardProvider>
    </div>
  );
}

type DialogState = {
  open: boolean;
  setOpen: (state: boolean) => void;
};
const SignInDialog: React.FC<DialogState> = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <span className="text-center text-2xl font-bold font-mono">OR</span>
        <GoogleLoginButton />
      </DialogContent>
    </Dialog>
  );
};

const CommunityDialog: React.FC<DialogState> = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                onClick={() => setOpen(false)}
              >
                <social.icon className="w-5 h-5 mr-2" />
                {social.name}
              </Button>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
