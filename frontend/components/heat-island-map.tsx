'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import React Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

interface HeatIslandMapProps {
  weatherData?: any
  heatStressData?: any
}

export function HeatIslandMap({ weatherData, heatStressData }: HeatIslandMapProps) {
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

  // Heat island data points with real Mumbai coordinates
  const heatPoints = [
    {
      position: [19.0596, 72.8295] as [number, number], // BKC/Worli [lat, lng]
      temp: (weatherData?.data?.weather?.temperature || 32) + 8,
      level: 'EXTREME HEAT',
      location: 'BKC/Worli',
      color: '#dc2626',
      emoji: '🔥'
    },
    {
      position: [19.0176, 72.8562] as [number, number], // Dadar [lat, lng]
      temp: (weatherData?.data?.weather?.temperature || 32) + 5,
      level: 'HIGH HEAT',
      location: 'Dadar',
      color: '#ea580c',
      emoji: '🌡️'
    },
    {
      position: [19.0544, 72.8181] as [number, number], // Bandra [lat, lng]
      temp: (weatherData?.data?.weather?.temperature || 32) + 2,
      level: 'MODERATE',
      location: 'Bandra',
      color: '#ca8a04',
      emoji: 'T'
    },
    {
      position: [18.9220, 72.8347] as [number, number], // Marine Drive [lat, lng]
      temp: weatherData?.data?.weather?.temperature || 32,
      level: 'COOL',
      location: 'Marine Drive',
      color: '#16a34a',
      emoji: 'C'
    },
    {
      position: [19.2183, 72.9781] as [number, number], // SGNP [lat, lng]
      temp: (weatherData?.data?.weather?.temperature || 32) - 3,
      level: 'COLD',
      location: 'SGNP Forest',
      color: '#2563eb',
      emoji: '❄️'
    }
  ]

  // Create custom marker icons
  const createHeatIcon = (point: any) => {
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
            animation: pulse 2s infinite;
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
      className: 'heat-marker',
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
          <p className="text-gray-600">Loading free OpenStreetMap...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden relative">
      <MapContainer
        center={[19.0760, 72.8777]} // Mumbai coordinates [lat, lng]
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        {/* Free OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Heat island markers */}
        {heatPoints.map((point, index) => (
          <Marker
            key={index}
            position={point.position}
            icon={createHeatIcon(point)}
          >
            <Popup>
              <div style={{ padding: '8px', textAlign: 'center', minWidth: '160px' }}>
                <div style={{ color: point.color, fontWeight: 'bold', fontSize: '16px', marginBottom: '6px' }}>
                  {point.level}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '6px' }}>
                  {point.temp}°C
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  {point.location}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Heat Index Control */}
      <div className="absolute top-4 right-4 z-[1000]">
        <div style={{
          background: 'rgba(0,0,0,0.9)',
          borderRadius: '8px',
          padding: '12px',
          color: 'white',
          border: '2px solid #ef4444',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          fontFamily: 'Arial, sans-serif',
          minWidth: '120px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f87171' }}>
              {weatherData?.data?.environmental?.heat_index?.toFixed(1) || heatStressData?.data?.heat_index?.toFixed(1) || '38.5'}°C
            </div>
            <div style={{ fontSize: '12px', color: '#d1d5db', marginTop: '2px' }}>HEAT INDEX</div>
            <div style={{ fontSize: '12px', color: '#f87171' }}>FEELS LIKE</div>
          </div>
        </div>
      </div>

      {/* Thermal Scale Control */}
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
            THERMAL SCALE
          </div>
          <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <div style={{ width: '12px', height: '12px', background: '#dc2626', borderRadius: '50%' }}></div>
              <span>Extreme (&gt;40°C)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <div style={{ width: '12px', height: '12px', background: '#ea580c', borderRadius: '50%' }}></div>
              <span>High (35-40°C)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <div style={{ width: '12px', height: '12px', background: '#ca8a04', borderRadius: '50%' }}></div>
              <span>Moderate (30-35°C)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <div style={{ width: '12px', height: '12px', background: '#16a34a', borderRadius: '50%' }}></div>
              <span>Cool (25-30°C)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: '#2563eb', borderRadius: '50%' }}></div>
              <span>Cold (&lt;25°C)</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: rotate(-45deg) scale(1); }
          50% { opacity: 0.8; transform: rotate(-45deg) scale(1.05); }
        }
        
        .heat-marker {
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
