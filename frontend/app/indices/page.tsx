"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ChartCard } from "@/components/chart-card"
import { motion } from "framer-motion"
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts"
import { BarChart3, TrendingUp, Shield, Leaf } from "lucide-react"

const indices = [
  {
    name: "Environmental Health",
    score: 72,
    color: "#10b981",
    icon: Leaf,
    description: "Overall environmental quality",
  },
  {
    name: "Resilience Score",
    score: 68,
    color: "#3b82f6",
    icon: Shield,
    description: "Urban resilience capacity",
  },
  {
    name: "Sustainability Index",
    score: 75,
    color: "#8b5cf6",
    icon: TrendingUp,
    description: "Long-term sustainability",
  },
]

export default function IndicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DashboardSidebar />
      <DashboardHeader />

      <main className="ml-64 pt-16 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-gray-800">Composite Indices</h1>
                <p className="text-gray-600">Comprehensive environmental and resilience metrics</p>
              </div>
            </div>
          </motion.div>

          {/* Index Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {indices.map((index, i) => (
              <motion.div
                key={index.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border border-blue-100 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                    <index.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 shadow-sm">
                    {index.score}/100
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold mb-2 text-gray-800">{index.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{index.description}</p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${index.score}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: index.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Radial Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {indices.map((index, i) => (
              <ChartCard key={index.name} title={index.name} description="Score visualization" delay={0.4 + i * 0.1}>
                <ResponsiveContainer width="100%" height={250}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    data={[{ name: index.name, value: index.score, fill: index.color }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={10} />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-display text-4xl font-bold"
                      fill="#1f2937"
                    >
                      {index.score}
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </ChartCard>
            ))}
          </div>

          {/* Overall Assessment */}
          <ChartCard title="Overall Assessment" description="Mumbai's environmental status" delay={0.7}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-green-100 border-2 border-green-300">
                  <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Good water resource management</li>
                    <li>• Improving air quality trends</li>
                    <li>• Strong monitoring infrastructure</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-yellow-100 border-2 border-yellow-300">
                  <h4 className="font-semibold text-yellow-700 mb-2">Concerns</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Urban heat island effects</li>
                    <li>• Rapid urban expansion</li>
                    <li>• Seasonal air quality issues</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-blue-100 border-2 border-blue-300">
                  <h4 className="font-semibold text-blue-700 mb-2">Recommendations</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Increase green cover</li>
                    <li>• Enhance public transport</li>
                    <li>• Implement cool roofs</li>
                  </ul>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      </main>
    </div>
  )
}
