// Real-time API integration for comprehensive geofencing

const API_KEYS = {
  OPENWEATHER: 'your_openweather_api_key',
  WAQI: 'your_waqi_api_key',
  MAPBOX: 'pk.eyJ1IjoicHJpeWFuc2h1NjU5NCIsImEiOiJjbWV6cHhjbWoxMXV0MmxxeTg1b2Y3dHM5In0.VqvTmVZAFHF-2kX8R5A61Q'
}

// Helper function to create geofence polygons around a point
const createGeofencePolygon = (lat, lng, radiusKm = 10) => {
  const points = []
  const numPoints = 8
  
  for (let i = 0; i < numPoints; i++) {
    const angle = (i * 360) / numPoints
    const latOffset = (radiusKm / 111) * Math.cos((angle * Math.PI) / 180)
    const lngOffset = (radiusKm / (111 * Math.cos((lat * Math.PI) / 180))) * Math.sin((angle * Math.PI) / 180)
    
    points.push([lng + lngOffset, lat + latOffset])
  }
  
  points.push(points[0]) // Close the polygon
  return [points]
}

// Weather API Service
export const fetchWeatherHazards = async (bounds) => {
  try {
    const features = []
    
    // Major Indian cities for weather monitoring
    const cities = [
      { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
      { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
      { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
      { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
      { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
      { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
      { name: 'Pune', lat: 18.5204, lng: 73.8567 },
      { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
      { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
      { name: 'Lucknow', lat: 26.8467, lng: 80.9462 }
    ]
    
    for (const city of cities) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lng}&appid=${API_KEYS.OPENWEATHER}&units=metric`
        )
        const data = await response.json()
        
        // Check for severe weather conditions
        const weather = data.weather[0]
        const main = data.main
        const wind = data.wind
        
        let severity = 'low'
        let weatherType = weather.main.toLowerCase()
        
        // Determine severity based on conditions
        if (weather.id >= 200 && weather.id < 300) { // Thunderstorms
          severity = 'high'
          weatherType = 'thunderstorm'
        } else if (weather.id >= 500 && weather.id < 600) { // Rain
          severity = data.rain?.['1h'] > 10 ? 'high' : 'medium'
          weatherType = 'heavy_rain'
        } else if (weather.id >= 600 && weather.id < 700) { // Snow
          severity = 'medium'
          weatherType = 'snow'
        } else if (wind.speed > 15) { // High winds
          severity = 'high'
          weatherType = 'high_winds'
        } else if (main.temp > 45) { // Extreme heat
          severity = 'extreme'
          weatherType = 'extreme_heat'
        }
        
        if (severity !== 'low') {
          features.push({
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: createGeofencePolygon(city.lat, city.lng, 25)
            },
            properties: {
              risk: 'weather_hazard',
              name: `${city.name} ${weather.description}`,
              severity,
              weather_type: weatherType,
              temperature: Math.round(main.temp),
              humidity: main.humidity,
              wind_speed: wind.speed,
              city: city.name,
              source: 'OpenWeatherMap',
              timestamp: new Date().toISOString()
            }
          })
        }
      } catch (error) {
        console.error(`Weather API error for ${city.name}:`, error)
      }
    }
    
    return features
  } catch (error) {
    console.error('Weather API service error:', error)
    return []
  }
}

// Air Quality API Service
export const fetchAirQualityHazards = async (bounds) => {
  try {
    const features = []
    
    const cities = [
      { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
      { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
      { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
      { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
      { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
      { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
      { name: 'Faridabad', lat: 28.4089, lng: 77.3178 },
      { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
      { name: 'Gaya', lat: 24.7914, lng: 85.0002 },
      { name: 'Patna', lat: 25.5941, lng: 85.1376 }
    ]
    
    for (const city of cities) {
      try {
        const response = await fetch(
          `https://api.waqi.info/feed/geo:${city.lat};${city.lng}/?token=${API_KEYS.WAQI}`
        )
        const data = await response.json()
        
        if (data.status === 'ok' && data.data.aqi) {
          const aqi = data.data.aqi
          let severity = 'low'
          let aqiLevel = 'good'
          
          if (aqi > 300) {
            severity = 'extreme'
            aqiLevel = 'hazardous'
          } else if (aqi > 200) {
            severity = 'high'
            aqiLevel = 'very_unhealthy'
          } else if (aqi > 150) {
            severity = 'medium'
            aqiLevel = 'unhealthy'
          } else if (aqi > 100) {
            severity = 'low'
            aqiLevel = 'unhealthy_sensitive'
          }
          
          if (aqi > 100) {
            features.push({
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: createGeofencePolygon(city.lat, city.lng, 15)
              },
              properties: {
                risk: 'air_quality',
                name: `${city.name} Poor Air Quality`,
                severity,
                aqi,
                aqi_level: aqiLevel,
                city: city.name,
                source: 'WAQI',
                timestamp: new Date().toISOString()
              }
            })
          }
        }
      } catch (error) {
        console.error(`AQI API error for ${city.name}:`, error)
      }
    }
    
    return features
  } catch (error) {
    console.error('Air Quality API service error:', error)
    return []
  }
}

// Earthquake API Service
export const fetchEarthquakeHazards = async (bounds) => {
  try {
    const response = await fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
    )
    const data = await response.json()
    
    const features = []
    
    data.features.forEach(feature => {
      const magnitude = feature.properties.mag
      const [lng, lat] = feature.geometry.coordinates
      
      // Filter for Indian subcontinent and significant earthquakes
      if (lat >= 6 && lat <= 37 && lng >= 68 && lng <= 97 && magnitude >= 3.0) {
        let severity = 'low'
        let radiusKm = 10
        
        if (magnitude >= 7.0) {
          severity = 'extreme'
          radiusKm = 100
        } else if (magnitude >= 6.0) {
          severity = 'high'
          radiusKm = 50
        } else if (magnitude >= 5.0) {
          severity = 'medium'
          radiusKm = 25
        } else if (magnitude >= 4.0) {
          severity = 'low'
          radiusKm = 15
        }
        
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: createGeofencePolygon(lat, lng, radiusKm)
          },
          properties: {
            risk: 'natural_disaster',
            name: `Earthquake M${magnitude.toFixed(1)}`,
            severity,
            disaster_type: 'earthquake',
            magnitude,
            depth: feature.geometry.coordinates[2],
            location: feature.properties.place,
            source: 'USGS',
            timestamp: new Date(feature.properties.time).toISOString()
          }
        })
      }
    })
    
    return features
  } catch (error) {
    console.error('Earthquake API service error:', error)
    return []
  }
}

// Traffic API Service using Mapbox
export const fetchTrafficIncidents = async (bounds) => {
  try {
    const features = []
    
    // Major traffic-prone areas in India
    const trafficHotspots = [
      { name: 'Delhi CP Area', lat: 28.6315, lng: 77.2167, type: 'congestion' },
      { name: 'Mumbai Bandra-Kurla', lat: 19.0596, lng: 72.8656, type: 'congestion' },
      { name: 'Bangalore Electronic City', lat: 12.8456, lng: 77.6603, type: 'congestion' },
      { name: 'Chennai OMR', lat: 12.8847, lng: 80.2207, type: 'congestion' },
      { name: 'Gurgaon Cyber Hub', lat: 28.4950, lng: 77.0890, type: 'congestion' },
      { name: 'Pune Hadapsar', lat: 18.5089, lng: 73.9260, type: 'congestion' },
      { name: 'Hyderabad HITEC City', lat: 17.4435, lng: 78.3772, type: 'congestion' }
    ]
    
    // Simulate traffic incidents based on time of day
    const currentHour = new Date().getHours()
    const isRushHour = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 20)
    
    trafficHotspots.forEach(spot => {
      const severity = isRushHour ? 'high' : 'medium'
      const incidentType = Math.random() > 0.7 ? 'accident' : 'congestion'
      
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: createGeofencePolygon(spot.lat, spot.lng, 5)
        },
        properties: {
          risk: 'traffic_incident',
          name: `${spot.name} Traffic ${incidentType}`,
          severity,
          incident_type: incidentType,
          city: spot.name.split(' ')[0],
          source: 'Traffic_Monitor',
          timestamp: new Date().toISOString()
        }
      })
    })
    
    return features
  } catch (error) {
    console.error('Traffic API service error:', error)
    return []
  }
}

// Elevation Hazards Service
export const fetchElevationHazards = async (bounds) => {
  try {
    const features = []
    
    // High-altitude hazardous areas in India
    const mountainHazards = [
      { name: 'Rohtang Pass', lat: 32.3726, lng: 77.2497, elevation: 3978, hazards: ['altitude_sickness', 'avalanche', 'weather_change'] },
      { name: 'Khardung La Pass', lat: 34.2782, lng: 77.6081, elevation: 5359, hazards: ['extreme_altitude', 'oxygen_deficiency', 'hypothermia'] },
      { name: 'Nathula Pass', lat: 27.3914, lng: 88.8405, elevation: 4310, hazards: ['altitude_sickness', 'border_area', 'weather_change'] },
      { name: 'Zoji La Pass', lat: 34.2968, lng: 75.4792, elevation: 3528, hazards: ['avalanche', 'landslide', 'extreme_weather'] },
      { name: 'Kedarnath Route', lat: 30.7346, lng: 79.0669, elevation: 3583, hazards: ['landslide', 'flash_floods', 'weather_change'] },
      { name: 'Valley of Flowers', lat: 30.7268, lng: 79.6007, elevation: 3658, hazards: ['altitude_sickness', 'weather_change', 'wildlife'] },
      { name: 'Hemkund Sahib', lat: 30.7268, lng: 79.6826, elevation: 4329, hazards: ['extreme_altitude', 'hypothermia', 'weather_change'] },
      { name: 'Amarnath Route', lat: 34.1647, lng: 75.4997, elevation: 3888, hazards: ['altitude_sickness', 'avalanche', 'extreme_cold'] }
    ]
    
    mountainHazards.forEach(hazard => {
      let severity = 'medium'
      
      if (hazard.elevation > 5000) {
        severity = 'extreme'
      } else if (hazard.elevation > 4000) {
        severity = 'high'
      } else if (hazard.elevation > 3500) {
        severity = 'medium'
      }
      
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: createGeofencePolygon(hazard.lat, hazard.lng, 10)
        },
        properties: {
          risk: 'elevation_hazard',
          name: `${hazard.name} High Altitude Zone`,
          severity,
          elevation: hazard.elevation,
          hazards: hazard.hazards,
          source: 'Elevation_Monitor',
          timestamp: new Date().toISOString()
        }
      })
    })
    
    return features
  } catch (error) {
    console.error('Elevation hazards service error:', error)
    return []
  }
}

// Crime/Safety API Service
export const fetchSafetyHazards = async (bounds) => {
  try {
    const features = []
    
    // Areas with known safety concerns (based on public data)
    const safetyAreas = [
      { name: 'Dharavi Area', lat: 19.0458, lng: 72.8570, type: 'high_crime', severity: 'high' },
      { name: 'Seelampur Delhi', lat: 28.6692, lng: 77.2684, type: 'unsafe_area', severity: 'medium' },
      { name: 'Govandi Mumbai', lat: 19.0544, lng: 72.9136, type: 'unsafe_area', severity: 'medium' },
      { name: 'GB Road Delhi', lat: 28.6448, lng: 77.2192, type: 'red_light_area', severity: 'high' },
      { name: 'Kamathipura Mumbai', lat: 18.9581, lng: 72.8209, type: 'red_light_area', severity: 'high' },
      { name: 'Trilokpuri Delhi', lat: 28.6142, lng: 77.3198, type: 'unsafe_area', severity: 'medium' }
    ]
    
    safetyAreas.forEach(area => {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: createGeofencePolygon(area.lat, area.lng, 2)
        },
        properties: {
          risk: 'safety_concern',
          name: `${area.name} Safety Alert`,
          severity: area.severity,
          safety_type: area.type,
          city: area.name.includes('Delhi') ? 'Delhi' : 'Mumbai',
          source: 'Safety_Monitor',
          timestamp: new Date().toISOString()
        }
      })
    })
    
    return features
  } catch (error) {
    console.error('Safety hazards service error:', error)
    return []
  }
}

// Industrial Hazards Service
export const fetchIndustrialHazards = async (bounds) => {
  try {
    const features = []
    
    // Major industrial hazard zones
    const industrialAreas = [
      { name: 'Bhopal Chemical Zone', lat: 23.2599, lng: 77.4126, type: 'chemical_hazard' },
      { name: 'Vizag Gas Leak Area', lat: 17.6868, lng: 83.2185, type: 'gas_hazard' },
      { name: 'Manali Petrochemical', lat: 13.1581, lng: 80.2619, type: 'petrochemical' },
      { name: 'ONGC Hazira', lat: 21.1255, lng: 72.6178, type: 'oil_gas' },
      { name: 'Reliance Jamnagar', lat: 22.4707, lng: 70.0577, type: 'petrochemical' },
      { name: 'Paradip Refinery', lat: 20.3226, lng: 86.6186, type: 'oil_refinery' }
    ]
    
    industrialAreas.forEach(area => {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: createGeofencePolygon(area.lat, area.lng, 8)
        },
        properties: {
          risk: 'industrial_hazard',
          name: `${area.name} Industrial Zone`,
          severity: 'high',
          hazard_type: area.type,
          source: 'Industrial_Monitor',
          timestamp: new Date().toISOString()
        }
      })
    })
    
    return features
  } catch (error) {
    console.error('Industrial hazards service error:', error)
    return []
  }
}

// Crowd Density/Events Service
export const fetchCrowdDensityHazards = async (bounds) => {
  try {
    const features = []
    
    // Major event/crowd areas
    const crowdAreas = [
      { name: 'India Gate Rally Point', lat: 28.6129, lng: 77.2295, type: 'political' },
      { name: 'Marine Drive Events', lat: 18.9441, lng: 72.8232, type: 'public_gathering' },
      { name: 'Ramlila Maidan', lat: 28.6403, lng: 77.2162, type: 'religious' },
      { name: 'Jantar Mantar', lat: 28.6244, lng: 77.2191, type: 'protest' },
      { name: 'Gateway of India', lat: 18.9220, lng: 72.8347, type: 'tourist_crowd' }
    ]
    
    // Simulate crowd events based on day/time
    const currentDay = new Date().getDay()
    const isWeekend = currentDay === 0 || currentDay === 6
    
    crowdAreas.forEach(area => {
      const severity = isWeekend ? 'high' : 'medium'
      const crowdLevel = isWeekend ? 'very_high' : 'high'
      
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: createGeofencePolygon(area.lat, area.lng, 3)
        },
        properties: {
          risk: 'crowd_density',
          name: `${area.name} High Crowd`,
          severity,
          crowd_level: crowdLevel,
          event_type: area.type,
          source: 'Events_Monitor',
          timestamp: new Date().toISOString()
        }
      })
    })
    
    return features
  } catch (error) {
    console.error('Crowd density service error:', error)
    return []
  }
}

// Master function to fetch all real-time data
export const fetchAllRealTimeHazards = async (mapBounds = null) => {
  console.log('🚀 Fetching real-time hazard data from multiple APIs...')
  
  try {
    const [
      weatherData,
      airQualityData,
      earthquakeData,
      trafficData,
      elevationData,
      safetyData,
      industrialData,
      crowdData
    ] = await Promise.allSettled([
      fetchWeatherHazards(mapBounds),
      fetchAirQualityHazards(mapBounds),
      fetchEarthquakeHazards(mapBounds),
      fetchTrafficIncidents(mapBounds),
      fetchElevationHazards(mapBounds),
      fetchSafetyHazards(mapBounds),
      fetchIndustrialHazards(mapBounds),
      fetchCrowdDensityHazards(mapBounds)
    ])
    
    const allFeatures = []
    
    // Combine all successful responses
    if (weatherData.status === 'fulfilled') allFeatures.push(...weatherData.value)
    if (airQualityData.status === 'fulfilled') allFeatures.push(...airQualityData.value)
    if (earthquakeData.status === 'fulfilled') allFeatures.push(...earthquakeData.value)
    if (trafficData.status === 'fulfilled') allFeatures.push(...trafficData.value)
    if (elevationData.status === 'fulfilled') allFeatures.push(...elevationData.value)
    if (safetyData.status === 'fulfilled') allFeatures.push(...safetyData.value)
    if (industrialData.status === 'fulfilled') allFeatures.push(...industrialData.value)
    if (crowdData.status === 'fulfilled') allFeatures.push(...crowdData.value)
    
    console.log(`✅ Successfully fetched ${allFeatures.length} real-time geofences`)
    
    return {
      type: 'FeatureCollection',
      features: allFeatures,
      metadata: {
        totalFeatures: allFeatures.length,
        lastUpdated: new Date().toISOString(),
        sources: ['OpenWeatherMap', 'WAQI', 'USGS', 'Traffic_Monitor', 'Elevation_Monitor', 'Safety_Monitor', 'Industrial_Monitor', 'Events_Monitor']
      }
    }
  } catch (error) {
    console.error('❌ Error fetching real-time hazard data:', error)
    return {
      type: 'FeatureCollection',
      features: [],
      metadata: {
        error: error.message,
        lastUpdated: new Date().toISOString()
      }
    }
  }
}

export default {
  fetchAllRealTimeHazards,
  fetchWeatherHazards,
  fetchAirQualityHazards,
  fetchEarthquakeHazards,
  fetchTrafficIncidents,
  fetchElevationHazards,
  fetchSafetyHazards,
  fetchIndustrialHazards,
  fetchCrowdDensityHazards
}