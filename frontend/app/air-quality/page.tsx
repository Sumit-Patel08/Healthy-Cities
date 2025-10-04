"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ChartCard } from "@/components/chart-card"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { AlertCircle, Wind } from "lucide-react"

const pollutantData = [
  { month: "Jan", PM25: 65, PM10: 85, NO2: 45, SO2: 15 },
  { month: "Feb", PM25: 70, PM10: 90, NO2: 48, SO2: 18 },
  { month: "Mar", PM25: 62, PM10: 82, NO2: 42, SO2: 14 },
  { month: "Apr", PM25: 58, PM10: 78, NO2: 40, SO2: 12 },
  { month: "May", PM25: 72, PM10: 95, NO2: 52, SO2: 20 },
  { month: "Jun", PM25: 68, PM10: 88, NO2: 46, SO2: 16 },
]

const aqiZones = [
  { zone: "South Mumbai", aqi: 85, status: "Moderate" },
  { zone: "Central Mumbai", aqi: 105, status: "Unhealthy" },
  { zone: "Western Suburbs", aqi: 92, status: "Moderate" },
  { zone: "Eastern Suburbs", aqi: 118, status: "Unhealthy" },
]

export default function AirQualityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DashboardSidebar />
      <DashboardHeader />

      <main className="ml-64 pt-16 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-gray-800">Air Quality Intelligence</h1>
                <p className="text-gray-600">Real-time pollutant monitoring across Mumbai</p>
              </div>
            </div>
          </motion.div>

          {/* AQI Zones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aqiZones.map((zone, index) => (
              <motion.div
                key={zone.zone}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-4 border border-blue-100 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm text-gray-800">{zone.zone}</h3>
                  <AlertCircle className={`w-4 h-4 ${zone.aqi > 100 ? "text-red-500" : "text-yellow-500"}`} />
                </div>
                <p className="text-3xl font-display font-bold mb-1 text-gray-800">{zone.aqi}</p>
                <p className="text-xs text-gray-600">{zone.status}</p>
              </motion.div>
            ))}
          </div>

          {/* Pollutant Trends */}
          <ChartCard title="Pollutant Trends" description="Monthly average concentrations (µg/m³)" delay={0.4}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={pollutantData}>
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
                <Legend />
                <Line type="monotone" dataKey="PM25" stroke="#3b82f6" strokeWidth={3} name="PM2.5" />
                <Line type="monotone" dataKey="PM10" stroke="#8b5cf6" strokeWidth={3} name="PM10" />
                <Line type="monotone" dataKey="NO2" stroke="#10b981" strokeWidth={3} name="NO₂" />
                <Line type="monotone" dataKey="SO2" stroke="#f59e0b" strokeWidth={3} name="SO₂" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Pollutant Comparison */}
          <ChartCard title="Current Pollutant Levels" description="Latest measurements by zone" delay={0.5}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={aqiZones}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                <XAxis dataKey="zone" stroke="#64748b" fontSize={12} fontWeight={500} />
                <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="aqi" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </main>
    </div>
  )
}
