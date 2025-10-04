"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ChartCard } from "@/components/chart-card"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Droplets, CloudRain, Zap } from "lucide-react"
import { apiClient, CurrentWeatherData } from "@/lib/api"

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

          {/* Water Bodies Distribution Map */}
          <ChartCard title="Water Bodies Distribution" description="Landsat Satellite Imagery Analysis" delay={0.5}>
            <div className="w-full h-96 rounded-lg relative overflow-hidden">
              {/* Embed Google Maps with satellite view focused on Mumbai water bodies */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.14571430783!2d72.74109995!3d19.08219995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e1!3m2!1sen!2sin!4v1633024800000!5m2!1sen!2sin&maptype=satellite"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              />
              
              {/* Water Bodies Data Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Powai Lake */}
                <div className="absolute top-1/4 right-1/4 pointer-events-auto">
                  <div className="relative">
                    <div className="w-8 h-10 bg-blue-700 rounded-t-full rounded-bl-full transform rotate-45 shadow-xl border-2 border-white relative animate-pulse">
                      <div className="absolute top-1 left-1 w-6 h-6 bg-blue-600 rounded-full transform -rotate-45 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">💧</span>
                      </div>
                    </div>
                    <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      <div className="text-blue-400 font-bold">POWAI LAKE</div>
                      <div>Water Level: 85% - Good</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-black/90"></div>
                    </div>
                  </div>
                </div>
                
                {/* Vihar Lake */}
                <div className="absolute top-1/3 left-1/4 pointer-events-auto">
                  <div className="relative">
                    <div className="w-7 h-9 bg-blue-700 rounded-t-full rounded-bl-full transform rotate-45 shadow-xl border-2 border-white relative">
                      <div className="absolute top-1 left-1 w-5 h-5 bg-blue-600 rounded-full transform -rotate-45 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">🏞️</span>
                      </div>
                    </div>
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      <div className="text-cyan-400 font-bold">VIHAR LAKE</div>
                      <div>Water Level: 72% - Moderate</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-black/90"></div>
                    </div>
                  </div>
                </div>
                
                {/* Tulsi Lake */}
                <div className="absolute bottom-1/3 left-1/3 pointer-events-auto">
                  <div className="relative">
                    <div className="w-6 h-8 bg-cyan-700 rounded-t-full rounded-bl-full transform rotate-45 shadow-xl border-2 border-white relative">
                      <div className="absolute top-1 left-1 w-4 h-4 bg-cyan-600 rounded-full transform -rotate-45 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">🌊</span>
                      </div>
                    </div>
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      <div className="text-cyan-400 font-bold">TULSI LAKE</div>
                      <div>Water Level: 68% - Moderate</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-black/90"></div>
                    </div>
                  </div>
                </div>
                
                {/* Tansa Lake - Largest */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                  <div className="relative">
                    <div className="w-10 h-12 bg-blue-800 rounded-t-full rounded-bl-full transform rotate-45 shadow-xl border-2 border-white relative animate-pulse">
                      <div className="absolute top-1 left-1 w-8 h-8 bg-blue-700 rounded-full transform -rotate-45 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">🏔️</span>
                      </div>
                    </div>
                    {/* Water ripple effect */}
                    <div className="absolute top-0 left-0 w-10 h-12 bg-blue-500/20 rounded-t-full rounded-bl-full transform rotate-45 animate-ping" />
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      <div className="text-blue-300 font-bold">TANSA LAKE</div>
                      <div>Water Level: 91% - Excellent</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-black/90"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Live Weather Data */}
              <div className="absolute top-4 left-4 bg-black/90 rounded-lg p-3 text-white border border-cyan-500 pointer-events-auto shadow-xl">
                <div className="text-xs font-semibold mb-2 text-cyan-400">🔴 LIVE HYDRO DATA</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between gap-4">
                    <span>PRECIPITATION:</span>
                    <span className="text-blue-400 font-bold">{weatherData?.data?.weather?.precipitation?.toFixed(1) || '0.0'} mm</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>HUMIDITY:</span>
                    <span className="text-cyan-400 font-bold">{weatherData?.data?.weather?.humidity?.toFixed(0) || '78'}%</span>
                  </div>
                  {weatherData?.data?.environmental?.soil_moisture && (
                    <div className="flex justify-between gap-4">
                      <span>SOIL MOISTURE:</span>
                      <span className="text-green-400 font-bold">{(weatherData.data.environmental.soil_moisture * 100).toFixed(1)}%</span>
                    </div>
                  )}
                  {weatherData?.data?.environmental?.evapotranspiration && (
                    <div className="flex justify-between gap-4">
                      <span>EVAPORATION:</span>
                      <span className="text-yellow-400 font-bold">{weatherData.data.environmental.evapotranspiration.toFixed(2)} mm</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Water Level Analysis */}
              <div className="absolute bottom-4 right-4 bg-black/90 rounded-lg p-3 text-white border border-blue-500 pointer-events-auto shadow-xl">
                <div className="text-xs font-semibold mb-2 text-blue-400">RESERVOIR STATUS</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-2 bg-gradient-to-r from-blue-200 to-blue-600"></div>
                    <span>90%+ EXCELLENT</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-2 bg-gradient-to-r from-blue-400 to-blue-700"></div>
                    <span>80-90% GOOD</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-2 bg-gradient-to-r from-cyan-400 to-blue-600"></div>
                    <span>70-80% MODERATE</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-2 bg-gradient-to-r from-blue-300 to-cyan-500"></div>
                    <span>&lt;70% LOW</span>
                  </div>
                </div>
              </div>
              
              {/* Satellite Info */}
              <div className="absolute top-4 right-4 bg-black/90 rounded-lg p-2 text-white border border-green-500 pointer-events-auto shadow-xl">
                <div className="text-xs text-green-400 font-semibold">GOOGLE SATELLITE</div>
                <div className="text-xs text-gray-300">+ Water Analysis</div>
                <div className="text-xs text-gray-400">Mumbai Water Bodies</div>
                <div className="text-xs text-cyan-400">Real-time Monitoring</div>
              </div>
            </div>
          </ChartCard>
        </div>
      </main>
    </div>
  )
}
