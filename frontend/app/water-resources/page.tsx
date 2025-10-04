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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DashboardSidebar />
      <DashboardHeader />

      <main className="ml-64 pt-16 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-gray-800">Water Resources</h1>
                <p className="text-gray-600">Monitoring water bodies and rainfall patterns</p>
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
                className="bg-gradient-to-br from-white to-cyan-50 rounded-xl p-4 border border-cyan-100 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm text-gray-800">{body.name}</h3>
                  <CloudRain className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-3xl font-display font-bold mb-1 text-gray-800">{body.level}%</p>
                <p className="text-xs text-gray-600">{body.status}</p>
              </motion.div>
            ))}
          </div>

          {/* Rainfall Trends */}
          <ChartCard title="Rainfall & Soil Moisture" description="Monthly trends (mm & %)" delay={0.4}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={rainfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} fontWeight={500} />
                <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="rainfall" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Rainfall (mm)" />
                <Bar dataKey="moisture" fill="#10b981" radius={[8, 8, 0, 0]} name="Soil Moisture (%)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Water Bodies Map */}
          <ChartCard title="Water Bodies Distribution" description="Satellite imagery overlay" delay={0.5}>
            <div className="w-full h-96 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center border-2 border-blue-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />
              <div className="text-center space-y-2 relative z-10">
                <p className="text-gray-700 font-medium">Water bodies map visualization</p>
                <p className="text-sm text-gray-600">Powered by Landsat data</p>
              </div>
            </div>
          </ChartCard>
        </div>
      </main>
    </div>
  )
}
