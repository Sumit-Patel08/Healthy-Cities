import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Wind, 
  Thermometer, 
  Droplets, 
  Building2, 
  BarChart3,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation()

  const menuItems = [
    { 
      path: '/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
      color: 'text-indigo-500'
    },
    { 
      path: '/air', 
      icon: Wind, 
      label: 'Air Quality',
      color: 'text-red-500'
    },
    { 
      path: '/heat', 
      icon: Thermometer, 
      label: 'Heat Index',
      color: 'text-orange-500'
    },
    { 
      path: '/water', 
      icon: Droplets, 
      label: 'Water & Floods',
      color: 'text-blue-500'
    },
    { 
      path: '/urban', 
      icon: Building2, 
      label: 'Urban Activity',
      color: 'text-purple-500'
    },
    { 
      path: '/indices', 
      icon: BarChart3, 
      label: 'Resilience Index',
      color: 'text-cyan-500'
    },
    { 
      path: '/about', 
      icon: Info, 
      label: 'About',
      color: 'text-gray-500'
    }
  ]

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CF</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900 dark:text-white">CityForge</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Mumbai Pulse</p>
            </div>
          </motion.div>
        )}
        
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? item.color : 'group-hover:' + item.color}`} />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute right-2 w-2 h-2 bg-indigo-500 rounded-full"
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Status Indicator */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 dark:text-green-400 font-medium">
                System Online
              </span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-500 mt-1">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Sidebar
