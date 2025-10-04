"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ChartCard } from "@/components/chart-card"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Droplets, CloudRain } from "lucide-react"

const rainfallData = [
  { month: "Jan", rainfall: 2, moisture: 35 },
  { month: "Feb", rainfall: 1, moisture: 32 },
  { month: "Mar", rainfall: 3, moisture: 38 },
  { month: "Apr", rainfall: 5, moisture: 42 },
  { month: "May", rainfall: 18, moisture: 55 },
  { month: "Jun", rainfall: 485, moisture: 78 },
]

const waterBodies = [
  { name: "Powai Lake", level: 85, status: "Good" },
  { name: "Vihar Lake", level: 72, status: "Moderate" },
  { name: "Tulsi Lake", level: 68, status: "Moderate" },
  { name: "Tansa Lake", level: 91, status: "Excellent" },
]

export default function WaterResourcesPage() {
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
                <Droplets className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold">Water Resources</h1>
                <p className="text-muted-foreground">Monitoring water bodies and rainfall patterns</p>
              </div>
            </div>
          </motion.div>

          {/* Water Body Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {waterBodies.map((body, index) => (
              <motion.div
                key={body.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel rounded-xl p-4 hover:glow-blue transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">{body.name}</h3>
                  <CloudRain className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-3xl font-display font-bold mb-1">{body.level}%</p>
                <p className="text-xs text-muted-foreground">{body.status}</p>
              </motion.div>
            ))}
          </div>

          {/* Rainfall Trends */}
          <ChartCard title="Rainfall & Soil Moisture" description="Monthly trends (mm & %)" delay={0.4}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={rainfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="rainfall" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} name="Rainfall (mm)" />
                <Bar dataKey="moisture" fill="hsl(var(--chart-3))" radius={[8, 8, 0, 0]} name="Soil Moisture (%)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Water Bodies Map */}
          <ChartCard title="Water Bodies Distribution" description="Satellite imagery overlay" delay={0.5}>
            <div className="w-full h-96 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center border border-border">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">Water bodies map visualization</p>
                <p className="text-sm text-muted-foreground">Powered by Landsat data</p>
              </div>
            </div>
          </ChartCard>
        </div>
      </main>
    </div>
  )
}
