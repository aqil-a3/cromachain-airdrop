import { Twitter, MessageCircle, Repeat, Heart, Share2, Users, Sparkles, Shield, Award } from "lucide-react"

// Helper function to get icon component by name
export const getTaskIcon = (iconName: string) => {
  const iconMap = {
    Twitter,
    MessageCircle,
    Repeat,
    Heart,
    Share2,
    Users,
    Sparkles,
    Shield,
    Award,
  }

  return iconMap[iconName as keyof typeof iconMap] || MessageCircle
}
