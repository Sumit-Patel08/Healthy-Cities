import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Wind, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp,
  Eye,
  Heart,
  Download,
  RefreshCw
} from 'lucide-react'

import StatCard from '../components/StatCard'
import ChartView from '../components/ChartView'
import MapView from '../components/MapView'
import DataTable from '../components/DataTable'
import LoaderSkeleton from '../components/LoaderSkeleton'
import useFetch from '../hooks/useFetch'
import { getAirData } from '../services/api'

const Air = ({ onAlert }) => {
  const { data, loading, error, refresh } = useFetch(getAirData, {}, { 
    pollInterval: 30000 // 30 seconds - reasonable update frequency
  })

  // Debug logging for Air page
  console.log('🌬️ Air Page State:', { 
    hasData: !!data, 
    loading, 
    error: !!error,
    dataKeys: data ? Object.keys(data) : []
  })

  // Show data immediately, don't wait for loading to finish
  if (!data) {
    return (
      <div className="p-6">
        <LoaderSkeleton type="page" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Failed to load air quality data
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { status: 'good', color: 'text-green-600', bg: 'bg-green-50' }
    if (aqi <= 100) return { status: 'moderate', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    if (aqi <= 150) return { status: 'unhealthy_sensitive', color: 'text-orange-600', bg: 'bg-orange-50' }
    if (aqi <= 200) return { status: 'unhealthy', color: 'text-red-600', bg: 'bg-red-50' }
    if (aqi <= 300) return { status: 'very_unhealthy', color: 'text-purple-600', bg: 'bg-purple-50' }
    return { status: 'hazardous', color: 'text-red-800', bg: 'bg-red-100' }
  }

  const aqiStatus = getAQIStatus(data.current_aqi)

  const stats = [
    {
      title: 'Current AQI',
      value: data.current_aqi,
      unit: '',
      status: aqiStatus.status,
      trend: data.forecast_24h?.aqi_trend === 'improving' ? 'down' : 'up',
      trendValue: `${Math.abs(data.current_aqi - data.forecast_24h?.expected_aqi || 0)}`,
      icon: Wind,
      color: 'red',
      description: data.aqi_category
    },
    {
      title: 'PM2.5',
      value: data.pm25_current,
      unit: 'μg/m³',
      status: data.pm25_current > 60 ? 'danger' : data.pm25_current > 35 ? 'warning' : 'good',
      trend: 'up',
      trendValue: '12%',
      icon: Heart,
      color: 'orange',
      description: 'Fine particles'
    },
    {
      title: 'PM10',
      value: data.pm10_current,
      unit: 'μg/m³',
      status: data.pm10_current > 100 ? 'danger' : data.pm10_current > 50 ? 'warning' : 'good',
      trend: 'up',
      trendValue: '8%',
      icon: Eye,
      color: 'yellow',
      description: 'Coarse particles'
    },
    {
      title: 'NO₂',
      value: data.no2_current,
      unit: 'ppb',
      status: data.no2_current > 100 ? 'danger' : data.no2_current > 50 ? 'warning' : 'good',
      trend: 'down',
      trendValue: '3%',
      icon: Wind,
      color: 'blue',
      description: 'Nitrogen dioxide'
    }
  ]

  const hotspotsColumns = [
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'aqi', label: 'AQI', type: 'number' },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'status',
      render: (value) => {
        const aqi = value
        if (aqi <= 50) return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Good</span>
        if (aqi <= 100) return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Moderate</span>
        if (aqi <= 150) return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Unhealthy for Sensitive</span>
        if (aqi <= 200) return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Unhealthy</span>
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Very Unhealthy</span>
      }
    },
    { key: 'primary_source', label: 'Primary Source', type: 'text' }
  ]

  const hotspotsData = data.hotspots?.map(hotspot => ({
    ...hotspot,
    status: hotspot.aqi
  })) || []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Air Quality Monitoring
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time air pollution data from NASA MODIS and ground sensors
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={refresh}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Health Advisory */}
      <div className={`${aqiStatus.bg} border-l-4 border-red-500 p-4 rounded-lg`}>
        <div className="flex items-start space-x-3">
          <AlertTriangle className={`w-5 h-5 mt-0.5 ${aqiStatus.color}`} />
          <div>
            <h3 className={`font-semibold ${aqiStatus.color}`}>
              Health Advisory
            </h3>
            <p className={`text-sm mt-1 ${aqiStatus.color}`}>
              {data.health_advisory}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartView
          data={data.time_series || []}
          title="AQI Trend (24 Hours)"
          xKey="timestamp"
          yKey="aqi"
          type="line"
          color="#ef4444"
          height={300}
        />
        
        <ChartView
          data={data.time_series || []}
          title="PM2.5 Levels"
          xKey="timestamp"
          yKey="pm25"
          type="area"
          color="#f97316"
          height={300}
        />
      </div>

      {/* Map */}
      <MapView
        data={{ hotspots: data.hotspots || [] }}
        layers={[
          { id: 'aqi', name: 'AQI Levels' },
          { id: 'pm25', name: 'PM2.5' },
          { id: 'modis_aod', name: 'MODIS AOD' }
        ]}
        title="Air Quality Hotspots"
      />

      {/* Hotspots Table */}
      <DataTable
        data={hotspotsData}
        columns={hotspotsColumns}
        title="Air Quality Hotspots"
        searchable={true}
        sortable={true}
      />

      {/* Insights Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.insights?.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MODIS Data */}
      {data.modis_aod && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            NASA MODIS Aerosol Optical Depth
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.modis_aod.current_value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Current AOD
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.modis_aod.description}
              </p>
              <a
                href={data.modis_aod.geotiff_url}
                className="inline-flex items-center space-x-2 mt-2 text-cyan-500 hover:text-cyan-600 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download GeoTIFF</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default Air
