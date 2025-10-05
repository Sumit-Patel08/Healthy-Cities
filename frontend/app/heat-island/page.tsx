"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ChartCard } from "@/components/chart-card"
import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Thermometer, TrendingUp, Zap, AlertTriangle } from "lucide-react"
import { apiClient, CurrentWeatherData, HeatStressData } from "@/lib/api"
import { HeatIslandMap } from "@/components/heat-island-map"
import { ProtectedRoute } from "@/components/ProtectedRoute"

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
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(null)
  const [heatStressData, setHeatStressData] = useState<HeatStressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRealTimeData()
    // Refresh every 5 minutes
    const interval = setInterval(fetchRealTimeData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchRealTimeData = async () => {
    try {
      setLoading(true)
      
      const [weatherResponse, heatResponse] = await Promise.all([
        apiClient.getCurrentWeather(),
        apiClient.getHeatStress()
      ])

      if (weatherResponse.data) {
        setWeatherData(weatherResponse.data as CurrentWeatherData)
      }

      if (heatResponse.data) {
        setHeatStressData(heatResponse.data as HeatStressData)
      }

      setError(null)
    } catch (err) {
      setError('Failed to fetch real-time data')
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
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                <Thermometer className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-gray-800">Heat Island Analysis</h1>
                <p className="text-gray-600">Real-time temperature monitoring + Urban heat patterns</p>
              </div>
            </div>
          </motion.div>

          {/* Real-time Temperature Data from Meteomatics */}
          {(weatherData || heatStressData) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-orange-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">🔴 Real-time Temperature - Mumbai</h3>
                    <p className="text-sm text-gray-600">Live data from Meteomatics API •</p>
                  </div>
                </div>
                <button
                  onClick={fetchRealTimeData}
                  disabled={loading}
                  className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Refresh'}
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {weatherData?.data?.weather?.temperature && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                      {weatherData.data.weather.temperature.toFixed(1)}°C
                    </p>
                    <p className="text-sm text-gray-600">Current Temperature</p>
                  </div>
                )}
                {(heatStressData?.data?.heat_index || weatherData?.data?.environmental?.heat_index) && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                      {(heatStressData?.data?.heat_index || weatherData?.data?.environmental?.heat_index)?.toFixed(1)}°C
                    </p>
                    <p className="text-sm text-gray-600">Heat Index</p>
                  </div>
                )}
                {weatherData?.data?.weather?.humidity && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                      {weatherData.data.weather.humidity.toFixed(0)}%
                    </p>
                    <p className="text-sm text-gray-600">Humidity</p>
                  </div>
                )}
                {weatherData?.data?.weather?.uv_index && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                      {weatherData.data.weather.uv_index.toFixed(0)}
                    </p>
                    <p className="text-sm text-gray-600">UV Index</p>
                  </div>
                )}
              </div>

              {/* Heat Stress Assessment */}
              {heatStressData && (
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">Heat Stress Risk Assessment</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      heatStressData.data.risk_level === 'High' || heatStressData.data.risk_level === 'Extreme' 
                        ? 'bg-red-100 text-red-800' 
                        : heatStressData.data.risk_level === 'Moderate' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {heatStressData.data.risk_level} Risk
                    </span>
                  </div>
                  
                  {heatStressData.data.recommendations.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Recommendations:</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {heatStressData.data.recommendations.slice(0, 3).map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Historical Heat Island Analysis */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Urban Heat Island Analysis - Historical Data</h3>
            <p className="text-sm text-gray-600">Mumbai heat hotspots based on historical temperature patterns</p>
          </div>
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

          {/* OpenStreetMap Heat Island Analysis */}
          <ChartCard title="OpenStreetMap Heat Island Analysis" description="Free interactive map with street labels - Markers move with map pan/zoom" delay={0.5}>
            <HeatIslandMap weatherData={weatherData} heatStressData={heatStressData} />
          </ChartCard>
        </div>
      </main>
      </div>
    </ProtectedRoute>
  )
}
