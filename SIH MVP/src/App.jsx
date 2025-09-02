import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Map from './components/Map'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

function App() {
  const [activeItem, setActiveItem] = useState("home")
  const [route, setRoute] = useState(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [showRiskyAreas, setShowRiskyAreas] = useState(false)

  const handleNavigationSearch = async (from, to) => {
    // Parse coordinates
    const parseCoord = (str) => {
      if (/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(str)) {
        const [lat, lng] = str.split(",").map(Number)
        return { lat, lng }
      }
      return null
    }

    const fromCoord = parseCoord(from)
    const toCoord = parseCoord(to)
    if (!fromCoord || !toCoord) {
      alert("Could not find locations.")
      return
    }

    // Get route from Mapbox Directions API
    const directionsResp = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${fromCoord.lng},${fromCoord.lat};${toCoord.lng},${toCoord.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
    )
    const directionsData = await directionsResp.json()
    if (
      directionsData.routes &&
      directionsData.routes.length > 0 &&
      directionsData.routes[0].geometry
    ) {
      setRoute({
        ...directionsData.routes[0].geometry,
        routeInfo: {
          distance: directionsData.routes[0].distance,
          duration: directionsData.routes[0].duration
        }
      })
    } else {
      alert("Could not find route.")
    }
  }

  const handleStartNavigation = () => {
    setIsNavigating(true)
  }

  const handleToggleRiskyAreas = () => {
    setShowRiskyAreas(!showRiskyAreas)
    console.log('Toggling risky areas:', !showRiskyAreas)
  }

  return (
    <div className="flex h-screen">
      <Sidebar 
        onNavigationSearch={handleNavigationSearch}
        onStartNavigation={handleStartNavigation}
        onToggleRiskyAreas={handleToggleRiskyAreas}
      />
      <Map 
        activeItem={activeItem}
        route={route}
        isNavigating={isNavigating}
        showRiskyAreas={showRiskyAreas}
      />
    </div>
  )
}

export default App