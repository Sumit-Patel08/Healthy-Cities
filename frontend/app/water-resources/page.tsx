"use client"
import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ChartCard } from "@/components/chart-card"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Droplets, CloudRain, Zap } from "lucide-react"
import { apiClient, WaterResourcesData, formatDate } from "@/lib/api"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { WaterResourcesMap } from "@/components/water-resources-map"

const rainfallData = [
  { month: "Jan", rainfall: 2, moisture: 35 },
  { month: "Feb", rainfall: 1, moisture: 32 },
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
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeatherData()
    const interval = setInterval(fetchWeatherData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchWeatherData = async () => {
    try {
      const response = await apiClient.getCurrentWeather()
      if (response.data) {
        setWeatherData(response.data as CurrentWeatherData)
      }
    } catch (err) {
      console.error('Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute requireAuth={true}>
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
                <p className="text-gray-600">Real-time precipitation + Water bodies monitoring</p>
              </div>
            </div>
          </motion.div>

          {/* Real-time Weather Data */}
          {weatherData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="w-6 h-6 text-cyan-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">🔴 Real-time Weather Conditions - Mumbai</h3>
                  <p className="text-sm text-gray-600">Live precipitation and humidity data • Updated every 5 minutes</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {weatherData.data.weather.precipitation !== null && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                      {weatherData.data.weather.precipitation.toFixed(1)} mm
                    </p>
                    <p className="text-sm text-gray-600">Current Precipitation</p>
                  </div>
                )}
                {weatherData.data.weather.humidity && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                      {weatherData.data.weather.humidity.toFixed(0)}%
                    </p>
                    <p className="text-sm text-gray-600">Humidity</p>
                  </div>
                )}
                {weatherData.data.environmental.soil_moisture && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                      {(weatherData.data.environmental.soil_moisture * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">Soil Moisture</p>
                  </div>
                )}
                {weatherData.data.environmental.evapotranspiration && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                      {weatherData.data.environmental.evapotranspiration.toFixed(2)} mm
                    </p>
                    <p className="text-sm text-gray-600">Evapotranspiration</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Historical Water Body Status */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🏞️ Mumbai Water Bodies - Current Status</h3>
            <p className="text-sm text-gray-600">Lake water levels and reservoir status</p>
          </div>
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

          <ChartCard title="📊 Rainfall & Soil Moisture - Historical Data" description="Monthly patterns and trends from satellite data" delay={0.4}>
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

          {/* OpenStreetMap Water Bodies Distribution */}
          <ChartCard title="OpenStreetMap Water Bodies Distribution" description="Free interactive map with real-time water monitoring - Markers move with map pan/zoom" delay={0.5}>
            <WaterResourcesMap weatherData={weatherData} />
          </ChartCard>
        </div>
      </main>
      </div>
    </ProtectedRoute>
  )
}
