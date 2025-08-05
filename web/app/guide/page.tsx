"use client"

import { useRef, useState, useCallback } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  UserPlus,
  Globe,
  ListChecks,
  Bell,
  Wallet,
  Gift,
  Share2,
  ShieldCheck,
  Eye,
  LinkIcon,
  Flame,
  MessageCircle,
  Twitter,
  ExternalLink,
  BookOpen,
  Info,
  CheckCircle,
  CalendarDays,
  Lock,
  Pencil,
  AlertTriangle,
  Sparkles,
  PlusCircle,
  Diamond,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { CustomParticlesBackground } from "@/components/layouts/custom-particles-background"
import { Navbar } from "@/components/layouts/navbar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleIn = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5, ease: "backOut" },
}

export default function AirdropGuidePage() {
  const stepsRef = useRef(null)
  const stepsInView = useInView(stepsRef, { once: true, margin: "-100px" })

  const [showCommunityModal, setShowCommunityModal] = useState(false)
  const [isUserRegistered, setIsUserRegistered] = useState(false) // Placeholder for user registration status
  const [userName, setUserName] = useState("Guest") // Placeholder for user name

  // Placeholder functions for Navbar props
  const handleNewUserRegistration = useCallback(() => {
    // Logic to open registration dialog/page
    alert("Simulating new user registration...")
  }, [])

  const handleExistingUserSignIn = useCallback(() => {
    // Logic to open sign-in dialog/page
    alert("Simulating existing user sign-in...")
  }, [])

  const handleCommunityClick = useCallback(() => {
    setShowCommunityModal(true)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const steps = [
    {
      id: "step-0",
      icon: <UserPlus className="w-8 h-8 text-orange-500" />,
      title: "0. Complete Your Registration Form",
      description: (
        <>
          To participate, first complete the registration form with your essential details: Full Name, Active Email,
          Telegram Username, Discord Username (e.g., user#1234), Twitter/X Username (@username), and your Ethereum
          Wallet Address.
          <br />
          <br />
          <span className="text-yellow-300 font-semibold">
            <Info className="inline-block w-4 h-4 mr-1" /> Important for Verification:
          </span>{" "}
          Ensure your provided usernames precisely match those on your social media accounts. Our AI system relies on
          this data for eligibility verification; any discrepancies may lead to disqualification from the airdrop.
          <br />
          <br />
          <span className="text-green-300 font-semibold">Privacy Note:</span> We only require your exact usernames, not
          direct social media logins.
        </>
      ),
    },
    {
      id: "step-1",
      icon: <Globe className="w-8 h-8 text-orange-500" />,
      title: "1. Register via Galxe or Official Website",
      description: (
        <>
          You can participate using one of two official channels:
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>
              <span className="font-semibold">Via Galxe:</span> Join the official CROMA campaign on Galxe and complete
              all assigned tasks per phase.
            </li>
            <li>
              <span className="font-semibold">Via Website:</span> Register and complete tasks directly through this
              website's airdrop dashboard.
            </li>
          </ul>
          <br />
          <span className="text-yellow-300 font-semibold">
            <Info className="inline-block w-4 h-4 mr-1" /> Important:
          </span>{" "}
          Regardless of your chosen registration method, all token claims must be processed exclusively through this
          official website.
        </>
      ),
    },
    {
      id: "step-2",
      icon: <ListChecks className="w-8 h-8 text-orange-500" />,
      title: "2. Complete Tasks in Each Airdrop Phase",
      description: (
        <>
          The airdrop is structured into distinct phases, each featuring:
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Unique tasks (varying per phase)</li>
            <li>Specific deadlines</li>
            <li>Dedicated reward pools</li>
            <li>Optional bonus tasks for additional $CMC</li>
          </ul>
          Tasks may encompass social engagement, community participation, and on-chain validation.
          <br />
          <br />
          <span className="text-green-300 font-semibold">
            <CheckCircle className="inline-block w-4 h-4 mr-1" /> Maximize Your Rewards:
          </span>{" "}
          The more phases and tasks you complete, the greater your reward potential.
        </>
      ),
    },
    {
      id: "step-3",
      icon: <Bell className="w-8 h-8 text-orange-500" />,
      title: "3. Wait for Distribution Announcement (D-7)",
      description: (
        <>
          Stay informed! The official distribution announcement will be made publicly across:
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>X (Twitter)</li>
            <li>Telegram</li>
            <li>Discord</li>
          </ul>
          <br />
          <span className="text-yellow-300 font-semibold">
            <CalendarDays className="inline-block w-4 h-4 mr-1" /> Key Date (D-7):
          </span>{" "}
          The “Connect Wallet” feature will be activated exactly 7 days prior to the distribution date.
        </>
      ),
    },
    {
      id: "step-4",
      icon: <Wallet className="w-8 h-8 text-orange-500" />,
      title: "4. Connect Wallet & Update Address (D-7)",
      description: (
        <>
          Upon reaching D-7, you will gain access to:
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>
              <span className="font-semibold">
                <Lock className="inline-block w-4 h-4 mr-1" /> Wallet Connection:
              </span>{" "}
              Securely connect your preferred wallet (MetaMask, WalletConnect).
            </li>
            <li>
              <span className="font-semibold">
                <Pencil className="inline-block w-4 h-4 mr-1" /> Address Update:
              </span>{" "}
              You will have the option to update your Ethereum wallet address if needed.
            </li>
          </ul>
          <br />
          <span className="text-red-300 font-semibold">
            <AlertTriangle className="inline-block w-4 h-4 mr-1" /> Finality Warning:
          </span>{" "}
          Please note that once the distribution commences on D-0, no further changes to your wallet address will be
          permitted.
          <br />
          <br />
          <span className="text-yellow-300 font-semibold">Security Note:</span> The 'Connect Wallet' feature is
          currently disabled to prevent wallet drain. It will be enabled precisely 7 days before distribution (D-7),
          allowing you to update your address before claiming.
        </>
      ),
    },
    {
      id: "step-5",
      icon: <Gift className="w-8 h-8 text-orange-500" />,
      title: "5. Claim Your Tokens via Official Website",
      description: (
        <>
          To claim your tokens, simply:
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Visit the “Claim Airdrop” page.</li>
            <li>Connect your wallet.</li>
          </ul>
          Our automated system will then:
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Verify all completed phases.</li>
            <li>Calculate any bonuses from extra tasks.</li>
            <li>Confirm your referral contributions.</li>
          </ul>
          Eligible tokens will be sent directly to your connected wallet.
          <br />
          <br />
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-400 mb-2">Your Participation Rewards:</h4>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                <Gift className="inline-block w-4 h-4 mr-1" /> 1 phase completed:{" "}
                <span className="font-bold text-green-400">$CRM</span>
              </li>
              <li>
                <Sparkles className="inline-block w-4 h-4 mr-1" /> All phases completed:{" "}
                <span className="font-bold text-green-400">CRM + Bonus CMC</span>
              </li>
              <li>
                <Flame className="inline-block w-4 h-4 mr-1" /> Bonus tasks completed:{" "}
                <span className="font-bold text-green-400">Extra CMC based on task weight</span>
              </li>
            </ul>
          </div>
        </>
      ),
    },
    {
      id: "step-6",
      icon: <Share2 className="w-8 h-8 text-orange-500" />,
      title: "6. Share Your Referral Code & Earn Bonus",
      description: (
        <>
          Once you've claimed your airdrop, you'll receive a unique personal referral code. Share it with your network
          and earn substantial bonus rewards!
          <br />
          <br />
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-400 mb-2">Bonus Rewards:</h4>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                <PlusCircle className="inline-block w-4 h-4 mr-1" /> 10 users:{" "}
                <span className="font-bold text-green-400">&#43;10% bonus</span>
              </li>
              <li>
                <Diamond className="inline-block w-4 h-4 mr-1" /> 100 users:{" "}
                <span className="font-bold text-green-400">&#43;100% bonus (2x total rewards)</span>
              </li>
            </ul>
          </div>
          <br />
          <span className="text-green-300 font-semibold">
            <DollarSign className="inline-block w-4 h-4 mr-1" /> Bonus Distribution:
          </span>{" "}
          All bonuses are automatically distributed as 50% $CRM and 50% $CMC upon your claim.
          <br />
          <span className="text-green-300 font-semibold">Valid Referrals:</span> Only referrals who successfully
          complete at least one airdrop phase will be counted.
        </>
      ),
    },
  ]

  // New quick start steps for simplified explanation
  const quickStartSteps = [
    {
      icon: <UserPlus className="w-8 h-8 text-orange-500" />,
      title: "1. Register First!",
      description: "Fill out the registration form on this website with your details.",
    },
    {
      icon: <ListChecks className="w-8 h-8 text-orange-500" />,
      title: "2. Complete Small Tasks!",
      description: "Follow our social media accounts like Twitter, Discord, and Telegram.",
    },
    {
      icon: <Gift className="w-8 h-8 text-orange-500" />,
      title: "3. Claim Your Reward!",
      description: "Later, you can claim your free CROMA tokens on this website.",
    },
  ]

  const airdropPrinciples = [
    { icon: <ShieldCheck className="w-6 h-6 text-green-500" />, text: "No KYC Required" },
    { icon: <ShieldCheck className="w-6 h-6 text-green-500" />, text: "AI-Based Anti-Bot Verification" },
    { icon: <Eye className="w-6 h-6 text-green-500" />, text: "100% On-Chain & Transparent" },
    { icon: <LinkIcon className="w-6 h-6 text-green-500" />, text: "All Rewards Claimable Only Via Official Website" },
  ]

  const navLinks = [
    { name: "Claim Airdrop", href: "/claim", icon: Gift, action: null },
    { name: "Airdrop Tasks", href: "/tasks", icon: ListChecks, action: null }, // Add this line
    { name: "Airdrop Guide", href: "/guide", icon: BookOpen, action: null },
    { name: "Community", href: "#", icon: MessageCircle, action: handleCommunityClick },
  ]

  return (
    <div className="min-h-screen text-white overflow-x-hidden flex flex-col">
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
        onSignInClick={handleExistingUserSignIn}
        onCommunityClick={handleCommunityClick}
        userName={userName}
      />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 py-20 pt-24">
        <motion.div
          className="container mx-auto text-center space-y-8 max-w-4xl"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" variants={fadeInUp}>
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
              Claim Your CROMA Airdrop
            </span>
            <br />
            <span className="text-white">– Step-by-Step Guide</span>
          </motion.h1>

          <motion.p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8" variants={fadeInUp}>
            Follow the instructions to complete each phase and unlock your rewards.
          </motion.p>

          <motion.div variants={fadeInUp}>
            <Button
              onClick={() => scrollToSection("quick-start")}
              className="px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:shadow-orange-500/25"
            >
              Start Now
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* NEW: Quick Start Section */}
      <section id="quick-start" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Easy Way to Join CROMA Airdrop
            </span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Follow these 3 simple steps to get free CROMA tokens!
          </motion.p>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {quickStartSteps.map((step, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-orange-500/20">{step.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-300 text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          <motion.div variants={fadeInUp} className="mt-12">
            <Button
              onClick={() => scrollToSection("steps-section")}
              className="px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:shadow-orange-500/25"
            >
              View Full Guide
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Step-by-Step Layout */}
      <section id="steps-section" ref={stepsRef} className="py-20 px-4 bg-black/20">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              CROMA Airdrop Steps
            </span>
          </motion.h2>

          <motion.div
            className="grid gap-8"
            variants={staggerContainer}
            initial="initial"
            animate={stepsInView ? "animate" : "initial"}
          >
            {steps.map((step, index) => (
              <motion.div key={step.id} variants={fadeInUp}>
                <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300">
                  <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="flex-shrink-0 p-3 rounded-full bg-orange-500/20">{step.icon}</div>
                    <div className="flex-1 text-left">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{step.title}</h3>
                      {/* Changed <p> to <div> to allow <ul> as child */}
                      <div className="text-gray-300 leading-relaxed text-sm md:text-base">{step.description}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final Section: Airdrop Values */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              CROMA Airdrop Principles
            </span>
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 gap-4 md:gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {airdropPrinciples.map((principle, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="bg-black/40 backdrop-blur-md border border-green-500/30 hover:border-green-500/50 transition-all duration-300 p-4 md:p-6 flex items-center space-x-3 min-h-[120px]">
                  {" "}
                  {/* Added min-h-[120px] */}
                  {principle.icon}
                  <span className="text-white font-semibold text-sm md:text-base">{principle.text}</span>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto mt-12 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Sparkles className="inline-block w-5 h-5 mr-2 text-orange-500" />
            <span className="text-orange-500 font-bold">
              Prepare for the most significant community distribution in CROMA history.
            </span>
            <br />
            Contribute, complete, and claim your well-earned tokens.
          </motion.p>
        </div>
      </section>

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
              { name: "Join Discord", icon: MessageCircle, url: "https://discord.gg/SWj8TWfu9k" },
              { name: "Join Telegram", icon: MessageCircle, url: "https://t.me/Cromaartofficial" },
              { name: "Follow on X", icon: Twitter, url: "https://x.com/cromachain" },
            ].map((social, index) => (
              <Link key={social.name} href={social.url} target="_blank" rel="noopener noreferrer">
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
  )
}
