"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  delay?: number
}

export function ChartCard({ title, description, children, delay = 0 }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold mb-1">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="w-full">{children}</div>
    </motion.div>
  )
}
