"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ChartCard } from "@/components/chart-card"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Building2, TrendingUp } from "lucide-react"

const urbanGrowthData = [
  { year: "2000", urban: 45, green: 35, water: 20 },
  { year: "2005", urban: 52, green: 30, water: 18 },
  { year: "2010", urban: 58, green: 26, water: 16 },
  { year: "2015", urban: 64, green: 22, water: 14 },
  { year: "2020", urban: 69, green: 19, water: 12 },
  { year: "2025", urban: 73, green: 17, water: 10 },
]

const landUseStats = [
  { category: "Residential", percentage: 42 },
  { category: "Commercial", percentage: 18 },
  { category: "Industrial", percentage: 15 },
  { category: "Green Spaces", percentage: 17 },
  { category: "Water Bodies", percentage: 8 },
]

export default function UrbanDevelopmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DashboardSidebar />
      <DashboardHeader />

      <main className="ml-64 pt-16 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-gray-800">Urban Development</h1>
                <p className="text-gray-600">Tracking urban expansion and land use changes</p>
              </div>
            </div>
          </motion.div>

          {/* Land Use Distribution */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {landUseStats.map((stat, index) => (
              <motion.div
                key={stat.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 border border-purple-100 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-xs text-gray-800">{stat.category}</h3>
                  <TrendingUp className="w-3 h-3 text-purple-500" />
                </div>
                <p className="text-2xl font-display font-bold text-gray-800">{stat.percentage}%</p>
              </motion.div>
            ))}
          </div>

          {/* Urban Growth Timeline */}
          <ChartCard title="Urban Expansion Timeline" description="Land use changes (2000-2025)" delay={0.4}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={urbanGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                <XAxis dataKey="year" stroke="#64748b" fontSize={12} fontWeight={500} />
                <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="urban"
                  stroke="#f97316"
                  strokeWidth={3}
                  name="Urban Area (%)"
                />
                <Line
                  type="monotone"
                  dataKey="green"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Green Spaces (%)"
                />
                <Line
                  type="monotone"
                  dataKey="water"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Water Bodies (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Land Use Comparison */}
          <ChartCard title="Current Land Use Distribution" description="Percentage breakdown by category" delay={0.5}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={landUseStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                <XAxis type="number" stroke="#64748b" fontSize={12} fontWeight={500} />
                <YAxis dataKey="category" type="category" stroke="#64748b" fontSize={12} fontWeight={500} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="percentage" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </main>
    </div>
  )
}
