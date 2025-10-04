import React from 'react'
import { motion } from 'framer-motion'
import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react'

const AlertBanner = ({ alert, onClose }) => {
  const getAlertConfig = () => {
    switch (alert.type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-800 dark:text-green-200',
          iconColor: 'text-green-600 dark:text-green-400'
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          textColor: 'text-yellow-800 dark:text-yellow-200',
          iconColor: 'text-yellow-600 dark:text-yellow-400'
        }
      case 'error':
      case 'danger':
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-200',
          iconColor: 'text-red-600 dark:text-red-400'
        }
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-800 dark:text-blue-200',
          iconColor: 'text-blue-600 dark:text-blue-400'
        }
    }
  }

  const config = getAlertConfig()
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.4 
      }}
      className={`mx-6 mb-4 p-4 rounded-xl border ${config.bgColor} ${config.borderColor} shadow-sm`}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
        >
          <Icon className={`w-5 h-5 mt-0.5 ${config.iconColor}`} />
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className={`text-sm font-semibold ${config.textColor}`}>
                {alert.title || 'Alert'}
              </h4>
              <p className={`text-sm mt-1 ${config.textColor} opacity-90`}>
                {alert.message}
              </p>
              {alert.action && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={alert.action.onClick}
                  className={`mt-3 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                    alert.type === 'success' ? 'border-green-300 hover:bg-green-100 dark:border-green-700 dark:hover:bg-green-800' :
                    alert.type === 'warning' ? 'border-yellow-300 hover:bg-yellow-100 dark:border-yellow-700 dark:hover:bg-yellow-800' :
                    alert.type === 'error' || alert.type === 'danger' ? 'border-red-300 hover:bg-red-100 dark:border-red-700 dark:hover:bg-red-800' :
                    'border-blue-300 hover:bg-blue-100 dark:border-blue-700 dark:hover:bg-blue-800'
                  } ${config.textColor}`}
                >
                  {alert.action.label}
                </motion.button>
              )}
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className={`ml-4 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${config.textColor} opacity-70 hover:opacity-100`}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Progress bar for auto-dismiss */}
      {alert.autoDismiss && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: alert.autoDismiss / 1000, ease: 'linear' }}
          className={`mt-3 h-1 rounded-full ${
            alert.type === 'success' ? 'bg-green-300' :
            alert.type === 'warning' ? 'bg-yellow-300' :
            alert.type === 'error' || alert.type === 'danger' ? 'bg-red-300' :
            'bg-blue-300'
          }`}
        />
      )}
    </motion.div>
  )
}

export default AlertBanner
