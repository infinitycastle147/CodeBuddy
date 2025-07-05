"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { 
  Code, 
  MessageCircle, 
  FileText, 
  Zap, 
  Users, 
  ArrowRight,
  Sparkles,
  BarChart3,
  Bot,
  Brain,
  Lightbulb
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/app/context/UserContext"
import { GradientText } from "@/components/animate-ui/text/gradient"
import { WritingText } from "@/components/animate-ui/text/writing"
import { RippleButton } from "@/components/animate-ui/buttons/ripple"
import { GradientBackground } from "@/components/animate-ui/backgrounds/gradient"
import Link from "next/link"

const features = [
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "AI Assistant",
    description: "Get intelligent help with your code, debug issues, and learn best practices",
    href: "/chat",
    color: "from-blue-500 to-cyan-500",
    gradient: "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200"
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Diagram Studio",
    description: "Create beautiful diagrams and flowcharts with AI-powered generation",
    href: "/diagrams",
    color: "from-purple-500 to-pink-500",
    gradient: "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Code Explorer",
    description: "Navigate and understand your codebase with intelligent insights",
    href: "/explorer",
    color: "from-green-500 to-emerald-500",
    gradient: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Collaboration",
    description: "Work together with your team and share knowledge seamlessly",
    href: "/settings",
    color: "from-orange-500 to-red-500",
    gradient: "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200"
  }
]

const stats = [
  { label: "AI Conversations", value: "10K+", icon: <Bot className="w-5 h-5" /> },
  { label: "Diagrams Created", value: "5K+", icon: <BarChart3 className="w-5 h-5" /> },
  { label: "Code Reviews", value: "15K+", icon: <Code className="w-5 h-5" /> },
  { label: "Happy Developers", value: "2K+", icon: <Users className="w-5 h-5" /> }
]

const quickActions = [
  { 
    title: "Start New Chat", 
    description: "Ask AI about your code",
    icon: <MessageCircle className="w-5 h-5" />,
    href: "/chat",
    className: "hover:shadow-blue-200"
  },
  { 
    title: "Create Diagram", 
    description: "Generate visual diagrams",
    icon: <BarChart3 className="w-5 h-5" />,
    href: "/diagrams",
    className: "hover:shadow-purple-200"
  },
  { 
    title: "Explore Code", 
    description: "Navigate your project",
    icon: <Code className="w-5 h-5" />,
    href: "/explorer",
    className: "hover:shadow-green-200"
  }
]

export default function WelcomePage() {
  const { user } = useUser()
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  const firstName = user?.name?.split(" ")?.[0] || user?.username || "Developer"

  return (
    <main className="flex-1 overflow-y-auto bg-background relative">
      {/* Subtle animated background */}
      <div className="fixed inset-0 opacity-30 -z-10">
        <GradientBackground 
          className="from-blue-50 via-purple-50 to-pink-50" 
          transition={{ duration: 20, ease: "easeInOut", repeat: Infinity }}
        />
      </div>
      
      <div className="container mx-auto px-6 py-16 space-y-20">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-10"
        >
          <div className="space-y-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Welcome to CodeBuddy</span>
            </motion.div>
            
            <div className="space-y-2">
              <WritingText 
                text={`${greeting}, ${firstName}!`}
                className="text-5xl md:text-6xl font-bold text-foreground"
                transition={{ type: 'spring', bounce: 0, duration: 1.5, delay: 0.1 }}
              />
              
              <div className="text-xl md:text-2xl mt-4">
                <GradientText 
                  text="Your intelligent coding companion is ready"
                  className="font-semibold"
                  gradient="linear-gradient(90deg, #3b82f6 0%, #8b5cf6 30%, #ec4899 60%, #8b5cf6 80%, #3b82f6 100%)"
                />
              </div>
            </div>
            
            <WritingText 
              text="Accelerate your development with AI-powered assistance, intelligent diagrams, and seamless code exploration."
              className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-6"
              transition={{ type: 'spring', bounce: 0, duration: 2, delay: 0.05 }}
            />
          </div>

          {/* Quick Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mt-10"
          >
            <Link href="/chat">
              <RippleButton 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Start Chatting
                <ArrowRight className="w-4 h-4" />
              </RippleButton>
            </Link>
            
            <Link href="/diagrams">
              <RippleButton 
                variant="outline"
                size="lg"
                className="border-purple-200 hover:bg-purple-50 text-purple-700"
              >
                <BarChart3 className="w-5 h-5" />
                Create Diagram
              </RippleButton>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
            >
              <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full text-white mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="space-y-12"
        >
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to supercharge your development workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 + index * 0.15, duration: 0.5 }}
              >
                <Link href={feature.href}>
                  <Card className={`h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${feature.gradient} group`}>
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                          {feature.icon}
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-foreground group-hover:text-gray-900 transition-colors">
                              {feature.title}
                            </h3>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-gray-900 group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-12 border border-gray-200"
        >
          <div className="text-center space-y-10">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">Quick Actions</h3>
              <p className="text-muted-foreground">Jump right into your most common tasks</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2 + index * 0.1, duration: 0.4 }}
                >
                  <Link href={action.href}>
                    <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm ${action.className}`}>
                      <CardContent className="p-8 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full text-gray-700">
                          {action.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{action.title}</h4>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.6 }}
          className="text-center space-y-8 py-12"
        >
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Ready to get started?</h3>
            <p className="text-muted-foreground">
              Join thousands of developers who are already using CodeBuddy to accelerate their workflow
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <Badge variant="secondary" className="px-3 py-1">
              <Brain className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Zap className="w-3 h-3 mr-1" />
              Lightning Fast
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Lightbulb className="w-3 h-3 mr-1" />
              Smart Insights
            </Badge>
          </div>
        </motion.div>
      </div>
    </main>
  )
}