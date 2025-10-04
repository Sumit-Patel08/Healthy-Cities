"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  change?: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  delay?: number
}

export function MetricCard({ title, value, change, icon: Icon, trend = "neutral", delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-panel rounded-xl p-6 hover:glow-blue transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {change && (
          <span
            className={cn(
              "text-sm font-medium px-2 py-1 rounded-full",
              trend === "up" && "bg-green-500/20 text-green-400",
              trend === "down" && "bg-red-500/20 text-red-400",
              trend === "neutral" && "bg-muted text-muted-foreground",
            )}
          >
            {change}
          </span>
        )}
      </div>
      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-display font-bold">{value}</p>
    </motion.div>
  )
}
