import React from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Download,
  RefreshCw,
  Target,
  Award,
  Globe
} from 'lucide-react'
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'

import StatCard from '../components/StatCard'
import ChartView from '../components/ChartView'
import DataTable from '../components/DataTable'
import LoaderSkeleton from '../components/LoaderSkeleton'
import useFetch from '../hooks/useFetch'
import { getIndicesData } from '../services/api'

const Indices = ({ onAlert }) => {
  const { data, loading, error, refresh } = useFetch(getIndicesData, {}, { 
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
            Failed to load resilience data
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

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreStatus = (score) => {
    if (score >= 80) return 'good'
    if (score >= 60) return 'warning'
    return 'danger'
  }

  const stats = [
    {
      title: 'Overall Resilience',
      value: data.overall_resilience_score,
      unit: '/100',
      status: getScoreStatus(data.overall_resilience_score),
      trend: data.trend === 'improving' ? 'up' : 'down',
      trendValue: data.change_from_last_month,
      icon: Award,
      color: 'cyan',
      description: data.resilience_grade
    },
    {
      title: 'Environmental Health',
      value: data.composite_indicators?.environmental_health || 0,
      unit: '/100',
      status: getScoreStatus(data.composite_indicators?.environmental_health || 0),
      trend: 'down',
      trendValue: '2.1',
      icon: Target,
      color: 'green',
      description: 'Air & Water quality'
    },
    {
      title: 'Infrastructure',
      value: data.composite_indicators?.infrastructure_resilience || 0,
      unit: '/100',
      status: getScoreStatus(data.composite_indicators?.infrastructure_resilience || 0),
      trend: 'up',
      trendValue: '4.2',
      icon: BarChart3,
      color: 'blue',
      description: 'Urban systems'
    },
    {
      title: 'Data Confidence',
      value: data.data_quality?.overall_confidence ? (data.data_quality.overall_confidence * 100).toFixed(0) : 0,
      unit: '%',
      status: 'good',
      trend: 'up',
      trendValue: '2%',
      icon: Globe,
      color: 'purple',
      description: 'Data reliability'
    }
  ]

  // Prepare radar chart data
  const radarData = Object.entries(data.domain_scores || {}).map(([domain, scoreData]) => ({
    domain: domain.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    score: scoreData.score,
    fullMark: 100
  }))

  const recommendationsColumns = [
    { key: 'domain', label: 'Domain', type: 'text' },
    { 
      key: 'priority', 
      label: 'Priority', 
      type: 'status',
      render: (value) => {
        const colors = {
          'High': 'bg-red-100 text-red-800',
          'Medium': 'bg-yellow-100 text-yellow-800',
          'Low': 'bg-green-100 text-green-800'
        }
        return <span className={`px-2 py-1 rounded-full text-xs ${colors[value] || 'bg-gray-100 text-gray-800'}`}>{value}</span>
      }
    },
    { key: 'action', label: 'Recommended Action', type: 'text' },
    { key: 'timeline', label: 'Timeline', type: 'text' },
    { key: 'expected_impact', label: 'Expected Impact', type: 'text' }
  ]

  const benchmarkingColumns = [
    { key: 'city', label: 'City', type: 'text' },
    { key: 'score', label: 'Score', type: 'number', decimals: 1 },
    { 
      key: 'comparison', 
      label: 'vs Mumbai', 
      type: 'text',
      render: (value) => {
        const isPositive = value.startsWith('+')
        return (
          <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {value}
          </span>
        )
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
            Urban Resilience Index
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive resilience assessment across air, heat, water, and urban domains
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
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Resilience Score */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Mumbai Urban Resilience Score
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {new Date(data.last_updated).toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resilience Gauge */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-48 h-48 mb-6">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - data.overall_resilience_score / 100)}`}
                  className={`${getScoreColor(data.overall_resilience_score).replace('text-', 'text-')}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(data.overall_resilience_score)}`}>
                    {data.overall_resilience_score}
                  </div>
                  <div className="text-lg text-gray-500 dark:text-gray-400">
                    {data.resilience_grade}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2 mb-4">
              {data.trend === 'improving' ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
              <span className={`font-medium ${data.trend === 'improving' ? 'text-green-600' : 'text-red-600'}`}>
                {data.change_from_last_month} from last month
              </span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {data.trend === 'improving' ? 'Resilience is improving' : 'Resilience needs attention'}
            </p>
          </div>

          {/* Domain Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Domain Scores
            </h3>
            {Object.entries(data.domain_scores || {}).map(([domain, scoreData]) => (
              <div key={domain} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {domain.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {scoreData.grade}
                    </span>
                    <span className={`text-sm font-bold ${getScoreColor(scoreData.score)}`}>
                      {scoreData.score.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${scoreData.score}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-2 rounded-full ${
                      scoreData.score >= 80 ? 'bg-green-500' :
                      scoreData.score >= 60 ? 'bg-blue-500' :
                      scoreData.score >= 40 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  {scoreData.trend === 'improving' ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Weight: {(scoreData.weight * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Radar Chart and Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Multi-Domain Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="domain" className="text-xs text-gray-600 dark:text-gray-400" />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                className="text-xs text-gray-600 dark:text-gray-400"
              />
              <Radar
                name="Resilience Score"
                dataKey="score"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Chart */}
        <ChartView
          data={data.time_series || []}
          title="Resilience Score Trend"
          xKey="timestamp"
          yKey="overall_score"
          type="line"
          color="#06b6d4"
          height={300}
        />
      </div>

      {/* Risk Assessment */}
      {data.risk_assessment && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Risk Assessment
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                Immediate Risks
              </h4>
              <div className="space-y-3">
                {data.risk_assessment.immediate_risks?.map((risk, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-red-800 dark:text-red-200">
                          {risk.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          risk.severity === 'High' ? 'bg-red-200 text-red-800' :
                          risk.severity === 'Moderate' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {risk.severity}
                        </span>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-1">
                        {risk.impact}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Probability: {(risk.probability * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                Emerging Risks
              </h4>
              <div className="space-y-3">
                {data.risk_assessment.emerging_risks?.map((risk, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-yellow-800 dark:text-yellow-200">
                          {risk.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          risk.severity === 'High' ? 'bg-red-200 text-red-800' :
                          risk.severity === 'Moderate' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {risk.severity}
                        </span>
                      </div>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-1">
                        {risk.impact}
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        Probability: {(risk.probability * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {data.recommendations && (
        <DataTable
          data={data.recommendations}
          columns={recommendationsColumns}
          title="Improvement Recommendations"
          searchable={true}
          sortable={true}
        />
      )}

      {/* Benchmarking */}
      {data.benchmarking && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataTable
            data={data.benchmarking.similar_cities}
            columns={benchmarkingColumns}
            title="City Comparison"
            searchable={false}
            sortable={true}
            pagination={false}
          />
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Global Benchmarks
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Global Average</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {data.benchmarking.global_average}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Regional Average</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {data.benchmarking.regional_average}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Mumbai Score</span>
                <span className={`text-lg font-bold ${getScoreColor(data.overall_resilience_score)}`}>
                  {data.overall_resilience_score}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Quality */}
      {data.data_quality && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Data Quality Assessment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(data.data_quality).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-2xl font-bold text-cyan-500 mb-1">
                  {(value * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {key.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default Indices
