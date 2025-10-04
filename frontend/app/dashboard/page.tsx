"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { MetricCard } from "@/components/metric-card"
import { ChartCard } from "@/components/chart-card"
import { AnimatedBackground } from "@/components/animated-background"
import { Wind, Thermometer, Droplets, Building2, AlertTriangle, Satellite } from "lucide-react"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { apiClient, DashboardOverview, formatDate, getRiskColor, getAQIColor } from "@/lib/api"

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null)
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
      const response = await apiClient.getDashboardOverview()
      
      if (response.error) {
        setError(response.error)
      } else if (response.data) {
        setDashboardData(response.data as DashboardOverview)
        setLastUpdated(new Date().toLocaleTimeString())
        setError(null)
      }
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
                      Real NASA Satellite Data - {dashboardData.data_quality}
                    </p>
                    <p className="text-xs text-green-600">
                      Last updated: {lastUpdated} | Location: {dashboardData.location}
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

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Air Quality Index" 
              value={dashboardData?.current_conditions?.aqi?.toFixed(0) || "0"} 
              change={`${dashboardData?.current_conditions?.air_quality_status || "Unknown"}`} 
              icon={Wind} 
              trend={(dashboardData?.current_conditions?.aqi || 0) > 50 ? "up" : "down"} 
              delay={0} 
            />
            <MetricCard 
              title="Temperature" 
              value={`${dashboardData?.current_conditions?.temperature?.toFixed(1) || "0"}°C`} 
              change={`Heat Index: ${dashboardData?.current_conditions?.heat_index?.toFixed(1) || "0"}°C`} 
              icon={Thermometer} 
              trend={(dashboardData?.current_conditions?.temperature || 0) > 30 ? "up" : "down"} 
              delay={0.1} 
            />
            <MetricCard 
              title="Flood Risk" 
              value={`${dashboardData?.current_conditions?.flood_risk?.toFixed(0) || "0"}%`} 
              change={`Humidity: ${dashboardData?.current_conditions?.humidity?.toFixed(0) || "0"}%`} 
              icon={Droplets} 
              trend={(dashboardData?.current_conditions?.flood_risk || 0) > 40 ? "up" : "down"} 
              delay={0.2} 
            />
            <MetricCard 
              title="Health Score" 
              value={`${dashboardData?.environmental_health_score?.toFixed(0) || "0"}`} 
              change={`Risk Level: ${dashboardData?.current_conditions?.heat_risk_level || "Unknown"}`} 
              icon={Building2} 
              trend={(dashboardData?.environmental_health_score || 0) > 70 ? "up" : "down"} 
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
            <ChartCard title="Environmental Health Trend" description="Real-time NASA data" delay={0.4}>
              <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                <div className="text-center space-y-2">
                  <Satellite className="w-8 h-8 text-blue-500 mx-auto" />
                  <p className="text-sm font-medium text-gray-700">Real-time chart will display here</p>
                  <p className="text-xs text-gray-500">Connected to NASA MODIS & POWER data</p>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Risk Assessment Overview" description="Multi-parameter analysis" delay={0.5}>
              <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                <div className="text-center space-y-2">
                  <AlertTriangle className="w-8 h-8 text-green-500 mx-auto" />
                  <p className="text-sm font-medium text-gray-700">Risk analysis visualization</p>
                  <p className="text-xs text-gray-500">Based on 5 trained ML models</p>
                </div>
              </div>
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
