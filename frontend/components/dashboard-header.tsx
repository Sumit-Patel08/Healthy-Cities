"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Bell, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function DashboardHeader() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-64 right-0 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 border-b border-white/20 z-40 flex items-center justify-between px-6 shadow-lg"
    >
      <div>
        <h2 className="font-display text-xl font-semibold text-white">Environmental Dashboard</h2>
        <p className="text-xs text-white/80">Real-time monitoring system</p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full shadow-lg" />
        </Button>
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </motion.header>
  )
}
