"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Info, Twitter, MessageCircle, ExternalLink, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { CustomParticlesBackground } from "@/components/layouts/custom-particles-background"
import { Navbar } from "@/components/layouts/navbar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog" // Added Dialog imports

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

export default function ClaimAirdropPage() {
  const [ethAddressInput, setEthAddressInput] = useState("")
  const [eligibilityMessage, setEligibilityMessage] = useState<{
    type: "success" | "error" | "info" | null
    title: string
    description: string
  } | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [registeredEthAddress, setRegisteredEthAddress] = useState<string | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    telegramUsername: "",
    discordUsername: "",
    twitterUsername: "",
    ethAddress: "",
  })
  const [showRegistration, setShowRegistration] = useState(false)
  const [showSignInDialog, setShowSignInDialog] = useState(false)
  const [showCommunityModal, setShowCommunityModal] = useState(false) // New state for community modal
  const [registrationErrors, setRegistrationErrors] = useState<string[]>([]) // New state for registration errors

  useEffect(() => {
    // Load user profile from local storage to get the registered ETH address
    const storedProfile = localStorage.getItem("userProfile")
    if (storedProfile) {
      const profile = JSON.parse(storedProfile)
      setUserProfile(profile)
      setRegisteredEthAddress(profile.ethAddress)
      setIsRegistered(true)
    }
  }, [])

  const handleCheckEligibility = async () => {
    setIsChecking(true)
    setEligibilityMessage(null) // Clear previous messages

    // Simulate API call or processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (!ethAddressInput.trim()) {
      setEligibilityMessage({
        type: "error",
        title: "Input Required",
        description: "Please enter your Ethereum address to check eligibility.",
      })
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(ethAddressInput)) {
      setEligibilityMessage({
        type: "error",
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address format (e.g., 0x...).",
      })
    } else if (registeredEthAddress && ethAddressInput.toLowerCase() === registeredEthAddress.toLowerCase()) {
      setEligibilityMessage({
        type: "success",
        title: "Address Registered!",
        description:
          "Congratulations! Your address is registered for the CromaChain Airdrop. Distribution details will be announced soon on our official social channels. Please stay tuned!",
      })
    } else {
      setEligibilityMessage({
        type: "error",
        title: "Address Not Found",
        description:
          "Your address is not found or not registered. Please ensure you have completed the registration process on the main page.",
      })
    }
    setIsChecking(false)
  }

  // Function for new user registration flow (via Google simulation)
  const handleNewUserRegistration = useCallback(() => {
    // Simulate Google OAuth initial data
    setUserProfile((prev) => ({
      ...prev,
      name: "John Doe", // Default name for new user
      email: "john.doe@gmail.com", // Default email for new user
    }))
    setShowRegistration(true) // Open the full registration dialog
  }, [])

  // Function for existing user sign-in flow
  const handleExistingUserSignIn = useCallback(() => {
    const storedProfile = localStorage.getItem("userProfile")
    if (storedProfile) {
      // Simulate successful login for existing user
      const profile = JSON.parse(storedProfile)
      setUserProfile(profile)
      setIsRegistered(true)
      setRegisteredEthAddress(profile.ethAddress)
      setShowSignInDialog(false) // Close sign-in dialog
    } else {
      // If no stored profile, prompt them to register
      alert("No existing profile found. Please register first.")
      setShowSignInDialog(false) // Close sign-in dialog
      handleNewUserRegistration() // Redirect to registration flow
    }
  }, [handleNewUserRegistration])

  const handleCommunityClick = useCallback(() => {
    setShowCommunityModal(true)
  }, [])

  const validateRegistration = () => {
    const errors: string[] = []

    if (!userProfile.telegramUsername.trim()) {
      errors.push("Telegram username is required")
    }
    if (!userProfile.discordUsername.trim()) {
      errors.push("Discord username is required")
    }
    if (!userProfile.twitterUsername.trim()) {
      errors.push("Twitter/X username is required")
    }
    if (!userProfile.ethAddress.trim()) {
      errors.push("Ethereum address is required")
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(userProfile.ethAddress)) {
      errors.push("Invalid Ethereum address format")
    }

    setRegistrationErrors(errors)
    return errors.length === 0
  }

  const completeRegistration = () => {
    if (validateRegistration()) {
      setIsRegistered(true)
      setShowRegistration(false)
      setRegistrationErrors([])
      // Save the complete userProfile to local storage for persistence
      localStorage.setItem("userProfile", JSON.stringify(userProfile))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setUserProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

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
        onSignInClick={() => setShowSignInDialog(true)}
        onCommunityClick={handleCommunityClick}
        userName={userProfile.name}
      />

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-20 pt-24">
        <motion.div
          className="container mx-auto text-center space-y-8 max-w-3xl"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" variants={fadeInUp}>
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
              Check Airdrop Eligibility
            </span>
          </motion.h1>

          <motion.p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8" variants={fadeInUp}>
            Enter your Ethereum address to check if you are eligible for the CromaChain Airdrop.
          </motion.p>

          <motion.div variants={fadeInUp}>
            <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 max-w-xl mx-auto p-6">
              <CardContent className="space-y-6">
                <div className="space-y-2 text-left">
                  <Label htmlFor="ethAddress" className="text-white">
                    Your Ethereum Address
                  </Label>
                  <Input
                    id="ethAddress"
                    placeholder="0x..."
                    value={ethAddressInput}
                    onChange={(e) => setEthAddressInput(e.target.value)}
                    className="bg-gray-900/50 border-orange-500/30 text-white focus:border-orange-500"
                    disabled={isChecking}
                  />
                </div>
                <Button
                  onClick={handleCheckEligibility}
                  disabled={isChecking}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-lg font-semibold rounded-xl"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Check Eligibility"
                  )}
                </Button>

                {eligibilityMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Alert
                      className={`mt-4 ${
                        eligibilityMessage.type === "success"
                          ? "bg-green-900/20 border-green-500/30"
                          : eligibilityMessage.type === "error"
                            ? "bg-red-900/20 border-red-500/30"
                            : "bg-blue-900/20 border-blue-500/30"
                      }`}
                    >
                      {eligibilityMessage.type === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {eligibilityMessage.type === "error" && <Info className="h-4 w-4 text-red-500" />}
                      {eligibilityMessage.type === "info" && <Info className="h-4 w-4 text-blue-500" />}
                      <AlertTitle
                        className={`${
                          eligibilityMessage.type === "success"
                            ? "text-green-500"
                            : eligibilityMessage.type === "error"
                              ? "text-red-500"
                              : "text-blue-500"
                        }`}
                      >
                        {eligibilityMessage.title}
                      </AlertTitle>
                      <AlertDescription
                        className={`${
                          eligibilityMessage.type === "success"
                            ? "text-green-200"
                            : eligibilityMessage.type === "error"
                              ? "text-red-200"
                              : "text-blue-200"
                        }`}
                      >
                        {eligibilityMessage.description}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="mt-12 space-y-6" variants={fadeInUp}>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Stay Updated on Airdrop Distribution
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Airdrop distribution details will be announced on our official social channels. Join us to get the latest
              news!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: "Discord", icon: MessageCircle, url: "https://discord.gg/SWj8TWfu9k", color: "blue" },
                { name: "Telegram", icon: MessageCircle, url: "https://t.me/Cromaartofficial", color: "cyan" },
                { name: "Twitter/X", icon: Twitter, url: "https://x.com/cromachain", color: "gray" },
              ].map((social, index) => (
                <motion.div
                  key={social.name}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  variants={fadeInUp}
                >
                  <Link href={social.url} target="_blank" rel="noopener noreferrer">
                    <Button
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl shadow-lg transition-all duration-300
                      ${
                        social.name === "Discord"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : social.name === "Telegram"
                            ? "bg-cyan-600 hover:bg-cyan-700"
                            : "bg-gray-800 hover:bg-gray-700"
                      }
                    `}
                    >
                      <social.icon className="w-5 h-5" />
                      <span>Join {social.name}</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Registration Dialog (for new users) */}
      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent className="bg-black/90 border border-orange-500/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Complete Your Registration
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Fill in your social media accounts and wallet address to participate in the airdrop.
            </DialogDescription>
          </DialogHeader>

          <Alert className="bg-yellow-900/20 border-yellow-500/30 mb-6">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-200">
              <strong>Important:</strong> Make sure to use the exact usernames from your social media accounts. When the
              airdrop is distributed, our AI will audit whether these accounts actually completed the tasks. Using
              different names may cause issues during the claim process.
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
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-gray-900/50 border-orange-500/30 text-white"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  value={userProfile.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-gray-900/50 border-orange-500/30 text-white"
                  disabled
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
                onChange={(e) => handleInputChange("telegramUsername", e.target.value)}
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
                onChange={(e) => handleInputChange("discordUsername", e.target.value)}
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
                onChange={(e) => handleInputChange("twitterUsername", e.target.value)}
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
                onChange={(e) => handleInputChange("ethAddress", e.target.value)}
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
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-lg font-semibold rounded-xl"
            >
              Complete Registration
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
          <Button
            onClick={handleExistingUserSignIn}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-lg font-semibold rounded-xl"
          >
            Continue
          </Button>
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
