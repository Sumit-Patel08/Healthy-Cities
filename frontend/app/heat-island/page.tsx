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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DashboardSidebar />
      <DashboardHeader />

      <main className="ml-64 pt-16 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                <Thermometer className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-gray-800">Heat Island Analysis</h1>
                <p className="text-gray-600">Urban heat patterns and temperature anomalies</p>
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
                className="bg-gradient-to-br from-white to-orange-50 rounded-xl p-4 border border-orange-100 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm text-gray-800">{spot.location}</h3>
                  <TrendingUp className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-3xl font-display font-bold mb-1 text-gray-800">{spot.temp}°C</p>
                <p className="text-xs text-gray-600">{spot.intensity} Intensity</p>
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
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorRural" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} fontWeight={500} />
                <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="urban"
                  stroke="#f97316"
                  strokeWidth={3}
                  fill="url(#colorUrban)"
                  name="Urban Areas"
                />
                <Area
                  type="monotone"
                  dataKey="rural"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#colorRural)"
                  name="Rural Areas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Heat Map Placeholder */}
          <ChartCard title="Temperature Gradient Map" description="Thermal satellite imagery" delay={0.5}>
            <div className="w-full h-96 rounded-lg bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 flex items-center justify-center border-2 border-orange-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10" />
              <div className="text-center space-y-2 relative z-10">
                <p className="text-gray-700 font-medium">Heat gradient map visualization</p>
                <p className="text-sm text-gray-600">Powered by NASA MODIS data</p>
              </div>
            </div>
          </ChartCard>
        </div>
      </main>
    </div>
  )
}
