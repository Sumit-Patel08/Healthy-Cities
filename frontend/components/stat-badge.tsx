"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StatBadgeProps {
  label: string
  value: string | number
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function StatBadge({ label, value, trend = "neutral", className }: StatBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel", className)}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-sm font-display font-bold",
          trend === "up" && "text-green-400",
          trend === "down" && "text-red-400",
          trend === "neutral" && "text-primary",
        )}
      >
        {value}
      </span>
    </motion.div>
  )
}
