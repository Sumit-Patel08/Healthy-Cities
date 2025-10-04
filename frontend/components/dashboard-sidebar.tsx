"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Wind, Thermometer, Droplets, Building2, BarChart3, Satellite } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/air-quality", label: "Air Quality", icon: Wind },
  { href: "/heat-island", label: "Heat Island", icon: Thermometer },
  { href: "/water-resources", label: "Water Resources", icon: Droplets },
  { href: "/urban-development", label: "Urban Development", icon: Building2 },
  { href: "/indices", label: "Indices", icon: BarChart3 },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-0 h-screen w-64 glass-panel border-r border-border z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Satellite className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold">CityForge</h1>
            <p className="text-xs text-muted-foreground">Mumbai Pulse</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer",
                  isActive
                    ? "bg-primary/20 text-primary glow-amber"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          <p>NASA Space Apps 2025</p>
          <p className="mt-1">Powered by Earth Data</p>
        </div>
      </div>
    </motion.aside>
  )
}
