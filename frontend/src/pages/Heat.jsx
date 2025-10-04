import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Thermometer, 
  Sun, 
  Droplets, 
  Wind,
  AlertTriangle,
  Download,
  RefreshCw,
  Eye,
  Heart
} from 'lucide-react'

import StatCard from '../components/StatCard'
import ChartView from '../components/ChartView'
import MapView from '../components/MapView'
import DataTable from '../components/DataTable'
import LoaderSkeleton from '../components/LoaderSkeleton'
import useFetch from '../hooks/useFetch'
import { getHeatData } from '../services/api'

const Heat = ({ onAlert }) => {
  const { data, loading, error, refresh } = useFetch(getHeatData, {}, { 
    pollInterval: 300000, // 5 minutes
    onSuccess: (data) => {
      if (data.heat_index > 50) {
        onAlert({
          type: 'danger',
          title: 'Extreme Heat Warning',
          message: `Heat index has reached ${data.heat_index}°C - Dangerous conditions`,
          action: {
            label: 'View Safety Tips',
            onClick: () => console.log('Show safety tips')
          }
        })
      }
    }
  })

  // Temporarily bypass loading check to show data
  if (loading && !data) {
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
            Failed to load heat data
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

  const getHeatStatus = (heatIndex) => {
    if (heatIndex < 27) return { status: 'good', color: 'text-green-600', bg: 'bg-green-50', label: 'Normal' }
    if (heatIndex < 32) return { status: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Caution' }
    if (heatIndex < 41) return { status: 'warning', color: 'text-orange-600', bg: 'bg-orange-50', label: 'Extreme Caution' }
    if (heatIndex < 54) return { status: 'danger', color: 'text-red-600', bg: 'bg-red-50', label: 'Danger' }
    return { status: 'critical', color: 'text-red-800', bg: 'bg-red-100', label: 'Extreme Danger' }
  }

  const heatStatus = getHeatStatus(data.heat_index)

  const stats = [
    {
      title: 'Current Temperature',
      value: data.current_temperature,
      unit: '°C',
      status: data.current_temperature > 35 ? 'danger' : data.current_temperature > 30 ? 'warning' : 'good',
      trend: 'up',
      trendValue: '2.5°C',
      icon: Thermometer,
      color: 'red',
      description: 'Air temperature'
    },
    {
      title: 'Heat Index',
      value: data.heat_index,
      unit: '°C',
      status: heatStatus.status,
      trend: 'up',
      trendValue: '4.2°C',
      icon: Sun,
      color: 'orange',
      description: data.heat_category
    },
    {
      title: 'Humidity',
      value: data.humidity,
      unit: '%',
      status: data.humidity > 80 ? 'warning' : 'good',
      trend: 'up',
      trendValue: '5%',
      icon: Droplets,
      color: 'blue',
      description: 'Relative humidity'
    },
    {
      title: 'UV Index',
      value: data.uv_index,
      unit: '',
      status: data.uv_index > 8 ? 'danger' : data.uv_index > 6 ? 'warning' : 'good',
      trend: 'up',
      trendValue: '1',
      icon: Eye,
      color: 'purple',
      description: 'UV radiation level'
    }
  ]

  const hotspotsColumns = [
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'temperature', label: 'Temperature', type: 'number', decimals: 1 },
    { key: 'heat_index', label: 'Heat Index', type: 'number', decimals: 1 },
    { 
      key: 'risk_level', 
      label: 'Risk Level', 
      type: 'status',
      render: (value) => {
        const colors = {
          'Low': 'bg-green-100 text-green-800',
          'Moderate': 'bg-yellow-100 text-yellow-800',
          'High': 'bg-orange-100 text-orange-800',
          'Extreme': 'bg-red-100 text-red-800'
        }
        return <span className={`px-2 py-1 rounded-full text-xs ${colors[value] || 'bg-gray-100 text-gray-800'}`}>{value}</span>
      }
    }
  ]

  const hotspotsData = data.hotspots || []

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
            Heat Index Monitoring
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Urban heat island analysis using NASA MODIS LST and weather data
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

      {/* Heat Wave Alert */}
      {data.heat_wave_status === 'Active' && (
        <div className={`${heatStatus.bg} border-l-4 border-red-500 p-4 rounded-lg`}>
          <div className="flex items-start space-x-3">
            <AlertTriangle className={`w-5 h-5 mt-0.5 ${heatStatus.color}`} />
            <div>
              <h3 className={`font-semibold ${heatStatus.color}`}>
                Heat Wave Warning Active
              </h3>
              <p className={`text-sm mt-1 ${heatStatus.color}`}>
                Heat index is {data.heat_index}°C - {heatStatus.label} conditions. Take precautions to avoid heat-related illness.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartView
          data={data.time_series || []}
          title="Temperature Trend (24 Hours)"
          xKey="timestamp"
          yKey="temperature"
          type="line"
          color="#ef4444"
          height={300}
        />
        
        <ChartView
          data={data.time_series || []}
          title="Heat Index Trend"
          xKey="timestamp"
          yKey="heat_index"
          type="area"
          color="#f97316"
          height={300}
        />
      </div>

      {/* Map */}
      <MapView
        data={{ hotspots: data.hotspots || [] }}
        layers={[
          { id: 'temperature', name: 'Temperature' },
          { id: 'heat_index', name: 'Heat Index' },
          { id: 'modis_lst', name: 'MODIS LST' }
        ]}
        title="Heat Hotspots"
        timeEnabled={true}
      />

      {/* Hotspots Table */}
      <DataTable
        data={hotspotsData}
        columns={hotspotsColumns}
        title="Heat Hotspots"
        searchable={true}
        sortable={true}
      />

      {/* Urban Heat Island Analysis */}
      {data.urban_heat_island && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Urban Heat Island Effect
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                +{data.urban_heat_island.intensity}°C
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Temperature Difference
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {data.urban_heat_island.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Peak intensity: {data.urban_heat_island.peak_hours}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Health Impacts */}
      {data.health_impacts && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span>Health Impact Assessment</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Heat Stress Risk</div>
                <div className={`text-lg font-semibold ${
                  data.health_impacts.heat_stress_risk === 'High' ? 'text-red-600' :
                  data.health_impacts.heat_stress_risk === 'Moderate' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {data.health_impacts.heat_stress_risk}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Vulnerable Population</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {data.health_impacts.vulnerable_population}M people
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Recommended Actions</div>
              <ul className="space-y-1">
                {data.health_impacts.recommended_actions?.map((action, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* NASA MODIS LST Data */}
      {data.modis_lst && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            NASA MODIS Land Surface Temperature
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {data.modis_lst.day_temperature}°C
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Day LST
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {data.modis_lst.night_temperature}°C
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Night LST
              </div>
            </div>
            <div className="lg:col-span-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {data.modis_lst.description}
              </p>
              <a
                href={data.modis_lst.geotiff_url}
                className="inline-flex items-center space-x-2 text-cyan-500 hover:text-cyan-600 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download GeoTIFF</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* NASA POWER Data */}
      {data.nasa_power && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            NASA POWER Meteorological Data
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-500">
                {data.nasa_power.solar_radiation}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Solar Radiation (kWh/m²)
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-600">
                {data.nasa_power.wind_speed}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Wind Speed (m/s)
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-500">
                {data.nasa_power.relative_humidity}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Relative Humidity
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 flex items-center">
              Data Source: {data.nasa_power.data_source}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default Heat
