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
      whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
      className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span
            className={cn(
              "text-sm font-bold px-3 py-1 rounded-full shadow-sm",
              trend === "up" && "bg-green-100 text-green-700",
              trend === "down" && "bg-red-100 text-red-700",
              trend === "neutral" && "bg-gray-100 text-gray-700",
            )}
          >
            {change}
          </span>
        )}
      </div>
      <h3 className="text-sm text-gray-600 mb-1 font-medium">{title}</h3>
      <p className="text-3xl font-display font-bold text-gray-800">{value}</p>
    </motion.div>
  )
}
