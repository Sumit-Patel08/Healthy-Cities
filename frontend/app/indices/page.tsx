"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ChartCard } from "@/components/chart-card"
import { motion } from "framer-motion"
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts"
import { BarChart3, TrendingUp, Shield, Leaf, Home, MapPin, Brain, AlertTriangle, CheckCircle, Building } from "lucide-react"

const indices = [
  {
    name: "Environmental Health",
    score: 72,
    color: "#10b981",
    icon: Leaf,
    description: "Overall environmental quality",
  },
  {
    name: "Resilience Score",
    score: 68,
    color: "#3b82f6",
    icon: Shield,
    description: "Urban resilience capacity",
  },
  {
    name: "Sustainability Index",
    score: 75,
    color: "#8b5cf6",
    icon: TrendingUp,
    description: "Long-term sustainability",
  },
]

export default function IndicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DashboardSidebar />
      <DashboardHeader />

      <main className="ml-64 pt-16 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-gray-800">Composite Indices</h1>
                <p className="text-gray-600">Comprehensive environmental and resilience metrics</p>
              </div>
            </div>
          </motion.div>

          {/* Index Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {indices.map((index, i) => (
              <motion.div
                key={index.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border border-blue-100 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                    <index.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 shadow-sm">
                    {index.score}/100
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold mb-2 text-gray-800">{index.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{index.description}</p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${index.score}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: index.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Radial Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {indices.map((index, i) => (
              <ChartCard key={index.name} title={index.name} description="Score visualization" delay={0.4 + i * 0.1}>
                <ResponsiveContainer width="100%" height={250}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    data={[{ name: index.name, value: index.score, fill: index.color }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={10} />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-display text-4xl font-bold"
                      fill="#1f2937"
                    >
                      {index.score}
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </ChartCard>
            ))}
          </div>

          {/* AI-Powered City Development Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-gray-800">AI-Powered Development Insights</h2>
                <p className="text-gray-600">Smart recommendations based on environmental data analysis</p>
              </div>
            </div>
          </motion.div>

          {/* Residential Location Recommendations */}
          <ChartCard title="🏡 Best Residential Areas" description="AI analysis of optimal living locations based on environmental factors" delay={0.7}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-700">Recommended Areas</h4>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-gray-800">Bandra-Kurla Complex (BKC)</h5>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Score: 85/100</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Excellent air quality, good water access, modern infrastructure</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Low Heat Island</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Good AQI</span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Flood Resistant</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-gray-800">Powai</h5>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Score: 82/100</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Near Powai Lake, good green cover, lower pollution levels</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Water Access</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Green Cover</span>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Moderate Traffic</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-gray-800">Juhu-Versova</h5>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Score: 79/100</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Coastal breeze, lower temperatures, good connectivity</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Sea Breeze</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Cool Climate</span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Transport Hub</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-red-700">Areas to Avoid</h4>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-gray-800">Dharavi-Mahim</h5>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Score: 35/100</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">High pollution, poor air quality, flood-prone areas</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">High AQI</span>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Flood Risk</span>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Dense Population</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-gray-800">Andheri East Industrial</h5>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Score: 45/100</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Industrial emissions, higher heat island effect</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Industrial</span>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Heat Island</span>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Air Quality</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ChartCard>

          {/* Urban Development Recommendations */}
          <ChartCard title="🏗️ Smart Urban Development Strategy" description="AI-driven recommendations for sustainable city growth" delay={0.8}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-700">Priority Development Zones</h4>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <h5 className="font-medium text-gray-800 mb-1">Navi Mumbai Extension</h5>
                    <p className="text-sm text-gray-600">Low environmental impact, good connectivity potential</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <h5 className="font-medium text-gray-800 mb-1">Thane-Kalyan Corridor</h5>
                    <p className="text-sm text-gray-600">Sustainable growth with green infrastructure</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <h5 className="font-medium text-gray-800 mb-1">Coastal Reclamation (Planned)</h5>
                    <p className="text-sm text-gray-600">Climate-resilient development with flood protection</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-700">Green Infrastructure</h4>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <h5 className="font-medium text-gray-800 mb-1">Urban Forest Corridors</h5>
                    <p className="text-sm text-gray-600">Connect existing parks to reduce heat islands</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <h5 className="font-medium text-gray-800 mb-1">Rooftop Gardens Mandate</h5>
                    <p className="text-sm text-gray-600">30% green cover requirement for new buildings</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <h5 className="font-medium text-gray-800 mb-1">Wetland Restoration</h5>
                    <p className="text-sm text-gray-600">Natural flood management and biodiversity</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-700">Climate Resilience</h4>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                    <h5 className="font-medium text-gray-800 mb-1">Flood-Resistant Design</h5>
                    <p className="text-sm text-gray-600">Elevated structures in flood-prone areas</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                    <h5 className="font-medium text-gray-800 mb-1">Cool Building Materials</h5>
                    <p className="text-sm text-gray-600">Reflective surfaces to reduce urban heat</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                    <h5 className="font-medium text-gray-800 mb-1">Smart Drainage Systems</h5>
                    <p className="text-sm text-gray-600">AI-monitored water management</p>
                  </div>
                </div>
              </div>
            </div>
          </ChartCard>

          {/* Location-Specific Environmental Insights */}
          <ChartCard title="📍 Location-Based Environmental Analysis" description="Detailed insights for different Mumbai regions" delay={0.9}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    South Mumbai (SoBo)
                  </h4>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">78</p>
                        <p className="text-xs text-gray-600">Livability Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">Good</p>
                        <p className="text-xs text-gray-600">Air Quality</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2"><strong>Best for:</strong> Professionals, families seeking premium lifestyle</p>
                    <p className="text-sm text-gray-700"><strong>Considerations:</strong> High cost, limited parking, monsoon flooding in low-lying areas</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Western Suburbs
                  </h4>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">82</p>
                        <p className="text-xs text-gray-600">Livability Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">Moderate</p>
                        <p className="text-xs text-gray-600">Air Quality</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2"><strong>Best for:</strong> Young professionals, IT workers, entertainment industry</p>
                    <p className="text-sm text-gray-700"><strong>Considerations:</strong> Traffic congestion, higher temperatures inland</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    Central Mumbai
                  </h4>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">65</p>
                        <p className="text-xs text-gray-600">Livability Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">Poor</p>
                        <p className="text-xs text-gray-600">Air Quality</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2"><strong>Best for:</strong> Budget-conscious residents, industrial workers</p>
                    <p className="text-sm text-gray-700"><strong>Considerations:</strong> High pollution, dense population, limited green spaces</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    Eastern Suburbs
                  </h4>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">75</p>
                        <p className="text-xs text-gray-600">Livability Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">Good</p>
                        <p className="text-xs text-gray-600">Air Quality</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2"><strong>Best for:</strong> Families, nature lovers, airport connectivity</p>
                    <p className="text-sm text-gray-700"><strong>Considerations:</strong> Distance from city center, developing infrastructure</p>
                  </div>
                </div>
              </div>
            </div>
          </ChartCard>

          {/* Overall Assessment */}
          <ChartCard title="Overall Assessment" description="Mumbai's environmental status" delay={1.0}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-green-100 border-2 border-green-300">
                  <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Good water resource management</li>
                    <li>• Improving air quality trends</li>
                    <li>• Strong monitoring infrastructure</li>
                    <li>• Coastal climate advantages</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-yellow-100 border-2 border-yellow-300">
                  <h4 className="font-semibold text-yellow-700 mb-2">Concerns</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Urban heat island effects</li>
                    <li>• Rapid urban expansion</li>
                    <li>• Seasonal air quality issues</li>
                    <li>• Monsoon flooding risks</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-blue-100 border-2 border-blue-300">
                  <h4 className="font-semibold text-blue-700 mb-2">AI Recommendations</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Prioritize coastal development</li>
                    <li>• Implement green corridors</li>
                    <li>• Smart flood management</li>
                    <li>• Climate-resilient housing</li>
                  </ul>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      </main>
    </div>
  )
}
