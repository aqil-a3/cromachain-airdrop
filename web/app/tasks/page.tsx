"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  AlertTriangle,
  Flame,
  BookOpen,
  Gift,
  Target,
  MessageCircle,
  Twitter,
  Coins,
  Lock,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { CustomParticlesBackground } from "@/components/layouts/custom-particles-background"
import { Navbar } from "@/components/layouts/navbar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { UserProfile } from "@/lib/types"
import { initialTasks, getTaskIcon, type Task } from "@/lib/tasks"
import { verifyTask } from "@/app/actions"

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

export default function TasksPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [showCommunityModal, setShowCommunityModal] = useState(false)
  const [verifyingTasks, setVerifyingTasks] = useState<Set<string>>(new Set())
  const [taskMessages, setTaskMessages] = useState<Record<string, { type: "success" | "error"; message: string }>>({})

  const tasksRef = useRef(null)
  const tasksInView = useInView(tasksRef, { once: true, margin: "-100px" })

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile")
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile))
    }

    const storedTaskStatus = localStorage.getItem("userTaskStatus")
    if (storedTaskStatus) {
      const parsedStatus = JSON.parse(storedTaskStatus)
      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          status: parsedStatus[task.id] || task.status,
        })),
      )
    }
  }, [])

  const totalRewardsEarned = tasks.reduce((sum, task) => sum + (task.status === "completed" ? task.reward : 0), 0)
  const completedTasksCount = tasks.filter((task) => task.status === "completed").length
  const totalTasksCount = tasks.length
  const progressPercentage = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0

  const handleNewUserRegistration = useCallback(() => {
    alert("Please register first!")
  }, [])

  const handleExistingUserSignIn = useCallback(() => {
    alert("Simulating existing user sign-in...")
  }, [])

  const handleCommunityClick = useCallback(() => {
    setShowCommunityModal(true)
  }, [])

  const getTaskStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending-verification":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "not-started":
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getCategoryColor = (category: Task["category"]) => {
    switch (category) {
      case "social":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "community":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "onchain":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "bonus":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getDifficultyColor = (difficulty: Task["difficulty"]) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400"
      case "Medium":
        return "text-yellow-400"
      case "Hard":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const handleTaskAction = async (task: Task) => {
    if (!userProfile) {
      alert("Please register or sign in first!")
      return
    }

    if (task.locked) {
      alert("This task is not available yet!")
      return
    }

    if (task.status === "completed") {
      return
    }

    // Clear previous messages
    setTaskMessages((prev) => {
      const newMessages = { ...prev }
      delete newMessages[task.id]
      return newMessages
    })

    if (task.link && task.status === "not-started") {
      window.open(task.link, "_blank")

      // Update task status to pending verification
      const updatedTasks = tasks.map((t) => (t.id === task.id ? { ...t, status: "pending-verification" as const } : t))
      setTasks(updatedTasks)

      // Save to localStorage
      const taskStatus = updatedTasks.reduce((acc, t) => ({ ...acc, [t.id]: t.status }), {})
      localStorage.setItem("userTaskStatus", JSON.stringify(taskStatus))

      return
    }

    if (task.status === "pending-verification") {
      setVerifyingTasks((prev) => new Set(prev).add(task.id))

      try {
        const result = await verifyTask(task.id, userProfile)

        if (result.success) {
          const updatedTasks = tasks.map((t) => (t.id === task.id ? { ...t, status: "completed" as const } : t))
          setTasks(updatedTasks)

          const taskStatus = updatedTasks.reduce((acc, t) => ({ ...acc, [t.id]: t.status }), {})
          localStorage.setItem("userTaskStatus", JSON.stringify(taskStatus))

          setTaskMessages((prev) => ({
            ...prev,
            [task.id]: { type: "success", message: result.message },
          }))
        } else {
          const updatedTasks = tasks.map((t) => (t.id === task.id ? { ...t, status: "failed" as const } : t))
          setTasks(updatedTasks)

          const taskStatus = updatedTasks.reduce((acc, t) => ({ ...acc, [t.id]: t.status }), {})
          localStorage.setItem("userTaskStatus", JSON.stringify(taskStatus))

          setTaskMessages((prev) => ({
            ...prev,
            [task.id]: { type: "error", message: result.message },
          }))
        }
      } catch (error) {
        console.error("Error verifying task:", error)
        setTaskMessages((prev) => ({
          ...prev,
          [task.id]: { type: "error", message: "Verification failed. Please try again." },
        }))
      } finally {
        setVerifyingTasks((prev) => {
          const newSet = new Set(prev)
          newSet.delete(task.id)
          return newSet
        })
      }
    }
  }

  const getTaskButtonText = (task: Task) => {
    if (task.locked) return "Locked"
    if (task.status === "completed") return "Completed"
    if (task.status === "pending-verification") return "Verify"
    if (task.status === "failed") return "Retry"
    return task.action
  }

  const getTaskButtonIcon = (task: Task) => {
    if (task.locked) return <Lock className="w-4 h-4" />
    if (task.status === "completed") return <CheckCircle2 className="w-4 h-4" />
    if (task.status === "pending-verification") return <Clock className="w-4 h-4" />
    if (task.status === "failed") return <AlertTriangle className="w-4 h-4" />
    return <ExternalLink className="w-4 h-4" />
  }

  const filteredTasks = {
    social: tasks.filter((task) => task.category === "social"),
    community: tasks.filter((task) => task.category === "community"),
    onchain: tasks.filter((task) => task.category === "onchain"),
    bonus: tasks.filter((task) => task.category === "bonus"),
  }

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
        isUserRegistered={!!userProfile}
        userName={userProfile?.name || "Guest"}
      />

      {/* Tasks Section */}
      <section ref={tasksRef} className="relative min-h-screen flex items-center justify-center px-4 py-20 pt-24">
        <motion.div
          className="container mx-auto text-center space-y-8 max-w-6xl"
          variants={staggerContainer}
          initial="initial"
          animate={tasksInView ? "animate" : "initial"}
        >
          <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" variants={fadeInUp}>
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
              Complete Tasks & Earn CROMA
            </span>
          </motion.h1>

          <motion.p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12" variants={fadeInUp}>
            Complete social media tasks, join our community, and earn CROMA tokens. The more tasks you complete, the
            more rewards you earn!
          </motion.p>

          {!userProfile ? (
            <motion.div variants={fadeInUp}>
              <Alert className="bg-yellow-900/20 border-yellow-500/30 max-w-2xl mx-auto">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-yellow-200">
                  <strong>Not Registered:</strong> Please register or sign in to start completing tasks and earning
                  rewards.
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
              {/* Progress Summary */}
              <motion.div variants={fadeInUp}>
                <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-white text-left mb-4">Your Progress</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Tasks Completed</span>
                        <span>
                          {completedTasksCount}/{totalTasksCount}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-3 bg-gray-800">
                        <motion.div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ delay: 0.2, duration: 1.5, ease: "easeOut" }}
                        />
                      </Progress>
                    </div>
                    <div className="flex items-center justify-center space-x-2 bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                      <Coins className="w-6 h-6 text-orange-500" />
                      <div>
                        <div className="text-sm text-gray-400">Total CROMA Earned</div>
                        <div className="text-xl font-bold text-orange-500">{totalRewardsEarned.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Task Categories */}
              {Object.entries(filteredTasks).map(([category, categoryTasks]) => (
                <motion.div key={category} variants={fadeInUp}>
                  <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 p-6 md:p-8 text-left">
                    <h2 className="text-2xl font-bold text-white mb-6 capitalize flex items-center">
                      {category === "social" && <Twitter className="w-6 h-6 mr-2 text-blue-400" />}
                      {category === "community" && <MessageCircle className="w-6 h-6 mr-2 text-purple-400" />}
                      {category === "onchain" && <Target className="w-6 h-6 mr-2 text-green-400" />}
                      {category === "bonus" && <Gift className="w-6 h-6 mr-2 text-orange-400" />}
                      {category} Tasks
                    </h2>
                    <div className="grid gap-4">
                      {categoryTasks.map((task) => {
                        const IconComponent = getTaskIcon(task.iconName)
                        const isVerifying = verifyingTasks.has(task.id)
                        const taskMessage = taskMessages[task.id]

                        return (
                          <motion.div
                            key={task.id}
                            className="p-4 rounded-lg bg-gray-900/30 border border-gray-700/50"
                            variants={scaleIn}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className={`p-2 rounded-full ${getTaskStatusColor(task.status)}`}>
                                  {task.status === "completed" ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <IconComponent className="w-5 h-5" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-white mb-1">{task.title}</h3>
                                  <p className="text-gray-400 text-sm mb-2">{task.description}</p>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    <Badge className={getCategoryColor(task.category)}>{task.category}</Badge>
                                    <Badge className="bg-gray-700/50 text-gray-300">{task.platform}</Badge>
                                    <Badge className={`bg-gray-700/50 ${getDifficultyColor(task.difficulty)}`}>
                                      {task.difficulty}
                                    </Badge>
                                    <Badge className="bg-gray-700/50 text-gray-300">{task.timeEstimate}</Badge>
                                  </div>
                                  {task.requirements && (
                                    <div className="text-xs text-gray-500 mb-2">
                                      <strong>Requirements:</strong> {task.requirements.join(", ")}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="text-orange-500 font-bold text-lg mb-2">
                                  +{task.reward.toLocaleString()} CROMA
                                </div>
                                <Button
                                  onClick={() => handleTaskAction(task)}
                                  disabled={task.locked || task.status === "completed" || isVerifying}
                                  className={`
                                    ${
                                      task.status === "completed"
                                        ? "bg-green-600 hover:bg-green-600"
                                        : task.status === "failed"
                                          ? "bg-red-600 hover:bg-red-700"
                                          : task.locked
                                            ? "bg-gray-600 hover:bg-gray-600"
                                            : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                                    }
                                    text-white px-4 py-2 rounded-lg text-sm font-semibold min-w-[100px]
                                  `}
                                >
                                  {isVerifying ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Verifying...
                                    </>
                                  ) : (
                                    <>
                                      {getTaskButtonIcon(task)}
                                      <span className="ml-2">{getTaskButtonText(task)}</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>

                            {taskMessage && (
                              <Alert
                                className={`mt-3 ${
                                  taskMessage.type === "success"
                                    ? "bg-green-900/20 border-green-500/30"
                                    : "bg-red-900/20 border-red-500/30"
                                }`}
                              >
                                {taskMessage.type === "success" ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                )}
                                <AlertDescription
                                  className={`${taskMessage.type === "success" ? "text-green-200" : "text-red-200"}`}
                                >
                                  {taskMessage.message}
                                </AlertDescription>
                              </Alert>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                  </Card>
                </motion.div>
              ))}
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
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Flame className="w-6 h-6 text-orange-500" />
                </motion.div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  CromaChain
                </span>
              </div>
              <p className="text-gray-400">Revolutionizing blockchain technology for the future.</p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h3 className="text-white font-semibold mb-4">Navigation</h3>
              <div className="space-y-2">
                {[
                  { name: "Claim", href: "/claim", icon: Gift },
                  { name: "Tasks", href: "/tasks", icon: Target },
                  { name: "Guide", href: "/guide", icon: BookOpen },
                  { name: "Community", href: "/#community", icon: MessageCircle },
                ].map((item, index) => (
                  <motion.div key={item.name} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
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
                  <motion.div key={link.name} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
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
            <p className="text-gray-400">© {new Date().getFullYear()} CromaChain. All rights reserved.</p>
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
