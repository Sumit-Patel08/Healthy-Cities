"use client"

import { useState, useEffect } from "react"
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
import { AlertCircle, Wind, Satellite, Activity } from "lucide-react"
import { apiClient, AirQualityData, getAQIColor, getAQICategory } from "@/lib/api"

export default function AirQualityPage() {
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState(7)

  useEffect(() => {
    fetchAirQualityData()
  }, [timeRange])

  const fetchAirQualityData = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getAirQuality(timeRange)
      
      if (response.error) {
        setError(response.error)
      } else if (response.data) {
        setAirQualityData(response.data as AirQualityData)
        setError(null)
      }
    } catch (err) {
      setError('Failed to fetch air quality data')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DashboardSidebar />
      <DashboardHeader />

      <main className="ml-64 pt-16 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Wind className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-gray-800">Air Quality Intelligence</h1>
                  <p className="text-gray-600">Real-time NASA satellite data monitoring</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={14}>Last 14 days</option>
                  <option value={30}>Last 30 days</option>
                </select>
                <button 
                  onClick={fetchAirQualityData}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
            </div>

            {/* NASA Data Source Banner */}
            {airQualityData && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Satellite className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      {airQualityData.data_source}
                    </p>
                    <p className="text-xs text-blue-600">
                      Current AQI: {airQualityData.current_aqi.toFixed(0)} - {airQualityData.aqi_category}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Satellite className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
                <p className="text-lg font-medium text-gray-700">Loading NASA air quality data...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          {airQualityData && (
            <>
              {/* Current Air Quality Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border border-blue-100 shadow-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm text-gray-800">Air Quality Index</h3>
                    <Activity className={`w-4 h-4 text-${getAQIColor(airQualityData.current_aqi)}-500`} />
                  </div>
                  <p className="text-3xl font-display font-bold mb-1 text-gray-800">
                    {airQualityData.current_aqi.toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-600">{airQualityData.aqi_category}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-6 border border-purple-100 shadow-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm text-gray-800">PM2.5</h3>
                    <Wind className="w-4 h-4 text-purple-500" />
                  </div>
                  <p className="text-3xl font-display font-bold mb-1 text-gray-800">
                    {airQualityData.pm25_estimated.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-600">µg/m³</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-white to-green-50 rounded-xl p-6 border border-green-100 shadow-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm text-gray-800">NO₂ Density</h3>
                    <Satellite className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-3xl font-display font-bold mb-1 text-gray-800">
                    {(airQualityData.no2_levels * 1000).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600">×10¹⁵ molec/cm²</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-white to-orange-50 rounded-xl p-6 border border-orange-100 shadow-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm text-gray-800">AOD 550nm</h3>
                    <Activity className="w-4 h-4 text-orange-500" />
                  </div>
                  <p className="text-3xl font-display font-bold mb-1 text-gray-800">
                    {airQualityData.aod_550nm.toFixed(3)}
                  </p>
                  <p className="text-xs text-gray-600">Aerosol Optical Depth</p>
                </motion.div>
              </div>

              {/* Health Recommendations */}
              {airQualityData.health_recommendations && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`bg-gradient-to-r from-${airQualityData.health_recommendations.color}-50 to-${airQualityData.health_recommendations.color}-100 border border-${airQualityData.health_recommendations.color}-200 rounded-lg p-6`}
                >
                  <div className="flex items-start space-x-3">
                    <AlertCircle className={`w-6 h-6 text-${airQualityData.health_recommendations.color}-600 flex-shrink-0 mt-0.5`} />
                    <div>
                      <h3 className={`font-semibold text-${airQualityData.health_recommendations.color}-800 mb-2`}>
                        {airQualityData.health_recommendations.level}
                      </h3>
                      <p className={`text-${airQualityData.health_recommendations.color}-700`}>
                        {airQualityData.health_recommendations.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Historical Trends */}
              <ChartCard title="Air Quality Trend" description={`NASA satellite data - Last ${timeRange} days`} delay={0.5}>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={airQualityData.historical_data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} fontWeight={500} />
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
                    <Line type="monotone" dataKey="aqi" stroke="#3b82f6" strokeWidth={3} name="AQI" />
                    <Line type="monotone" dataKey="pm25" stroke="#8b5cf6" strokeWidth={3} name="PM2.5" />
                    <Line type="monotone" dataKey="no2" stroke="#10b981" strokeWidth={3} name="NO₂" />
                    <Line type="monotone" dataKey="aod" stroke="#f59e0b" strokeWidth={3} name="AOD" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Forecast */}
              {airQualityData.forecast && airQualityData.forecast.values.length > 0 && (
                <ChartCard title="AQI Forecast" description="7-day prediction using ML models" delay={0.6}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={airQualityData.forecast.dates.map((date, index) => ({
                      date,
                      forecast: airQualityData.forecast.values[index]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} fontWeight={500} />
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
                        dataKey="forecast" 
                        stroke="#ef4444" 
                        strokeWidth={3} 
                        strokeDasharray="5 5"
                        name="Predicted AQI" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
