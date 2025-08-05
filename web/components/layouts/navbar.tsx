"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Flame,
  Gift,
  Menu,
  X,
  MessageCircle,
  User,
  BookOpen,
  UserCircle,
  UserSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

interface NavbarProps {
  onRegisterClick: () => void;
  onSignInClick: () => void;
  onCommunityClick: () => void;
  userName: string;
}

export function Navbar({
  onRegisterClick,
  onSignInClick,
  onCommunityClick,
  userName,
}: NavbarProps) {
  const session = useSession();
  const authStatus = session.status;
  const userData = session.data?.user;

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Claim Airdrop", href: "/claim", icon: Gift, action: null },
    { name: "Airdrop Guide", href: "/guide", icon: BookOpen, action: null },
    {
      name: "Community",
      href: "#",
      icon: MessageCircle,
      action: onCommunityClick,
    },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-effect py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Flame className="w-7 h-7 text-orange-500" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            CromaChain
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) =>
            link.action ? (
              <button
                key={link.name}
                onClick={link.action}
                className="text-gray-300 hover:text-orange-500 transition-colors flex items-center space-x-2"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </button>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-orange-500 transition-colors flex items-center space-x-2"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            )
          )}
          {authStatus === "authenticated" ? (
            <>
              <Link
                href="/profile"
                className="text-gray-300 hover:text-orange-500 transition-colors flex items-center space-x-2"
              >
                <UserCircle className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              {userData?.role && userData.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-gray-300 hover:text-orange-500 transition-colors flex items-center space-x-2"
                >
                  <UserSquare className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
              <motion.div
                className="flex items-center space-x-2 text-green-500"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <User className="w-4 h-4" />
                <span>Welcome, {userData?.name?.split(" ")[0]}!</span>
              </motion.div>
            </>
          ) : authStatus === "loading" ? (
            <div className="flex items-center space-x-3">
              <div className="h-8 w-20 rounded-md bg-gray-700 animate-pulse" />
              <div className="h-8 w-20 rounded-md bg-gray-700 animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={onRegisterClick}
                className="gradient-border-btn text-sm"
              >
                Register
              </button>
              <button
                onClick={onSignInClick}
                className="gradient-border-btn text-sm"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-black/70 backdrop-blur-lg border-t border-orange-500/30 py-4"
          >
            <div className="flex flex-col items-center space-y-4">
              {navLinks.map((link) =>
                link.action ? (
                  <button
                    key={link.name}
                    onClick={() => {
                      link.action();
                      setMobileMenuOpen(false);
                    }}
                    className="text-gray-300 hover:text-orange-500 transition-colors flex items-center space-x-2 text-lg"
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-300 hover:text-orange-500 transition-colors flex items-center space-x-2 text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                )
              )}
              {authStatus === "authenticated" ? (
                <>
                  <Link
                    href="/profile"
                    className="text-gray-300 hover:text-orange-500 transition-colors flex items-center space-x-2 text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserCircle className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  {session.data.user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="text-gray-300 hover:text-orange-500 transition-colors flex items-center space-x-2 text-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserSquare className="w-5 h-5" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <motion.div
                    className="flex items-center space-x-2 text-green-500 text-lg mt-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <User className="w-5 h-5" />
                    <span>Welcome, {userName.split(" ")[0]}!</span>
                  </motion.div>
                </>
              ) : (
                <div className="flex gap-4 justify-center items-center space-y-3 mt-4">
                  <button
                    onClick={() => {
                      onRegisterClick();
                      setMobileMenuOpen(false);
                    }}
                    className="gradient-border-btn-mobile text-lg"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => {
                      onSignInClick();
                      setMobileMenuOpen(false);
                    }}
                    className="gradient-border-btn-mobile text-lg"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
