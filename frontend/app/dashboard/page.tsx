"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { MetricCard } from "@/components/metric-card"
import { ChartCard } from "@/components/chart-card"
import { AnimatedBackground } from "@/components/animated-background"
import { Wind, Thermometer, Droplets, Building2 } from "lucide-react"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const mockAQIData = [
  { time: "00:00", value: 85 },
  { time: "04:00", value: 78 },
  { time: "08:00", value: 92 },
  { time: "12:00", value: 105 },
  { time: "16:00", value: 98 },
  { time: "20:00", value: 88 },
]

const mockTempData = [
  { time: "00:00", value: 28 },
  { time: "04:00", value: 26 },
  { time: "08:00", value: 30 },
  { time: "12:00", value: 35 },
  { time: "16:00", value: 33 },
  { time: "20:00", value: 29 },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AnimatedBackground />
      <DashboardSidebar />
      <DashboardHeader />

      <main className="ml-64 pt-16 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Air Quality Index" value="92" change="+5%" icon={Wind} trend="down" delay={0} />
            <MetricCard title="Temperature" value="32°C" change="+2°C" icon={Thermometer} trend="up" delay={0.1} />
            <MetricCard title="Water Index" value="78%" change="-3%" icon={Droplets} trend="down" delay={0.2} />
            <MetricCard title="Urban Expansion" value="2.4%" change="+0.3%" icon={Building2} trend="up" delay={0.3} />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Air Quality Trend" description="Last 24 hours" delay={0.4}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockAQIData}>
                  <defs>
                    <linearGradient id="colorAQI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
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
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#colorAQI)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Temperature Trend" description="Last 24 hours" delay={0.5}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockTempData}>
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
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: "#8b5cf6", r: 5, strokeWidth: 2, stroke: "#fff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Map Placeholder */}
          <ChartCard title="Mumbai Environmental Map" description="Interactive satellite view" delay={0.6}>
            <div className="w-full h-96 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-2 border-blue-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
              <div className="text-center space-y-2 relative z-10">
                <p className="text-gray-700 font-medium">Interactive map will be displayed here</p>
                <p className="text-sm text-gray-600">Powered by Mapbox GL JS</p>
              </div>
            </div>
          </ChartCard>
        </div>
      </main>
    </div>
  )
}
