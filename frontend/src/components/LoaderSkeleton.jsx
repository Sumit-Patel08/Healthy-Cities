import React from 'react'
import { motion } from 'framer-motion'

const LoaderSkeleton = ({ type = 'card', count = 1, className = '' }) => {
  const skeletonVariants = {
    pulse: {
      opacity: [0.4, 0.8, 0.4],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const CardSkeleton = () => (
    <motion.div
      variants={skeletonVariants}
      animate="pulse"
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
    </motion.div>
  )

  const ChartSkeleton = () => (
    <motion.div
      variants={skeletonVariants}
      animate="pulse"
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div 
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
              style={{ width: `${Math.random() * 60 + 40}%` }}
            ></div>
          </div>
        ))}
      </div>
    </motion.div>
  )

  const MapSkeleton = () => (
    <motion.div
      variants={skeletonVariants}
      animate="pulse"
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="h-96 bg-gray-200 dark:bg-gray-700 relative">
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        </div>
      </div>
    </motion.div>
  )

  const TableSkeleton = () => (
    <motion.div
      variants={skeletonVariants}
      animate="pulse"
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 flex items-center space-x-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        ))}
      </div>
    </motion.div>
  )

  const PageSkeleton = () => (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        variants={skeletonVariants}
        animate="pulse"
        className="flex items-center justify-between"
      >
        <div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
        </div>
        <div className="flex space-x-3">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MapSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  )

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return [...Array(count)].map((_, i) => <CardSkeleton key={i} />)
      case 'chart':
        return [...Array(count)].map((_, i) => <ChartSkeleton key={i} />)
      case 'map':
        return <MapSkeleton />
      case 'table':
        return <TableSkeleton />
      case 'page':
        return <PageSkeleton />
      default:
        return <CardSkeleton />
    }
  }

  return (
    <div className={className}>
      {renderSkeleton()}
    </div>
  )
}

export default LoaderSkeleton
