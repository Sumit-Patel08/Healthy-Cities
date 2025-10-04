import React from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Lightbulb, 
  TrendingUp, 
  Users,
  AlertTriangle,
  Download,
  RefreshCw,
  Zap,
  Car,
  Factory
} from 'lucide-react'

import StatCard from '../components/StatCard'
import ChartView from '../components/ChartView'
import MapView from '../components/MapView'
import DataTable from '../components/DataTable'
import LoaderSkeleton from '../components/LoaderSkeleton'
import useFetch from '../hooks/useFetch'
import { getUrbanData } from '../services/api'

const Urban = ({ onAlert }) => {
  const { data, loading, error, refresh } = useFetch(getUrbanData, {}, { 
    pollInterval: 300000 // 5 minutes
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
            Failed to load urban data
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

  const stats = [
    {
      title: 'Nighttime Lights',
      value: data.nighttime_lights_intensity,
      unit: 'NTL',
      status: 'good',
      trend: 'up',
      trendValue: '15%',
      icon: Lightbulb,
      color: 'yellow',
      description: 'VIIRS intensity'
    },
    {
      title: 'Urban Activity',
      value: data.urban_activity_index ? (data.urban_activity_index * 100).toFixed(0) : 0,
      unit: '%',
      status: 'good',
      trend: 'up',
      trendValue: '3.1%',
      icon: TrendingUp,
      color: 'green',
      description: 'Activity index'
    },
    {
      title: 'Population Density',
      value: (data.population_density_estimate / 1000).toFixed(1),
      unit: 'K/km²',
      status: data.population_density_estimate > 25000 ? 'warning' : 'good',
      trend: 'up',
      trendValue: '2.5%',
      icon: Users,
      color: 'purple',
      description: 'Estimated density'
    },
    {
      title: 'Economic Activity',
      value: data.economic_activity_score,
      unit: '/10',
      status: 'good',
      trend: 'up',
      trendValue: '0.3',
      icon: Factory,
      color: 'indigo',
      description: 'Economic score'
    }
  ]

  const activityZonesColumns = [
    { key: 'location', label: 'Location', type: 'text' },
    { 
      key: 'activity_level', 
      label: 'Activity Level', 
      type: 'status',
      render: (value) => {
        const colors = {
          'Very High': 'bg-red-100 text-red-800',
          'High': 'bg-orange-100 text-orange-800',
          'Moderate': 'bg-yellow-100 text-yellow-800',
          'Low': 'bg-green-100 text-green-800'
        }
        return <span className={`px-2 py-1 rounded-full text-xs ${colors[value] || 'bg-gray-100 text-gray-800'}`}>{value}</span>
      }
    },
    { key: 'lights_intensity', label: 'Light Intensity', type: 'number', decimals: 1 },
    { 
      key: 'zone_type', 
      label: 'Zone Type', 
      type: 'status',
      render: (value) => {
        const colors = {
          'Commercial': 'bg-blue-100 text-blue-800',
          'Residential': 'bg-green-100 text-green-800',
          'Mixed Use': 'bg-purple-100 text-purple-800',
          'Industrial': 'bg-gray-100 text-gray-800'
        }
        return <span className={`px-2 py-1 rounded-full text-xs ${colors[value] || 'bg-gray-100 text-gray-800'}`}>{value}</span>
      }
    }
  ]

  const activityZonesData = data.activity_zones || []

  const developmentProjectsColumns = [
    { key: 'name', label: 'Project Name', type: 'text' },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'status',
      render: (value) => {
        const colors = {
          'Completed': 'bg-green-100 text-green-800',
          'In Progress': 'bg-blue-100 text-blue-800',
          'Under Construction': 'bg-yellow-100 text-yellow-800',
          'Planning': 'bg-gray-100 text-gray-800'
        }
        return <span className={`px-2 py-1 rounded-full text-xs ${colors[value] || 'bg-gray-100 text-gray-800'}`}>{value}</span>
      }
    },
    { key: 'completion', label: 'Expected Completion', type: 'date' },
    { key: 'impact_score', label: 'Impact Score', type: 'number', decimals: 1 }
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
            Urban Development Monitoring
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            City growth analysis using VIIRS nighttime lights and urban activity metrics
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
          title="Nighttime Lights Trend (24 Hours)"
          xKey="timestamp"
          yKey="lights_intensity"
          type="area"
          color="#fbbf24"
          height={300}
        />
        
        <ChartView
          data={data.time_series || []}
          title="Urban Activity Index"
          xKey="timestamp"
          yKey="activity_index"
          type="line"
          color="#8b5cf6"
          height={300}
        />
      </div>

      {/* Map */}
      <MapView
        data={{ hotspots: data.activity_zones || [] }}
        layers={[
          { id: 'nighttime_lights', name: 'Nighttime Lights' },
          { id: 'activity_zones', name: 'Activity Zones' },
          { id: 'development', name: 'Development Projects' }
        ]}
        title="Urban Activity Zones"
        timeEnabled={true}
      />

      {/* Activity Zones Table */}
      <DataTable
        data={activityZonesData}
        columns={activityZonesColumns}
        title="High Activity Zones"
        searchable={true}
        sortable={true}
      />

      {/* VIIRS Data */}
      {data.viirs_data && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            NASA VIIRS Nighttime Lights Data
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {data.viirs_data.current_radiance}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Current Radiance
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {data.viirs_data.cloud_free_observations}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Cloud-free Obs.
              </div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-medium ${
                data.viirs_data.data_quality === 'High' ? 'text-green-600' :
                data.viirs_data.data_quality === 'Medium' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {data.viirs_data.data_quality}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Data Quality
              </div>
            </div>
            <div className="text-center">
              <a
                href={data.viirs_data.geotiff_url}
                className="inline-flex items-center space-x-2 text-cyan-500 hover:text-cyan-600 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Urban Expansion */}
      {data.urban_expansion && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Urban Expansion Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {data.urban_expansion.built_up_area} km²
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Built-up Area
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {data.urban_expansion.change_from_2020}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Change from 2020
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {data.urban_expansion.expansion_rate}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Annual Growth Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {data.urban_expansion.new_developments}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                New Developments
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Infrastructure & Economic Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transportation Activity */}
        {data.transportation_activity && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Car className="w-5 h-5 text-blue-500" />
              <span>Transportation Activity</span>
            </h3>
            <div className="space-y-4">
              {Object.entries(data.transportation_activity).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {key.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${value * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                      {(value * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Economic Indicators */}
        {data.economic_indicators && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>Economic Indicators</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">GDP Contribution</span>
                <span className="text-lg font-bold text-green-600">
                  {data.economic_indicators.gdp_contribution}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Employment Rate</span>
                <span className="text-lg font-bold text-blue-600">
                  {(data.economic_indicators.employment_rate * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Business Establishments</span>
                <span className="text-lg font-bold text-purple-600">
                  {(data.economic_indicators.business_establishments / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Industrial Activity</span>
                <div className="flex items-center space-x-3">
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-indigo-500"
                      style={{ width: `${data.economic_indicators.industrial_activity * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {(data.economic_indicators.industrial_activity * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Infrastructure Metrics */}
      {data.infrastructure_metrics && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>Infrastructure Coverage</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(data.infrastructure_metrics).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 mb-2">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - (typeof value === 'number' ? value : parseFloat(value) / 100))}`}
                      className="text-cyan-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {typeof value === 'number' ? (value * 100).toFixed(0) : value}%
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {key.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Development Projects */}
      {data.development_projects && (
        <DataTable
          data={data.development_projects}
          columns={developmentProjectsColumns}
          title="Major Development Projects"
          searchable={true}
          sortable={true}
        />
      )}

      {/* Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Key Urban Development Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.insights?.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default Urban
