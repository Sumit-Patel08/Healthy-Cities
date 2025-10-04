import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Droplets, 
  CloudRain, 
  Waves, 
  AlertTriangle,
  Download,
  RefreshCw,
  Gauge,
  MapPin,
  TrendingUp
} from 'lucide-react'

import StatCard from '../components/StatCard'
import ChartView from '../components/ChartView'
import MapView from '../components/MapView'
import DataTable from '../components/DataTable'
import LoaderSkeleton from '../components/LoaderSkeleton'
import useFetch from '../hooks/useFetch'
import { getWaterData } from '../services/api'

const Water = ({ onAlert }) => {
  const { data, loading, error, refresh } = useFetch(getWaterData, {}, { 
    pollInterval: 300000, // 5 minutes
    onSuccess: (data) => {
      if (data.flood_probability > 0.7) {
        onAlert({
          type: 'danger',
          title: 'High Flood Risk',
          message: `Flood probability is ${(data.flood_probability * 100).toFixed(0)}% - Prepare for potential flooding`,
          action: {
            label: 'View Flood Zones',
            onClick: () => console.log('Show flood zones')
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
            Failed to load water data
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

  const getFloodRiskStatus = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return { status: 'good', color: 'text-green-600', bg: 'bg-green-50' }
      case 'moderate': return { status: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-50' }
      case 'high': return { status: 'danger', color: 'text-red-600', bg: 'bg-red-50' }
      case 'extreme': return { status: 'critical', color: 'text-red-800', bg: 'bg-red-100' }
      default: return { status: 'normal', color: 'text-gray-600', bg: 'bg-gray-50' }
    }
  }

  const floodStatus = getFloodRiskStatus(data.flood_risk_level)

  const stats = [
    {
      title: 'Current Rainfall',
      value: data.current_rainfall,
      unit: 'mm',
      status: data.current_rainfall > 20 ? 'warning' : 'good',
      trend: 'up',
      trendValue: '15mm',
      icon: CloudRain,
      color: 'blue',
      description: 'Hourly rainfall'
    },
    {
      title: '24h Rainfall',
      value: data.rainfall_24h,
      unit: 'mm',
      status: data.rainfall_24h > 50 ? 'danger' : data.rainfall_24h > 25 ? 'warning' : 'good',
      trend: 'up',
      trendValue: '28mm',
      icon: Droplets,
      color: 'cyan',
      description: 'Daily accumulation'
    },
    {
      title: 'Flood Probability',
      value: data.flood_probability ? (data.flood_probability * 100).toFixed(0) : 0,
      unit: '%',
      status: floodStatus.status,
      trend: 'up',
      trendValue: '12%',
      icon: Waves,
      color: 'red',
      description: data.flood_risk_level
    },
    {
      title: 'Drainage Capacity',
      value: data.drainage_capacity,
      unit: '%',
      status: data.drainage_capacity < 50 ? 'danger' : data.drainage_capacity < 75 ? 'warning' : 'good',
      trend: 'down',
      trendValue: '8%',
      icon: Gauge,
      color: 'purple',
      description: 'System utilization'
    }
  ]

  const floodZonesColumns = [
    { key: 'location', label: 'Location', type: 'text' },
    { 
      key: 'risk_level', 
      label: 'Risk Level', 
      type: 'status',
      render: (value) => {
        const colors = {
          'Low': 'bg-green-100 text-green-800',
          'Moderate': 'bg-yellow-100 text-yellow-800',
          'High': 'bg-red-100 text-red-800',
          'Extreme': 'bg-purple-100 text-purple-800'
        }
        return <span className={`px-2 py-1 rounded-full text-xs ${colors[value] || 'bg-gray-100 text-gray-800'}`}>{value}</span>
      }
    },
    { key: 'water_depth_forecast', label: 'Expected Depth', type: 'number', decimals: 1 },
    { 
      key: 'evacuation_status', 
      label: 'Status', 
      type: 'status',
      render: (value) => {
        const colors = {
          'Normal': 'bg-green-100 text-green-800',
          'Monitor': 'bg-yellow-100 text-yellow-800',
          'Alert': 'bg-orange-100 text-orange-800',
          'Evacuate': 'bg-red-100 text-red-800'
        }
        return <span className={`px-2 py-1 rounded-full text-xs ${colors[value] || 'bg-gray-100 text-gray-800'}`}>{value}</span>
      }
    }
  ]

  const floodZonesData = data.flood_zones || []

  const reservoirColumns = [
    { key: 'name', label: 'Reservoir', type: 'text' },
    { key: 'current_level', label: 'Current Level', type: 'number', decimals: 1 },
    { key: 'capacity', label: 'Capacity', type: 'number', decimals: 0 },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'status',
      render: (value) => {
        const colors = {
          'Excellent': 'bg-green-100 text-green-800',
          'Good': 'bg-blue-100 text-blue-800',
          'Adequate': 'bg-yellow-100 text-yellow-800',
          'Low': 'bg-red-100 text-red-800'
        }
        return <span className={`px-2 py-1 rounded-full text-xs ${colors[value] || 'bg-gray-100 text-gray-800'}`}>{value}</span>
      }
    }
  ]

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
            Water & Flood Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Flood risk assessment using NDWI, SMAP soil moisture, and rainfall data
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

      {/* Flood Risk Alert */}
      {data.flood_risk_level !== 'Low' && (
        <div className={`${floodStatus.bg} border-l-4 border-blue-500 p-4 rounded-lg`}>
          <div className="flex items-start space-x-3">
            <Waves className={`w-5 h-5 mt-0.5 ${floodStatus.color}`} />
            <div>
              <h3 className={`font-semibold ${floodStatus.color}`}>
                Flood Risk: {data.flood_risk_level}
              </h3>
              <p className={`text-sm mt-1 ${floodStatus.color}`}>
                Current flood probability is {(data.flood_probability * 100).toFixed(0)}%. 
                {data.monsoon_status === 'Active' && ' Monsoon season is active.'}
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
          title="Rainfall Trend (24 Hours)"
          xKey="timestamp"
          yKey="rainfall"
          type="bar"
          color="#06b6d4"
          height={300}
        />
        
        <ChartView
          data={data.time_series || []}
          title="Water Level Monitoring"
          xKey="timestamp"
          yKey="water_level"
          type="line"
          color="#3b82f6"
          height={300}
        />
      </div>

      {/* Map */}
      <MapView
        data={{ hotspots: data.flood_zones || [] }}
        layers={[
          { id: 'rainfall', name: 'Rainfall' },
          { id: 'flood_risk', name: 'Flood Risk' },
          { id: 'ndwi', name: 'NDWI' },
          { id: 'drainage', name: 'Drainage Systems' }
        ]}
        title="Flood Risk Zones"
        timeEnabled={true}
      />

      {/* Flood Zones Table */}
      <DataTable
        data={floodZonesData}
        columns={floodZonesColumns}
        title="Flood Risk Zones"
        searchable={true}
        sortable={true}
      />

      {/* NDWI Analysis */}
      {data.ndwi_analysis && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            NDWI Water Body Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {data.ndwi_analysis.current_value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                NDWI Index
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-500">
                {data.ndwi_analysis.water_body_extent} km²
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Water Body Extent
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${data.ndwi_analysis.change_from_baseline.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                {data.ndwi_analysis.change_from_baseline}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Change from Baseline
              </div>
            </div>
            <div className="text-center">
              <a
                href={data.ndwi_analysis.geotiff_url}
                className="inline-flex items-center space-x-2 text-cyan-500 hover:text-cyan-600 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SMAP Soil Moisture */}
      {data.smap_soil_moisture && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            NASA SMAP Soil Moisture
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-brown-500">
                {data.smap_soil_moisture.current_value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Soil Moisture (m³/m³)
              </div>
            </div>
            <div>
              <div className="mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Saturation Level: </span>
                <span className={`font-medium ${
                  data.smap_soil_moisture.saturation_level === 'High' ? 'text-red-600' :
                  data.smap_soil_moisture.saturation_level === 'Medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {data.smap_soil_moisture.saturation_level}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Infiltration Capacity: </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {data.smap_soil_moisture.infiltration_capacity}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {data.smap_soil_moisture.description}
            </div>
          </div>
        </div>
      )}

      {/* Reservoir Levels */}
      {data.reservoir_levels && (
        <DataTable
          data={data.reservoir_levels}
          columns={reservoirColumns}
          title="Reservoir Water Levels"
          searchable={false}
          sortable={true}
        />
      )}

      {/* Drainage Systems */}
      {data.drainage_systems && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Storm Drainage System
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Capacity Utilization</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${data.drainage_systems.storm_drains.capacity_utilization}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {data.drainage_systems.storm_drains.capacity_utilization}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Blocked Drains</span>
                <span className="text-sm font-medium text-red-600">
                  {data.drainage_systems.storm_drains.blocked_drains}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Maintenance Required</span>
                <span className="text-sm font-medium text-yellow-600">
                  {data.drainage_systems.storm_drains.maintenance_required}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pumping Stations
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Operational</span>
                <span className="text-sm font-medium text-green-600">
                  {data.drainage_systems.pumping_stations.operational}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Under Maintenance</span>
                <span className="text-sm font-medium text-yellow-600">
                  {data.drainage_systems.pumping_stations.under_maintenance}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">System Efficiency</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${data.drainage_systems.pumping_stations.efficiency}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {data.drainage_systems.pumping_stations.efficiency}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Water Quality */}
      {data.water_quality && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Water Quality Assessment
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-500">
                {data.water_quality.ph_level}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">pH Level</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-500">
                {data.water_quality.turbidity}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Turbidity (NTU)</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-500">
                {data.water_quality.dissolved_oxygen}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">DO (mg/L)</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bacterial Count</div>
              <div className="text-sm font-medium text-green-600">
                {data.water_quality.bacterial_count}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {data.water_quality.overall_grade}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Overall Grade</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default Water
