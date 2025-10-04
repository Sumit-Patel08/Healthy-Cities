import React from 'react'
import { motion } from 'framer-motion'
import { 
  Satellite, 
  Database, 
  Brain, 
  Globe, 
  Users,
  Github,
  ExternalLink,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: Satellite,
      title: 'NASA Satellite Data',
      description: 'Real-time integration with MODIS, VIIRS, Landsat, and SMAP satellite missions for comprehensive Earth observation.',
      color: 'text-blue-500'
    },
    {
      icon: Brain,
      title: 'AI-Powered Analytics',
      description: 'Machine learning algorithms analyze patterns and predict urban resilience trends with high accuracy.',
      color: 'text-purple-500'
    },
    {
      icon: Database,
      title: 'Multi-Source Integration',
      description: 'Combines satellite data with ground sensors, weather stations, and municipal databases for complete coverage.',
      color: 'text-green-500'
    },
    {
      icon: Globe,
      title: 'Real-Time Monitoring',
      description: 'Continuous monitoring and alerting system for immediate response to environmental threats.',
      color: 'text-cyan-500'
    }
  ]

  const dataSources = [
    {
      name: 'NASA MODIS',
      description: 'Aerosol Optical Depth, Land Surface Temperature',
      url: 'https://modis.gsfc.nasa.gov/'
    },
    {
      name: 'NASA VIIRS',
      description: 'Nighttime Lights, Urban Activity Monitoring',
      url: 'https://www.earthdata.nasa.gov/learn/find-data/near-real-time/viirs'
    },
    {
      name: 'NASA SMAP',
      description: 'Soil Moisture Data for Flood Risk Assessment',
      url: 'https://smap.jpl.nasa.gov/'
    },
    {
      name: 'Landsat',
      description: 'NDWI Water Body Analysis, Urban Expansion',
      url: 'https://landsat.gsfc.nasa.gov/'
    },
    {
      name: 'NASA POWER',
      description: 'Meteorological Data, Solar Radiation',
      url: 'https://power.larc.nasa.gov/'
    },
    {
      name: 'CPCB',
      description: 'Ground-based Air Quality Monitoring',
      url: 'https://cpcb.nic.in/'
    }
  ]

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Lead Data Scientist',
      expertise: 'Remote Sensing, Urban Analytics',
      image: '/team/sarah.jpg'
    },
    {
      name: 'Raj Patel',
      role: 'Full Stack Developer',
      expertise: 'React, Node.js, Geospatial APIs',
      image: '/team/raj.jpg'
    },
    {
      name: 'Dr. Maria Rodriguez',
      role: 'Urban Planning Expert',
      expertise: 'Climate Resilience, Policy Analysis',
      image: '/team/maria.jpg'
    },
    {
      name: 'Alex Kim',
      role: 'DevOps Engineer',
      expertise: 'Cloud Infrastructure, Data Pipelines',
      image: '/team/alex.jpg'
    }
  ]

  const timeline = [
    {
      date: 'Q1 2024',
      title: 'Project Inception',
      description: 'Initial concept and NASA data integration planning'
    },
    {
      date: 'Q2 2024',
      title: 'MVP Development',
      description: 'Core dashboard and basic monitoring features'
    },
    {
      date: 'Q3 2024',
      title: 'AI Integration',
      description: 'Machine learning models for predictive analytics'
    },
    {
      date: 'Q4 2024',
      title: 'Public Launch',
      description: 'Full platform launch with real-time monitoring'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-8"
    >
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20 rounded-2xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Satellite className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About CityForge
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Mumbai Pulse is an advanced urban resilience monitoring platform that leverages 
            NASA satellite data and AI to provide real-time insights for sustainable city management.
          </p>
        </motion.div>
      </div>

      {/* Mission Statement */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Our Mission
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Data-Driven Decisions
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Empower city planners and policymakers with accurate, real-time data for informed decision-making.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Community Impact
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Improve quality of life for Mumbai's 20+ million residents through better urban planning.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Innovation
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Push the boundaries of urban analytics using cutting-edge satellite technology and AI.
            </p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700 ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Data Sources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataSources.map((source, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {source.name}
                </h3>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-500 hover:text-cyan-600"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {source.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-cyan-600 dark:text-cyan-400 mb-2">
                {member.role}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {member.expertise}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Development Timeline
        </h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative flex items-start space-x-4"
              >
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center relative z-10">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Stack */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Technical Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Frontend
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• React 18 + Vite</li>
              <li>• TailwindCSS</li>
              <li>• Framer Motion</li>
              <li>• Mapbox GL JS</li>
              <li>• Recharts & D3.js</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Backend
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Python FastAPI</li>
              <li>• PostgreSQL + PostGIS</li>
              <li>• Redis Caching</li>
              <li>• NASA APIs Integration</li>
              <li>• Machine Learning Pipeline</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Infrastructure
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Docker Containers</li>
              <li>• AWS Cloud Services</li>
              <li>• CI/CD Pipeline</li>
              <li>• Real-time Data Streaming</li>
              <li>• Automated Monitoring</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact & Links */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Get Involved
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Github className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Open Source
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Contribute to our open-source project on GitHub
            </p>
            <a
              href="https://github.com/cityforge/mumbai-pulse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-500 hover:text-cyan-600 text-sm font-medium"
            >
              View Repository
            </a>
          </div>
          <div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Contact Us
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Questions, feedback, or collaboration ideas?
            </p>
            <a
              href="mailto:team@cityforge.io"
              className="text-cyan-500 hover:text-cyan-600 text-sm font-medium"
            >
              team@cityforge.io
            </a>
          </div>
          <div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Location
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Based in Mumbai, serving global urban challenges
            </p>
            <span className="text-cyan-500 text-sm font-medium">
              Mumbai, India
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          © 2024 CityForge. Built with ❤️ for sustainable urban futures.
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
          Powered by NASA Earth Science Data and AI
        </p>
      </div>
    </motion.div>
  )
}

export default About
