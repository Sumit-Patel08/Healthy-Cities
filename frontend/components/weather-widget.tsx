"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Cloud, 
  Sun, 
  Wind, 
  Droplets, 
  Thermometer, 
  Eye, 
  AlertTriangle,
  Activity,
  Gauge,
  RefreshCw
} from "lucide-react"
import { apiClient, CurrentWeatherData, HealthAlertsData, getAQIColor, getAQICategory } from "@/lib/api"

interface WeatherWidgetProps {
  className?: string;
}

export function WeatherWidget({ className = "" }: WeatherWidgetProps) {
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(null)
  const [healthAlerts, setHealthAlerts] = useState<HealthAlertsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    fetchWeatherData()
    // Refresh every 5 minutes
    const interval = setInterval(fetchWeatherData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchWeatherData = async () => {
    try {
      setLoading(true)
      
      // Fetch current weather and health alerts
      const [weatherResponse, alertsResponse] = await Promise.all([
        apiClient.getCurrentWeather(),
        apiClient.getHealthAlerts()
      ])

      if (weatherResponse.error) {
        setError(weatherResponse.error)
      } else if (weatherResponse.data) {
        setWeatherData(weatherResponse.data as CurrentWeatherData)
        setError(null)
      }

      if (alertsResponse.data) {
        setHealthAlerts(alertsResponse.data as HealthAlertsData)
      }

      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      setError('Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !weatherData) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-lg border border-gray-200 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    )
  }

  if (error && !weatherData) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-lg border border-gray-200 ${className}`}>
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-lg font-medium text-gray-700">Weather Service Unavailable</p>
          <p className="text-sm text-gray-500">{error}</p>
          <button 
            onClick={fetchWeatherData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const weather = weatherData?.data?.weather
  const airQuality = weatherData?.data?.air_quality
  const environmental = weatherData?.data?.environmental
  const healthIndices = weatherData?.data?.health_indices

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Real-time Weather</h3>
            <p className="text-sm opacity-90">Mumbai • Meteomatics API</p>
          </div>
          <button
            onClick={fetchWeatherData}
            disabled={loading}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Current Conditions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Thermometer className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {weather?.temperature?.toFixed(1) || '--'}°C
            </p>
            <p className="text-sm text-gray-600">Temperature</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {weather?.humidity?.toFixed(0) || '--'}%
            </p>
            <p className="text-sm text-gray-600">Humidity</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <Wind className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {weather?.wind_speed?.toFixed(1) || '--'} m/s
            </p>
            <p className="text-sm text-gray-600">Wind Speed</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <Gauge className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {weather?.pressure?.toFixed(0) || '--'} hPa
            </p>
            <p className="text-sm text-gray-600">Pressure</p>
          </motion.div>
        </div>

        {/* Air Quality Section */}
        {airQuality && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border-t pt-6"
          >
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Air Quality Index
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full bg-${getAQIColor(airQuality.aqi || 0)}-500 flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-white font-bold text-lg">
                    {airQuality.aqi?.toFixed(0) || '--'}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {getAQICategory(airQuality.aqi || 0)}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">
                  {airQuality.pm2_5?.toFixed(1) || '--'}
                </p>
                <p className="text-sm text-gray-600">PM2.5 μg/m³</p>
              </div>
              
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">
                  {airQuality.pm10?.toFixed(1) || '--'}
                </p>
                <p className="text-sm text-gray-600">PM10 μg/m³</p>
              </div>
              
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">
                  {airQuality.no2?.toFixed(1) || '--'}
                </p>
                <p className="text-sm text-gray-600">NO2 μg/m³</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Health Indices */}
        {healthIndices && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="border-t pt-6"
          >
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Health Risk Assessment
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-600 mb-1">Air Quality Risk</p>
                <p className="font-semibold text-gray-800">{healthIndices.air_quality_risk}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-600 mb-1">Heat Stress Risk</p>
                <p className="font-semibold text-gray-800">{healthIndices.heat_stress_risk}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-600 mb-1">UV Risk</p>
                <p className="font-semibold text-gray-800">{healthIndices.uv_risk}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Health Alerts */}
        {healthAlerts?.data?.alerts && healthAlerts.data.alerts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="border-t pt-6"
          >
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Active Health Alerts ({healthAlerts.data.alert_count})
            </h4>
            <div className="space-y-3">
              {healthAlerts.data.alerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  alert.level === 'high' ? 'bg-red-50 border-red-500' : 
                  alert.level === 'moderate' ? 'bg-yellow-50 border-yellow-500' : 
                  'bg-orange-50 border-orange-500'
                }`}>
                  <p className="font-medium text-gray-800 capitalize">
                    {alert.type.replace('_', ' ')} Alert
                  </p>
                  <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                  {alert.recommendations.length > 0 && (
                    <ul className="text-xs text-gray-600 space-y-1">
                      {alert.recommendations.slice(0, 2).map((rec, i) => (
                        <li key={i} className="flex items-start">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Last Updated */}
        <div className="text-center text-xs text-gray-500 border-t pt-4">
          Last updated: {lastUpdated} • Data from Meteomatics API
        </div>
      </div>
    </div>
  )
}
