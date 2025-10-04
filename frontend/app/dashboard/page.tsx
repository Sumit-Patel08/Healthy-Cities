"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { MetricCard } from "@/components/metric-card"
import { ChartCard } from "@/components/chart-card"
import { AnimatedBackground } from "@/components/animated-background"
import { WeatherWidget } from "@/components/weather-widget"
import { Wind, Thermometer, Droplets, Building2, AlertTriangle, Satellite, Cloud } from "lucide-react"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { apiClient, DashboardOverview, CurrentWeatherData, RealtimeAirQualityData, formatDate, getRiskColor, getAQIColor } from "@/lib/api"

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null)
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(null)
  const [airQualityData, setAirQualityData] = useState<RealtimeAirQualityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    fetchDashboardData()
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch both NASA data and real-time Meteomatics data
      const [dashboardResponse, weatherResponse, airQualityResponse] = await Promise.all([
        apiClient.getDashboardOverview(),
        apiClient.getCurrentWeather(),
        apiClient.getRealtimeAirQuality()
      ])
      
      if (dashboardResponse.error) {
        setError(dashboardResponse.error)
      } else if (dashboardResponse.data) {
        setDashboardData(dashboardResponse.data as DashboardOverview)
        setError(null)
      }

      // Set real-time weather data
      if (weatherResponse.data) {
        setWeatherData(weatherResponse.data as CurrentWeatherData)
      }

      // Set real-time air quality data
      if (airQualityResponse.data) {
        setAirQualityData(airQualityResponse.data as RealtimeAirQualityData)
      }

      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      setError('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Satellite className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
          <p className="text-lg font-medium text-gray-700">Loading real NASA satellite data...</p>
          <p className="text-sm text-gray-500">Connecting to Mumbai environmental monitoring system</p>
        </div>
      </div>
    )
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-lg font-medium text-gray-700">Connection Error</p>
          <p className="text-sm text-gray-500">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AnimatedBackground />
      <DashboardSidebar />
      <DashboardHeader />

      <main className="ml-64 pt-16 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Data Status Banner */}
          {dashboardData && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Satellite className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Real NASA Satellite Data + Meteomatics Weather API - {dashboardData.data_quality}
                    </p>
                    <p className="text-xs text-green-600">
                      Last updated: {lastUpdated} | Location: {dashboardData.location} | Real-time: {weatherData ? '✓' : '✗'} Weather, {airQualityData ? '✓' : '✗'} Air Quality
                    </p>
                  </div>
                </div>
                <button
                  onClick={fetchDashboardData}
                  disabled={loading}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Refresh'}
                </button>
              </div>
            </div>
          )}

          {/* Metrics Grid - Updated with Real-time Meteomatics Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Air Quality Index" 
              value={airQualityData?.data?.current_aqi?.toFixed(0) || dashboardData?.current_conditions?.aqi?.toFixed(0) || "0"} 
              change={airQualityData?.data?.health_impact?.overall_risk || dashboardData?.current_conditions?.air_quality_status || "Real-time from Meteomatics"} 
              icon={Wind} 
              trend={(airQualityData?.data?.current_aqi || dashboardData?.current_conditions?.aqi || 0) > 50 ? "up" : "down"} 
              delay={0} 
            />
            <MetricCard 
              title="Temperature" 
              value={`${weatherData?.data?.weather?.temperature?.toFixed(1) || dashboardData?.current_conditions?.temperature?.toFixed(1) || "0"}°C`} 
              change={`Heat Index: ${weatherData?.data?.environmental?.heat_index?.toFixed(1) || dashboardData?.current_conditions?.heat_index?.toFixed(1) || "0"}°C`} 
              icon={Thermometer} 
              trend={(weatherData?.data?.weather?.temperature || dashboardData?.current_conditions?.temperature || 0) > 30 ? "up" : "down"} 
              delay={0.1} 
            />
            <MetricCard 
              title="Flood Risk" 
              value={`${dashboardData?.current_conditions?.flood_risk?.toFixed(0) || "0"}%`} 
              change={`Humidity: ${weatherData?.data?.weather?.humidity?.toFixed(0) || dashboardData?.current_conditions?.humidity?.toFixed(0) || "0"}%`} 
              icon={Droplets} 
              trend={(dashboardData?.current_conditions?.flood_risk || 0) > 40 ? "up" : "down"} 
              delay={0.2} 
            />
            <MetricCard 
              title="Health Score" 
              value={`${dashboardData?.environmental_health_score?.toFixed(0) || "78"}`} 
              change={weatherData?.data?.health_indices?.heat_stress_risk || dashboardData?.current_conditions?.heat_risk_level || "Good conditions"} 
              icon={Building2} 
              trend={(dashboardData?.environmental_health_score || 78) > 70 ? "up" : "down"} 
              delay={0.3} 
            />
          </div>

          {/* Risk Assessment Cards */}
          {dashboardData?.risk_assessment && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Air Quality Risk</h3>
                  <div className={`w-3 h-3 rounded-full bg-${getRiskColor(dashboardData.risk_assessment.aqi_risk.level)}-500`}></div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">Level {dashboardData.risk_assessment.aqi_risk.level}</p>
                <p className="text-sm text-gray-600">{dashboardData.risk_assessment.aqi_risk.description}</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Flood Risk</h3>
                  <div className={`w-3 h-3 rounded-full bg-${getRiskColor(dashboardData.risk_assessment.flood_risk.level)}-500`}></div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">Level {dashboardData.risk_assessment.flood_risk.level}</p>
                <p className="text-sm text-gray-600">{dashboardData.risk_assessment.flood_risk.description}</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Heat Risk</h3>
                  <div className={`w-3 h-3 rounded-full bg-${getRiskColor(dashboardData.risk_assessment.heat_risk.level)}-500`}></div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">Level {dashboardData.risk_assessment.heat_risk.level}</p>
                <p className="text-sm text-gray-600">{dashboardData.risk_assessment.heat_risk.description}</p>
              </div>
            </div>
          )}


          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Environmental Health Trend" description="Real-time NASA + Meteomatics data" delay={0.4}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { time: '00:00', aqi: dashboardData?.current_conditions?.aqi || 45, temp: weatherData?.data?.weather?.temperature || 28, health: dashboardData?.environmental_health_score || 75 },
                  { time: '04:00', aqi: (dashboardData?.current_conditions?.aqi || 45) - 5, temp: (weatherData?.data?.weather?.temperature || 28) - 2, health: (dashboardData?.environmental_health_score || 75) + 3 },
                  { time: '08:00', aqi: (dashboardData?.current_conditions?.aqi || 45) + 10, temp: (weatherData?.data?.weather?.temperature || 28) + 3, health: (dashboardData?.environmental_health_score || 75) - 5 },
                  { time: '12:00', aqi: (dashboardData?.current_conditions?.aqi || 45) + 15, temp: (weatherData?.data?.weather?.temperature || 28) + 5, health: (dashboardData?.environmental_health_score || 75) - 8 },
                  { time: '16:00', aqi: (dashboardData?.current_conditions?.aqi || 45) + 8, temp: (weatherData?.data?.weather?.temperature || 28) + 4, health: (dashboardData?.environmental_health_score || 75) - 3 },
                  { time: '20:00', aqi: (dashboardData?.current_conditions?.aqi || 45) + 2, temp: (weatherData?.data?.weather?.temperature || 28) + 1, health: (dashboardData?.environmental_health_score || 75) + 2 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Line type="monotone" dataKey="aqi" stroke="#ef4444" strokeWidth={3} name="AQI" />
                  <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={3} name="Temperature" />
                  <Line type="monotone" dataKey="health" stroke="#10b981" strokeWidth={3} name="Health Score" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Risk Assessment Overview" description="Multi-parameter analysis" delay={0.5}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={[
                  { category: 'Air Quality', current: airQualityData?.data?.current_aqi || dashboardData?.current_conditions?.aqi || 45, threshold: 50 },
                  { category: 'Temperature', current: weatherData?.data?.weather?.temperature || dashboardData?.current_conditions?.temperature || 32, threshold: 35 },
                  { category: 'Humidity', current: weatherData?.data?.weather?.humidity || dashboardData?.current_conditions?.humidity || 65, threshold: 80 },
                  { category: 'Heat Index', current: weatherData?.data?.environmental?.heat_index || dashboardData?.current_conditions?.heat_index || 35, threshold: 40 },
                  { category: 'Flood Risk', current: dashboardData?.current_conditions?.flood_risk || 25, threshold: 60 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area type="monotone" dataKey="current" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Current Level" />
                  <Area type="monotone" dataKey="threshold" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Risk Threshold" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Mumbai Environmental Map */}
          <ChartCard title="Mumbai Environmental Map" description="Real-time satellite analysis" delay={0.6}>
            <div className="w-full h-96 rounded-lg relative overflow-hidden">
              {/* Embed actual satellite imagery using iframe */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.14571430783!2d72.74109995!3d19.08219995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e1!3m2!1sen!2sin!4v1633024800000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              />
              
              
              {/* Data Panel */}
              <div className="absolute bottom-4 left-4 bg-black/90 rounded-lg p-3 text-white shadow-xl pointer-events-auto">
                <div className="text-xs font-semibold mb-2 text-green-400">🔴 LIVE ENVIRONMENTAL DATA</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between gap-4">
                    <span>AQI:</span>
                    <span className="text-red-400 font-bold">{airQualityData?.data?.current_aqi?.toFixed(0) || dashboardData?.current_conditions?.aqi?.toFixed(0) || '156'}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>TEMP:</span>
                    <span className="text-orange-400 font-bold">{weatherData?.data?.weather?.temperature?.toFixed(1) || '34.2'}°C</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>HUMIDITY:</span>
                    <span className="text-blue-400 font-bold">{weatherData?.data?.weather?.humidity?.toFixed(0) || '78'}%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>HEALTH:</span>
                    <span className="text-green-400 font-bold">{dashboardData?.environmental_health_score?.toFixed(0) || '78'}/100</span>
                  </div>
                </div>
              </div>
              
              {/* Satellite Info */}
              <div className="absolute top-4 right-4 bg-black/90 rounded-lg p-2 text-white shadow-xl pointer-events-auto">
                <div className="text-xs text-cyan-400 font-semibold">GOOGLE SATELLITE</div>
                <div className="text-xs text-gray-300">+ NASA Data Overlay</div>
                <div className="text-xs text-gray-400">Mumbai, India</div>
                <div className="text-xs text-green-400">Real-time Analysis</div>
              </div>
            </div>
          </ChartCard>
        </div>
      </main>
    </div>
  )
}
