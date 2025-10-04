import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Wind, 
  Thermometer, 
  Droplets, 
  Building2, 
  TrendingUp,
  AlertTriangle,
  ArrowRight
} from 'lucide-react'

import StatCard from '../components/StatCard'
import ChartView from '../components/ChartView'
import LoaderSkeleton from '../components/LoaderSkeleton'
import useFetch from '../hooks/useFetch'
import { getIndicesData, getAirData, getHeatData, getWaterData, getUrbanData } from '../services/api'

const Dashboard = ({ onAlert }) => {
  const { data: indicesData, loading: indicesLoading, error: indicesError } = useFetch(getIndicesData, {}, { pollInterval: 60000 }) // 1 minute
  const { data: airData, loading: airLoading, error: airError } = useFetch(getAirData, {}, { pollInterval: 30000 }) // 30 seconds
  const { data: heatData, loading: heatLoading, error: heatError } = useFetch(getHeatData, {}, { pollInterval: 60000 }) // 1 minute
  const { data: waterData, loading: waterLoading, error: waterError } = useFetch(getWaterData, {}, { pollInterval: 45000 }) // 45 seconds
  const { data: urbanData, loading: urbanLoading, error: urbanError } = useFetch(getUrbanData, {}, { pollInterval: 90000 }) // 1.5 minutes

  useEffect(() => {
    const errors = [
      { name: 'Indices', error: indicesError },
      { name: 'Air Quality', error: airError },
      { name: 'Heat', error: heatError },
      { name: 'Water', error: waterError },
      { name: 'Urban', error: urbanError }
    ].filter(e => e.error)

    if (errors.length > 0) {
      onAlert?.({
        type: 'error',
        message: `Error loading data: ${errors.map(e => e.name).join(', ')}`
      })
    }
  }, [indicesError, airError, heatError, waterError, urbanError, onAlert])

  // Debug logging
  // Debug logging
  console.log('🔍 Dashboard State:', {
    indicesData: !!indicesData,
    indicesLoading,
    airData: !!airData,
    airLoading,
    heatData: !!heatData,
    heatLoading,
    waterData: !!waterData,
    waterLoading,
    urbanData: !!urbanData,
    urbanLoading
  })

  // Alerts disabled to prevent UI blocking
  // useEffect(() => {
  //   if (airData && airData.current_aqi > 150) {
  //     onAlert?.({
  //       type: 'warning',
  //       title: 'Air Quality Alert',
  //       message: `AQI is ${airData.current_aqi} - Unhealthy for sensitive groups`,
  //       action: {
  //         label: 'View Details',
  //         onClick: () => window.location.href = '/air'
  //       }
  //     })
  //   }
  // }, [airData, heatData, onAlert])

  const loading = indicesLoading || airLoading || heatLoading || waterLoading || urbanLoading

  if (loading) {
    return (
      <div className="p-6">
        <LoaderSkeleton type="page" />
      </div>
    )
  }

  const quickStats = [
    {
      title: 'Air Quality Index',
      value: airData?.current_aqi || 0,
      unit: 'AQI',
      status: airData?.current_aqi > 150 ? 'danger' : airData?.current_aqi > 100 ? 'warning' : 'good',
      trend: 'down',
      trendValue: '5.2%',
      icon: Wind,
      color: 'red',
      description: airData?.aqi_category || 'Loading...'
    },
    {
      title: 'Heat Index',
      value: heatData?.heat_index || 0,
      unit: '°C',
      status: heatData?.heat_index > 45 ? 'danger' : heatData?.heat_index > 35 ? 'warning' : 'good',
      trend: 'up',
      trendValue: '2.8°C',
      icon: Thermometer,
      color: 'orange',
      description: heatData?.heat_category || 'Loading...'
    },
    {
      title: 'Flood Risk',
      value: waterData?.flood_probability ? (waterData.flood_probability * 100).toFixed(0) : 0,
      unit: '%',
      status: waterData?.flood_risk_level === 'High' ? 'danger' : waterData?.flood_risk_level === 'Moderate' ? 'warning' : 'good',
      trend: 'up',
      trendValue: '12%',
      icon: Droplets,
      color: 'blue',
      description: waterData?.flood_risk_level || 'Loading...'
    },
    {
      title: 'Urban Activity',
      value: urbanData?.urban_activity_index ? (urbanData.urban_activity_index * 100).toFixed(0) : 0,
      unit: '%',
      status: 'good',
      trend: 'up',
      trendValue: '3.1%',
      icon: Building2,
      color: 'purple',
      description: 'High Activity'
    }
  ]

  const domainCards = [
    {
      title: 'Air Quality',
      path: '/air',
      icon: Wind,
      color: 'from-red-500 to-orange-500',
      value: airData?.current_aqi || 0,
      unit: 'AQI',
      status: airData?.aqi_category || 'Loading...',
      description: 'Real-time air pollution monitoring'
    },
    {
      title: 'Heat Management',
      path: '/heat',
      icon: Thermometer,
      color: 'from-orange-500 to-yellow-500',
      value: heatData?.current_temperature || 0,
      unit: '°C',
      status: heatData?.heat_category || 'Loading...',
      description: 'Urban heat island analysis'
    },
    {
      title: 'Water & Floods',
      path: '/water',
      icon: Droplets,
      color: 'from-blue-500 to-cyan-500',
      value: waterData?.current_rainfall || 0,
      unit: 'mm',
      status: waterData?.flood_risk_level || 'Loading...',
      description: 'Flood risk and water management'
    },
    {
      title: 'Urban Development',
      path: '/urban',
      icon: Building2,
      color: 'from-purple-500 to-indigo-500',
      value: urbanData?.nighttime_lights_intensity || 0,
      unit: 'NTL',
      status: 'Active Growth',
      description: 'City expansion and activity'
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
            Mumbai Pulse Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time urban resilience monitoring powered by NASA data
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/indices"
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Resilience Score</span>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Resilience Score Overview */}
      {indicesData && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Overall Resilience Score
            </h2>
            <Link
              to="/indices"
              className="text-cyan-500 hover:text-cyan-600 flex items-center space-x-1 text-sm font-medium"
            >
              <span>View Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - indicesData.overall_resilience_score / 100)}`}
                    className="text-cyan-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {indicesData.overall_resilience_score}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {indicesData.resilience_grade}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {indicesData.trend === 'improving' ? '↗️' : '↘️'} {indicesData.change_from_last_month} from last month
              </p>
            </div>
            
            <div className="space-y-4">
              {Object.entries(indicesData.domain_scores).map(([domain, data]) => (
                <div key={domain} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {domain.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                        style={{ width: `${data.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white w-12 text-right">
                      {data.score.toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {domainCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Link key={index} to={card.path}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all duration-200" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {card.title}
                </h3>
                
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {card.unit}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {card.status}
                </p>
                
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {card.description}
                </p>
              </motion.div>
            </Link>
          )
        })}
      </div>

      {/* Charts and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartView
          data={indicesData?.time_series || []}
          title="Resilience Trend"
          xKey="timestamp"
          yKey="overall_score"
          type="area"
          color="#06b6d4"
        />
        
        <MapView
          data={{ hotspots: airData?.hotspots || [] }}
          layers={[
            { id: 'air', name: 'Air Quality' },
            { id: 'heat', name: 'Heat Index' },
            { id: 'water', name: 'Flood Risk' }
          ]}
        />
      </div>
    </motion.div>
  )
}

export default Dashboard
