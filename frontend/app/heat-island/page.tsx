"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ChartCard } from "@/components/chart-card"
import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Thermometer, TrendingUp } from "lucide-react"

const temperatureData = [
  { time: "00:00", urban: 28, rural: 24 },
  { time: "04:00", urban: 26, rural: 22 },
  { time: "08:00", urban: 30, rural: 26 },
  { time: "12:00", urban: 35, rural: 30 },
  { time: "16:00", urban: 36, rural: 31 },
  { time: "20:00", urban: 32, rural: 27 },
]

const hotspots = [
  { location: "Dadar", temp: 38.5, intensity: "High" },
  { location: "Bandra", temp: 36.2, intensity: "Moderate" },
  { location: "Andheri", temp: 37.8, intensity: "High" },
  { location: "Powai", temp: 35.1, intensity: "Moderate" },
]

export default function HeatIslandPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader />

      <main className="ml-64 pt-16 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Thermometer className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold">Heat Island Analysis</h1>
                <p className="text-muted-foreground">Urban heat patterns and temperature anomalies</p>
              </div>
            </div>
          </motion.div>

          {/* Hotspot Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hotspots.map((spot, index) => (
              <motion.div
                key={spot.location}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel rounded-xl p-4 hover:glow-amber transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">{spot.location}</h3>
                  <TrendingUp className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-3xl font-display font-bold mb-1">{spot.temp}°C</p>
                <p className="text-xs text-muted-foreground">{spot.intensity} Intensity</p>
              </motion.div>
            ))}
          </div>

          {/* Temperature Comparison */}
          <ChartCard
            title="Urban vs Rural Temperature"
            description="24-hour comparison showing heat island effect"
            delay={0.4}
          >
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={temperatureData}>
                <defs>
                  <linearGradient id="colorUrban" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRural" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="urban"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  fill="url(#colorUrban)"
                  name="Urban Areas"
                />
                <Area
                  type="monotone"
                  dataKey="rural"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  fill="url(#colorRural)"
                  name="Rural Areas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Heat Map Placeholder */}
          <ChartCard title="Temperature Gradient Map" description="Thermal satellite imagery" delay={0.5}>
            <div className="w-full h-96 rounded-lg bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 flex items-center justify-center border border-border">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">Heat gradient map visualization</p>
                <p className="text-sm text-muted-foreground">Powered by NASA MODIS data</p>
              </div>
            </div>
          </ChartCard>
        </div>
      </main>
    </div>
  )
}
