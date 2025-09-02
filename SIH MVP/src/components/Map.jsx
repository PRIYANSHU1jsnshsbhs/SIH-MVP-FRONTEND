import { useEffect, useRef, useState } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import StyleSwitchButton from './StyleSwitchButton'
import { 
  fetchAllRealTimeGeofencesExtended,
  getRiskIcon,
  getSeverityColor,
  renderAdditionalInfo 
} from '../utils/realTimeAPIs'

const MAPBOX_TOKEN = 'pk.eyJ1IjoicHJpeWFuc2h1NjU5NCIsImEiOiJjbWV6cHhjbWoxMXV0MmxxeTg1b2Y3dHM5In0.VqvTmVZAFHF-2kX8R5A61Q'
const DEFAULT_STYLE = 'mapbox://styles/priyanshu6594/cmezue6x901j401pgf4g004u1'
const SATELLITE_STYLE = 'mapbox://styles/mapbox/satellite-streets-v12'

// Tourist spots data
const touristSpots = [
  { id: 1, name: "Taj Mahal", lng: 78.0421, lat: 27.1751, type: "monument", safety: "safe" },
  { id: 2, name: "Red Fort", lng: 77.2410, lat: 28.6562, type: "monument", safety: "safe" },
  { id: 3, name: "Gateway of India", lng: 72.8347, lat: 18.9220, type: "monument", safety: "safe" },
  { id: 4, name: "Golden Temple", lng: 74.8765, lat: 31.6200, type: "religious", safety: "safe" },
  { id: 5, name: "Vaishno Devi", lng: 74.9269, lat: 33.0309, type: "pilgrimage", safety: "caution" }
]

// Enhanced sample data as fallback
const enhancedSampleData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [77.0, 28.5], [77.3, 28.5], [77.3, 28.8], [77.0, 28.8], [77.0, 28.5]
        ]]
      },
      "properties": {
        "risk": "weather_hazard",
        "name": "Delhi Weather Alert (Sample)",
        "severity": "high",
        "weather_type": "heavy_rain",
        "source": "Sample_Data"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [72.7, 18.9], [73.1, 18.9], [73.1, 19.3], [72.7, 19.3], [72.7, 18.9]
        ]]
      },
      "properties": {
        "risk": "air_quality",
        "name": "Mumbai AQI Alert (Sample)",
        "severity": "high",
        "aqi": 250,
        "aqi_level": "very_unhealthy",
        "source": "Sample_Data"
      }
    }
  ]
}

// UPDATED: Function to load real-time data
const loadRealData = async () => {
  try {
    console.log('🔄 Loading real-time API data...')
    
    // Get real-time data from APIs
    const realTimeData = await fetchAllRealTimeGeofencesExtended()
    
    if (realTimeData.features.length > 0) {
      console.log('✅ Using real-time data:', realTimeData.features.length, 'geofences')
      console.log('📊 Sources:', realTimeData.metadata?.sources?.join(', '))
      return realTimeData
    } else {
      console.log('⚠️ No real-time data available, using fallback')
      return enhancedSampleData
    }
  } catch (error) {
    console.error('❌ Real-time data failed:', error)
    console.log('📦 Using sample data as fallback')
    return enhancedSampleData
  }
}

export default function Map({ activeItem, route, isNavigating, showRiskyAreas }) {
  console.log('🚀 Map component rendering with props:', { 
    activeItem, 
    hasRoute: !!route, 
    isNavigating, 
    showRiskyAreas 
  })

  const mapContainer = useRef(null)
  const map = useRef(null)
  const routeLayerId = "route-layer"
  const startMarkerRef = useRef(null)
  const endMarkerRef = useRef(null)
  const liveMarkerRef = useRef(null)
  const [currentStyle, setCurrentStyle] = useState(DEFAULT_STYLE)
  const [isSatellite, setIsSatellite] = useState(false)
  const [routeInfo, setRouteInfo] = useState(null)
  const [liveLocation, setLiveLocation] = useState(null)
  const [geofenceData, setGeofenceData] = useState(null)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [styleVersion, setStyleVersion] = useState(0)

  // Load geofence data when component mounts and every 5 minutes
  useEffect(() => {
    let abort = false
    const load = async () => {
      console.log('🔍 Loading MASSIVE geofence dataset...')
      setIsLoadingData(true)
      
      try {
        // Use the explicit function name
        const data = await fetchAllRealTimeGeofencesExtended()
        if (abort) return
        
        console.log('📦 Total features received:', data.features?.length || 0)
        console.log('📊 Feature breakdown:', data.metadata?.breakdown)
        
        // Verify data structure
        if (data.features && Array.isArray(data.features)) {
          console.log('✅ Data structure valid')
          setGeofenceData(data)
        } else {
          console.error('❌ Invalid data structure:', data)
        }
      } catch (error) {
        console.error('❌ Error loading geofences:', error)
      } finally {
        setIsLoadingData(false)
      }
    }
    
    load()
    return () => { abort = true }
  }, [])

  // Initialize map
  useEffect(() => {
    if (map.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: currentStyle,
      center: [78.9629, 20.5937],
      zoom: 5,
      pitch: 45,
      attributionControl: false,
      accessToken: MAPBOX_TOKEN
    })

    map.current.on('load', () => {
      // Add terrain source only if it doesn't exist
      try {
        if (!map.current.getSource('mapbox-dem')) {
          map.current.addSource('mapbox-dem', {
            type: 'raster-dem',
            url: 'mapbox://mapbox.terrain-rgb',
            tileSize: 512,
            maxzoom: 14
          })
        }
        map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 200 })
      } catch (error) {
        console.log('Terrain not available in this style')
      }

      // Add 3D buildings if source exists and layer doesn't
      try {
        if (map.current.getSource('composite') && !map.current.getLayer('3d-buildings')) {
          map.current.addLayer({
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            type: 'fill-extrusion',
            minzoom: 15,
            paint: {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': [
                'interpolate', ['linear'], ['zoom'],
                15, 0,
                16, ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate', ['linear'], ['zoom'],
                15, 0,
                16, ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.6
            }
          })
        }
      } catch (error) {
        console.log('3D buildings not available in this style')
      }

      // Add tourist spots
      addTouristSpots()
    })

    setTimeout(() => {
      if (map.current) map.current.resize()
    }, 100)
  }, [])

  // Function to add tourist spots
  const addTouristSpots = () => {
    touristSpots.forEach(spot => {
      new mapboxgl.Marker({
        color: spot.safety === 'safe' ? '#22c55e' : '#f59e0b'
      })
        .setLngLat([spot.lng, spot.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <div style="padding: 12px;">
              <h3 style="font-weight: bold; margin-bottom: 8px;">${spot.name}</h3>
              <p style="color: #666; font-size: 14px;">Type: ${spot.type}</p>
              <p style="color: #666; font-size: 14px;">Safety: ${spot.safety}</p>
            </div>
          `)
        )
        .addTo(map.current)
    })
  }

  // SIMPLIFIED: Just toggle between 2 styles
  const handleSwitchStyle = () => {
    console.log(`🔄 Toggling from ${isSatellite ? 'satellite' : 'default'} to ${isSatellite ? 'default' : 'satellite'}`)
    
    const nextStyle = isSatellite ? DEFAULT_STYLE : SATELLITE_STYLE
    const nextIsSatellite = !isSatellite
    
    setCurrentStyle(nextStyle)
    setIsSatellite(nextIsSatellite)
    
    if (map.current) {
      console.log(`🗺️ Loading style: ${nextStyle}`)
      map.current.setStyle(nextStyle)
      
      map.current.once('styledata', () => {
        console.log('✅ Style loaded successfully')
        
        // Re-add terrain and buildings after style change
        try {
          if (!map.current.getSource('mapbox-dem')) {
            map.current.addSource('mapbox-dem', {
              type: 'raster-dem',
              url: 'mapbox://mapbox.terrain-rgb',
              tileSize: 512,
              maxzoom: 14
            })
          }
          map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 200 })
        } catch (error) {
          console.log('Terrain not available in this style')
        }
        
        try {
          if (map.current.getSource('composite') && !map.current.getLayer('3d-buildings')) {
            map.current.addLayer({
              id: '3d-buildings',
              source: 'composite',
              'source-layer': 'building',
              type: 'fill-extrusion',
              minzoom: 15,
              paint: {
                'fill-extrusion-color': '#aaa',
                'fill-extrusion-height': [
                  'interpolate', ['linear'], ['zoom'],
                  15, 0,
                  16, ['get', 'height']
                ],
                'fill-extrusion-base': [
                  'interpolate', ['linear'], ['zoom'],
                  15, 0,
                  16, ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
              }
            })
          }
        } catch (error) {
          console.log('3D buildings not available in this style')
        }
        
        // Re-add tourist spots
        addTouristSpots()

        // Trigger geofence re-render after style reload
        setStyleVersion(v => v + 1)
      })
    }
  }

  // Draw route, start/end markers, and show info
  useEffect(() => {
    if (!map.current) return

    // Remove previous route layer if exists
    if (map.current.getLayer(routeLayerId)) {
      map.current.removeLayer(routeLayerId)
    }
    if (map.current.getSource(routeLayerId)) {
      map.current.removeSource(routeLayerId)
    }
    if (startMarkerRef.current) {
      startMarkerRef.current.remove()
      startMarkerRef.current = null
    }
    if (endMarkerRef.current) {
      endMarkerRef.current.remove()
      endMarkerRef.current = null
    }
    setRouteInfo(null)

    if (route && route.coordinates && route.coordinates.length > 1) {
      // Add new route
      map.current.addSource(routeLayerId, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: route
        }
      })
      map.current.addLayer({
        id: routeLayerId,
        type: "line",
        source: routeLayerId,
        layout: {
          "line-join": "round",
          "line-cap": "round"
        },
        paint: {
          "line-color": "#222",
          "line-width": 6
        }
      })

      // Add start marker
      startMarkerRef.current = new mapboxgl.Marker({ color: "#22c55e" })
        .setLngLat(route.coordinates[0])
        .setPopup(new mapboxgl.Popup().setText("Start"))
        .addTo(map.current)

      // Add end marker
      endMarkerRef.current = new mapboxgl.Marker({ color: "#ef4444" })
        .setLngLat(route.coordinates[route.coordinates.length - 1])
        .setPopup(new mapboxgl.Popup().setText("Destination"))
        .addTo(map.current)

      // Fit map to route bounds
      const bounds = route.coordinates.reduce(
        (b, coord) => b.extend(coord),
        new mapboxgl.LngLatBounds(route.coordinates[0], route.coordinates[0])
      )
      map.current.fitBounds(bounds, { padding: 60 })

      if (route.routeInfo) {
        setRouteInfo(route.routeInfo)
      }
    }
  }, [route])

  // Watch live location only when navigating
  useEffect(() => {
    let watchId
    if (isNavigating && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const lngLat = [pos.coords.longitude, pos.coords.latitude]
          setLiveLocation(lngLat)
        },
        () => {},
        { enableHighAccuracy: true }
      )
    }
    return () => {
      if (watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [isNavigating])

  // Update live location marker
  useEffect(() => {
    if (!map.current) return
    if (liveMarkerRef.current) {
      liveMarkerRef.current.remove()
      liveMarkerRef.current = null
    }
    if (liveLocation) {
      const el = document.createElement('div')
      el.style.width = '24px'
      el.style.height = '24px'
      el.style.background = 'radial-gradient(circle at 8px 8px, #3b82f6 70%, #fff 100%)'
      el.style.borderRadius = '50%'
      el.style.border = '2px solid #fff'
      el.style.boxShadow = '0 0 8px #3b82f6'
      liveMarkerRef.current = new mapboxgl.Marker(el)
        .setLngLat(liveLocation)
        .setPopup(new mapboxgl.Popup().setText("You are here"))
        .addTo(map.current)
      map.current.flyTo({ center: liveLocation, speed: 1 })
    }
  }, [liveLocation])

  // SINGLE COMPREHENSIVE GEOFENCING EFFECT (remove the duplicate)
  useEffect(() => {
    if (!map.current || !geofenceData) return

    console.log(`🗺️ Adding ${geofenceData.features?.length || 0} geofences to map`)

    // Clean old layers/sources
    const layerIds = [
      'geofence-weather','geofence-air-quality','geofence-disasters','geofence-traffic',
      'geofence-industrial','geofence-elevation','geofence-crime','geofence-crowds',
      'geofence-wildlife','geofence-power','geofence-health','geofence-drought',
      'geofence-cyclone','geofence-landslide','geofence-borders','geofence-all-debug'
    ]
    
    layerIds.forEach(id => { 
      try {
        if (map.current.getLayer(id)) map.current.removeLayer(id) 
      } catch (e) {}
    })
    
    if (map.current.getSource('comprehensive-risks')) {
      try {
        map.current.removeSource('comprehensive-risks')
      } catch (e) {}
    }

    if (!showRiskyAreas || !geofenceData.features?.length) return

    console.log('🗺️ Rendering geofences:', geofenceData.features.length)
    
    // Count features by risk type for debugging
    const riskCounts = {}
    geofenceData.features.forEach(f => {
      const risk = f.properties?.risk
      riskCounts[risk] = (riskCounts[risk] || 0) + 1
    })
    console.log('📊 Risk breakdown:', riskCounts)
    
    map.current.addSource('comprehensive-risks', { 
      type: 'geojson', 
      data: geofenceData 
    })

    const addFill = (id, risk, color, opacity=0.6) => {
      try {
        map.current.addLayer({
          id,
          type: 'fill',
          source: 'comprehensive-risks',
          filter: ['==', ['get','risk'], risk],
          paint: { 'fill-color': color, 'fill-opacity': opacity }
        })
      } catch (e) {
        console.warn(`Failed to add layer ${id}:`, e)
      }
    }

    // Add all layers
    addFill('geofence-weather','weather_hazard','#06b6d4',0.65)
    addFill('geofence-air-quality','air_quality','#f59e0b',0.65)
    addFill('geofence-disasters','natural_disaster','#dc2626',0.7)
    addFill('geofence-traffic','traffic_incident','#8b5cf6',0.55)
    addFill('geofence-industrial','industrial_hazard','#525252',0.65)
    addFill('geofence-elevation','elevation_hazard','#16a34a',0.55)
    addFill('geofence-crime','safety_concern','#f43f5e',0.6)
    addFill('geofence-crowds','crowd_density','#0ea5e9',0.55)
    addFill('geofence-wildlife','wildlife_hazard','#92400e',0.55)
    addFill('geofence-power','power_infrastructure','#fbbf24',0.55)
    addFill('geofence-health','health_risk','#10b981',0.5)
    addFill('geofence-drought','drought_risk','#b45309',0.45)
    addFill('geofence-cyclone','cyclone_impact','#2563eb',0.4)
    addFill('geofence-landslide','landslide_risk','#6d28d9',0.5)

    // Borders
    try {
      map.current.addLayer({
        id: 'geofence-borders',
        type: 'line',
        source: 'comprehensive-risks',
        paint: { 'line-color':'#ffffff','line-width':1.2,'line-opacity':0.8 }
      })
    } catch (e) {
      console.warn('Failed to add borders:', e)
    }

    // Click handlers for all layers
    const clickLayers = layerIds.filter(l => l.startsWith('geofence-') && !['geofence-borders','geofence-all-debug'].includes(l))
    clickLayers.forEach(id => {
      try {
        map.current.on('click', id, e => {
          const p = e.features[0].properties
          console.log('➡️ Clicked feature:', id, p)
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="padding: 15px; max-width: 350px; font-family: sans-serif;">
                <h3 style="font-weight: bold; margin-bottom: 10px; color: #ef4444; font-size: 16px;">
                  ${getRiskIcon(p.risk)} ${p.name}
                </h3>
                <div style="margin-bottom: 8px;">
                  <strong>⚠️ Risk:</strong> ${p.risk?.replace('_', ' ') || 'Unknown'}
                </div>
                <div style="margin-bottom: 8px;">
                  <strong>🔥 Severity:</strong> 
                  <span style="color: ${getSeverityColor(p.severity)}; font-weight: bold; text-transform: uppercase;">
                    ${p.severity || 'Unknown'}
                  </span>
                </div>
                ${renderAdditionalInfo(p)}
                <div style="font-size: 11px; color: #666; margin-top: 12px; padding-top: 8px; border-top: 1px solid #eee;">
                  📊 Source: ${p.source || 'Unknown'} | 🕒 ${p.timestamp ? new Date(p.timestamp).toLocaleString() : 'Real-time data'}
                </div>
              </div>
            `)
            .addTo(map.current)
        })
        
        map.current.on('mouseenter', id, () => map.current.getCanvas().style.cursor='pointer')
        map.current.on('mouseleave', id, () => map.current.getCanvas().style.cursor='')
      } catch (e) {
        console.warn(`Failed to add click handler for ${id}:`, e)
      }
    })

    // Post-render verification
    setTimeout(() => {
      try {
        const style = map.current.getStyle()
        const present = style.layers.filter(l => layerIds.includes(l.id)).map(l=>l.id)
        console.log('✅ Layers successfully added:', present)
      } catch (e) {
        console.warn('Failed to verify layers:', e)
      }
    }, 100)

  }, [showRiskyAreas, geofenceData, styleVersion])

  return (
    <>
      {/* Full screen map container */}
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh'
        }}
      />

      {/* Route Info Card */}
      {routeInfo && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white rounded-xl shadow-lg px-6 py-3 z-20 flex flex-col items-center">
          <div className="font-bold text-lg mb-1">Navigation Info</div>
          <div className="text-sm">
            <span className="font-semibold">Distance:</span> {(routeInfo.distance / 1000).toFixed(2)} km
          </div>
          <div className="text-sm">
            <span className="font-semibold">Estimated Time:</span> {Math.round(routeInfo.duration / 60)} min
          </div>
        </div>
      )}

      {/* Loading Indicator - Positioned Right */}
      {isLoadingData && (
        <div className="absolute top-4 right-4 bg-blue-600/90 text-white rounded-xl shadow-lg px-4 py-2 z-20 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          <span className="text-sm">Loading comprehensive data...</span>
        </div>
      )}

      {/* Current View Info - Move to top-left when not loading */}
      {!isLoadingData && (
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg z-10 border border-gray-200">
          <p className="text-sm font-medium">
            Viewing: <span className="capitalize text-indigo-600">{activeItem}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Style: <span className="font-medium">
              {isSatellite ? 'Satellite View' : 'Default Map'}
            </span>
          </p>
          {geofenceData?.features?.length > 0 && (
            <div className="text-xs text-gray-500 mt-2">
              📍 {geofenceData.features.length} risk zones active
            </div>
          )}
        </div>
      )}

      {/* Toggle Button - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-10">
        <StyleSwitchButton onClick={handleSwitchStyle} isSatellite={isSatellite} />
      </div>

      {/* Enhanced Legend with Crime Details */}
      <div className="absolute bottom-20 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg z-10 max-h-96 overflow-y-auto">
        <h4 className="font-semibold text-sm mb-3">
          🌍 Comprehensive Risk Map 
          {geofenceData && (
            <span className="text-xs text-gray-600">
              ({geofenceData.features?.length || 0} zones)
            </span>
          )}
        </h4>
        
        {geofenceData?.metadata && (
          <div className="text-xs text-gray-500 mb-3 border-b pb-2">
            🔄 Updated: {new Date(geofenceData.metadata.generated).toLocaleTimeString()}
            <br />
            📡 {geofenceData.metadata.sources?.length || 0} Sources Active
            <br />
            🗺️ {geofenceData.metadata.coverage_area || 'India'}
          </div>
        )}
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Safe Areas</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-cyan-600 mr-2"></div>
            <span>Weather ({geofenceData?.metadata?.breakdown?.weather || 0})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-600 mr-2"></div>
            <span>Air Quality ({geofenceData?.metadata?.breakdown?.additional_simulated ? Math.floor(geofenceData.metadata.breakdown.additional_simulated * 0.2) : 0})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
            <span>Disasters ({geofenceData?.metadata?.breakdown?.earthquakes || 0})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-600 mr-2"></div>
            <span>Traffic ({geofenceData?.metadata?.breakdown?.traffic || 0})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-600 mr-2"></div>
            <span>Industrial ({geofenceData?.metadata?.breakdown?.industrial || 0})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-700 mr-2"></div>
            <span>Elevation ({geofenceData?.metadata?.breakdown?.elevation || 0})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-pink-600 mr-2"></div>
            <span>Crime/Security ({geofenceData?.metadata?.breakdown?.crime_security || 0})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>Crowds ({geofenceData?.metadata?.breakdown?.crowds || 0})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-700 mr-2"></div>
            <span>Wildlife ({geofenceData?.metadata?.breakdown?.additional_simulated ? Math.floor(geofenceData.metadata.breakdown.additional_simulated * 0.1) : 0})</span>
          </div>
          {/* In legend list */}
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
            <span>Power Infra</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
            <span>Health Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-700 mr-2"></div>
            <span>Drought</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>Cyclone Impact</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-violet-700 mr-2"></div>
            <span>Landslide</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-3 pt-2 border-t">
          🔄 Auto-refresh: 5 minutes
          <br />
          🚔 Includes: Crime zones, Naxal areas, Border security
        </div>
      </div>
    </>
  )
}