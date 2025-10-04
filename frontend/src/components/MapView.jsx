import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Settings
} from 'lucide-react'

const MapView = ({ 
  data, 
  layers = [], 
  center = [72.8777, 19.0596], // Mumbai coordinates
  zoom = 10,
  onLayerChange,
  onTimeChange,
  timeEnabled = false,
  className = ''
}) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [activeLayer, setActiveLayer] = useState(layers[0]?.id || null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [opacity, setOpacity] = useState(0.8)

  // Mock map initialization (replace with actual Mapbox GL JS)
  useEffect(() => {
    if (map.current) return // Initialize map only once

    // Simulate map loading
    setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    // Mock map object
    map.current = {
      getZoom: () => zoom,
      setZoom: (z) => console.log('Setting zoom to', z),
      getCenter: () => ({ lng: center[0], lat: center[1] }),
      setCenter: (c) => console.log('Setting center to', c),
      resetNorth: () => console.log('Resetting north'),
      addLayer: (layer) => console.log('Adding layer', layer),
      removeLayer: (layerId) => console.log('Removing layer', layerId),
      setLayoutProperty: (layerId, property, value) => console.log('Setting layout property', layerId, property, value)
    }
  }, [])

  const handleLayerToggle = (layerId) => {
    setActiveLayer(activeLayer === layerId ? null : layerId)
    if (onLayerChange) {
      onLayerChange(layerId)
    }
  }

  const handleZoomIn = () => {
    if (map.current) {
      const currentZoom = map.current.getZoom()
      map.current.setZoom(currentZoom + 1)
    }
  }

  const handleZoomOut = () => {
    if (map.current) {
      const currentZoom = map.current.getZoom()
      map.current.setZoom(currentZoom - 1)
    }
  }

  const handleResetView = () => {
    if (map.current) {
      map.current.setCenter(center)
      map.current.setZoom(zoom)
      map.current.resetNorth()
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTimeChange = (time) => {
    setCurrentTime(time)
    if (onTimeChange) {
      onTimeChange(time)
    }
  }

  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-96 bg-gray-100 dark:bg-gray-700 relative"
      >
        {!mapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-2"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading map...</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900">
            {/* Mock map visualization */}
            <div className="absolute inset-4 bg-blue-200 dark:bg-blue-800 rounded-lg opacity-60"></div>
            <div className="absolute top-8 left-8 w-32 h-24 bg-green-300 dark:bg-green-700 rounded opacity-70"></div>
            <div className="absolute bottom-12 right-12 w-24 h-16 bg-red-300 dark:bg-red-700 rounded opacity-70"></div>
            
            {/* Hotspot markers */}
            {data?.hotspots?.map((hotspot, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform"
                style={{
                  left: `${20 + index * 25}%`,
                  top: `${30 + index * 15}%`
                }}
                title={hotspot.location}
              />
            ))}
          </div>
        )}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomIn}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomOut}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleResetView}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </motion.button>
      </div>

      {/* Layer Controls */}
      {layers.length > 0 && (
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-3">
          <div className="flex items-center space-x-2 mb-3">
            <Layers className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Layers</span>
          </div>
          <div className="space-y-2">
            {layers.map((layer) => (
              <label key={layer.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeLayer === layer.id}
                  onChange={() => handleLayerToggle(layer.id)}
                  className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">{layer.name}</span>
              </label>
            ))}
          </div>
          
          {/* Opacity Control */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Time Controls */}
      {timeEnabled && (
        <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleTimeChange(Math.max(0, currentTime - 1))}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <SkipBack className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="p-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
            
            <button
              onClick={() => handleTimeChange(currentTime + 1)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <SkipForward className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="23"
                value={currentTime}
                onChange={(e) => handleTimeChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>00:00</span>
                <span>{String(currentTime).padStart(2, '0')}:00</span>
                <span>23:00</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Download Button */}
      <div className="absolute bottom-4 right-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </motion.button>
      </div>
    </div>
  )
}

export default MapView
