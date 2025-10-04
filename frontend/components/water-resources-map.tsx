'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import React Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

interface WaterResourcesMapProps {
  weatherData?: any
}

export function WaterResourcesMap({ weatherData }: WaterResourcesMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    
    // Load Leaflet and CSS
    const loadLeaflet = async () => {
      const leaflet = await import('leaflet')
      
      // Load Leaflet CSS
      if (typeof document !== 'undefined') {
        const existingCSS = document.querySelector('link[href*="leaflet.css"]')
        if (!existingCSS) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(link)
        }
      }
      
      // Fix default marker icons
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })
      
      setL(leaflet)
    }
    
    loadLeaflet()
  }, [])

  // Water bodies data points with real Mumbai coordinates
  const waterPoints = [
    {
      position: [19.1197, 72.9081] as [number, number], // Powai Lake [lat, lng]
      name: 'Powai Lake',
      level: 85,
      status: 'Good',
      color: '#1e40af',
      emoji: '💧',
      capacity: '2.5 billion liters'
    },
    {
      position: [19.2094, 72.8947] as [number, number], // Vihar Lake [lat, lng]
      name: 'Vihar Lake',
      level: 72,
      status: 'Moderate',
      color: '#0891b2',
      emoji: '🏞️',
      capacity: '27 billion liters'
    },
    {
      position: [19.1886, 72.9142] as [number, number], // Tulsi Lake [lat, lng]
      name: 'Tulsi Lake',
      level: 68,
      status: 'Moderate',
      color: '#0e7490',
      emoji: '🌊',
      capacity: '8 billion liters'
    },
    {
      position: [19.3176, 73.1458] as [number, number], // Tansa Lake [lat, lng]
      name: 'Tansa Lake',
      level: 91,
      status: 'Excellent',
      color: '#1e3a8a',
      emoji: '🏔️',
      capacity: '18 billion liters'
    },
    {
      position: [19.0760, 72.8777] as [number, number], // Central Mumbai - Soil Moisture [lat, lng]
      name: 'Soil Moisture Monitor',
      level: weatherData?.data?.environmental?.soil_moisture ? Math.round(weatherData.data.environmental.soil_moisture * 100) : 45,
      status: 'Monitoring',
      color: '#16a34a',
      emoji: '🌱',
      capacity: 'Real-time data'
    }
  ]

  // Create custom water marker icons
  const createWaterIcon = (point: any) => {
    if (!L) return null
    
    return L.divIcon({
      html: `
        <div style="
          position: relative;
          width: 40px;
          height: 50px;
          cursor: pointer;
        ">
          <div style="
            position: absolute;
            width: 40px;
            height: 50px;
            background: ${point.color};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: ${point.level > 85 ? 'pulse 2s infinite' : 'none'};
          "></div>
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -60%);
            font-size: 16px;
            z-index: 10;
          ">${point.emoji}</div>
        </div>
      `,
      className: 'water-marker',
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -50],
    })
  }

  if (!isClient) {
    return (
      <div className="w-full h-96 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading free water resources map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden relative">
      <MapContainer
        center={[19.0760, 72.8777]} // Mumbai coordinates [lat, lng]
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        {/* Free OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Water bodies markers */}
        {waterPoints.map((point, index) => (
          <Marker
            key={index}
            position={point.position}
            icon={createWaterIcon(point)}
          >
            <Popup>
              <div style={{ padding: '12px', textAlign: 'center', minWidth: '180px' }}>
                <div style={{ color: point.color, fontWeight: 'bold', fontSize: '16px', marginBottom: '6px' }}>
                  {point.name}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '6px' }}>
                  {point.level}%
                </div>
                <div style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                  Status: {point.status}
                </div>
                <div style={{ color: '#888', fontSize: '12px' }}>
                  {point.capacity}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Live Hydro Data Control */}
      <div className="absolute top-4 left-4 z-[1000]">
        <div style={{
          background: 'rgba(0,0,0,0.9)',
          borderRadius: '8px',
          padding: '12px',
          color: 'white',
          border: '2px solid #06b6d4',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          fontFamily: 'Arial, sans-serif',
          minWidth: '160px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#22d3ee' }}>
            🔴 LIVE HYDRO DATA
          </div>
          <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
              <span>PRECIPITATION:</span>
              <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>
                {weatherData?.data?.weather?.precipitation?.toFixed(1) || '0.0'} mm
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
              <span>HUMIDITY:</span>
              <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>
                {weatherData?.data?.weather?.humidity?.toFixed(0) || '78'}%
              </span>
            </div>
            {weatherData?.data?.environmental?.soil_moisture && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
                <span>SOIL MOISTURE:</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                  {(weatherData.data.environmental.soil_moisture * 100).toFixed(1)}%
                </span>
              </div>
            )}
            {weatherData?.data?.environmental?.evapotranspiration && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                <span>EVAPORATION:</span>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                  {weatherData.data.environmental.evapotranspiration.toFixed(2)} mm
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reservoir Status Legend */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <div style={{
          background: 'rgba(0,0,0,0.9)',
          borderRadius: '8px',
          padding: '12px',
          color: 'white',
          border: '2px solid #3b82f6',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          fontFamily: 'Arial, sans-serif',
          maxWidth: '200px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#60a5fa' }}>
            RESERVOIR STATUS
          </div>
          <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <div style={{ width: '12px', height: '8px', background: 'linear-gradient(to right, #bfdbfe, #2563eb)' }}></div>
              <span>90%+ EXCELLENT</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <div style={{ width: '12px', height: '8px', background: 'linear-gradient(to right, #60a5fa, #1d4ed8)' }}></div>
              <span>80-90% GOOD</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <div style={{ width: '12px', height: '8px', background: 'linear-gradient(to right, #22d3ee, #0369a1)' }}></div>
              <span>70-80% MODERATE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '8px', background: 'linear-gradient(to right, #67e8f9, #0891b2)' }}></div>
              <span>&lt;70% LOW</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: rotate(-45deg) scale(1); }
          50% { opacity: 0.8; transform: rotate(-45deg) scale(1.05); }
        }
        
        .water-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important;
        }
        
        .leaflet-popup-tip {
          background: white !important;
        }
      `}</style>
    </div>
  )
}
