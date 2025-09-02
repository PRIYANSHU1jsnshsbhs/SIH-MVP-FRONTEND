import { useState, useContext, createContext } from "react"
import { Home, Search, MapPin, Route, Shield, AlertTriangle, Navigation, Settings, ArrowLeft, LocateFixed } from "lucide-react"

const MAPBOX_TOKEN = 'pk.eyJ1IjoicHJpeWFuc2h1NjU5NCIsImEiOiJjbWV6cHhjbWoxMXV0MmxxeTg1b2Y3dHM5In0.VqvTmVZAFHF-2kX8R5A61Q'
const SidebarContext = createContext()

export default function Sidebar({ onNavigationSearch, onStartNavigation, onToggleRiskyAreas }) {
  const [expanded, setExpanded] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [navMode, setNavMode] = useState(false)
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [suggestions, setSuggestions] = useState([])

  // Fetch suggestions as user types
  const handleToChange = async (e) => {
    const value = e.target.value
    setTo(value)
    if (value.length > 2) {
      const resp = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?autocomplete=true&limit=5&access_token=${MAPBOX_TOKEN}`
      )
      const data = await resp.json()
      setSuggestions(data.features || [])
    } else {
      setSuggestions([])
    }
  }

  // When a suggestion is clicked
  const handleSuggestionClick = (feature) => {
    setTo(feature.place_name)
    setSuggestions([])
    if (from && onNavigationSearch) {
      onNavigationSearch(from, `${feature.center[1]},${feature.center[0]}`)
    }
  }

  // Handler for using current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFrom(`${pos.coords.latitude},${pos.coords.longitude}`)
        },
        () => {
          alert("Unable to fetch location.")
        }
      )
    } else {
      alert("Geolocation not supported.")
    }
  }

  // Handler for search button
  const handleSearchClick = async () => {
    if (from && to && onNavigationSearch) {
      // If "to" is already coordinates, use it
      if (/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(to)) {
        onNavigationSearch(from, to)
      } else {
        // Otherwise, geocode "to"
        const resp = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(to)}.json?limit=1&access_token=${MAPBOX_TOKEN}`
        )
        const data = await resp.json()
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center
          onNavigationSearch(from, `${lat},${lng}`)
        } else {
          alert("Destination not found.")
        }
      }
    }
  }

  // Handler for back button
  const handleBackClick = () => {
    setNavMode(false)
    setFrom("")
    setTo("")
    setSuggestions([])
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          md:hidden fixed top-6 left-6 z-50 p-3 rounded-xl shadow-lg
          bg-gray-900/80 text-white
          hover:bg-gray-800/90
          transition-transform duration-300 ease-in-out transform hover:scale-110
          ${isOpen ? 'rotate-90' : 'rotate-0'}
        `}
      >
        {isOpen ? <ArrowLeft size={20} /> : <Home size={20} />}
      </button>

      {/* Mobile Backdrop */}
      <div 
        className={`
          md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30
          transition-all duration-500 ease-in-out
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}
        onClick={() => setIsOpen(false)}
      />

      {/* Vertically and horizontally centered sidebar with left margin */}
      <div className={`fixed left-6 top-0 h-screen w-72 flex items-center justify-center z-40
        ${isOpen ? '' : 'md:translate-x-0 -translate-x-full'}
      `}>
        <nav className={`
          w-72 max-w-xs
          bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800/40
          transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        `}>
          <div className="p-4 flex justify-between items-center border-b border-gray-800/30">
            <div className={`overflow-hidden transition-all duration-500 ${expanded ? "w-32" : "w-0"}`}>
              <h2 className="text-lg font-bold text-white">
                TouristSafe
              </h2>
            </div>
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-2 rounded-lg bg-gray-800/60 hover:bg-gray-800/80 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 text-white"
            >
              {expanded ? <ArrowLeft size={16} /> : <Home size={16} />}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded, setIsOpen }}>
            <div
              className={`p-3 space-y-1 ${expanded ? "max-h-[480px] overflow-y-auto" : "max-h-[480px] overflow-hidden"}`}
              style={{ scrollbarWidth: "none", minHeight: "480px" }}
            >
              {!navMode ? (
                <>
                  <SidebarItem icon={<Home size={18} />} text="Home" />
                  <SidebarItem icon={<LocateFixed size={18} />} text="Share Live Location" />
                  <SidebarItem 
                    icon={<AlertTriangle size={18} />} 
                    text="Risky Areas" 
                    onClick={onToggleRiskyAreas}
                    alert 
                  />
                  <SidebarItem icon={<Shield size={18} />} text="Vitals" />
                  <SidebarItem icon={<MapPin size={18} />} text="Trusted Contacts" />
                  <SidebarItem icon={<Search size={18} />} text="Booking" />
                  <SidebarItem icon={<Navigation size={18} />} text="Navigation" onClick={() => setNavMode(true)} />
                  <SidebarItem icon={<Route size={18} />} text="Hikes" />
                  <SidebarItem icon={<Settings size={18} />} text="Settings" />
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-1">From</label>
                    <input
                      type="text"
                      value={from}
                      onChange={e => setFrom(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
                      placeholder="Enter starting point"
                    />
                    <button
                      className="mt-2 px-3 py-1 bg-gray-700 text-white rounded-lg flex items-center gap-2"
                      onClick={handleUseCurrentLocation}
                    >
                      <LocateFixed size={16} /> Use Current Location
                    </button>
                  </div>
                  <div className="relative">
                    <label className="block text-gray-300 mb-1">To</label>
                    <input
                      type="text"
                      value={to}
                      onChange={handleToChange}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
                      placeholder="Enter destination"
                      autoComplete="off"
                    />
                    {/* Suggestions dropdown */}
                    {suggestions.length > 0 && (
                      <ul className="absolute left-0 right-0 top-full bg-gray-800 border border-gray-700 rounded-lg mt-1 z-50 max-h-48 overflow-y-auto">
                        {suggestions.map((feature) => (
                          <li
                            key={feature.id}
                            className="px-3 py-2 text-white cursor-pointer hover:bg-gray-700"
                            onClick={() => handleSuggestionClick(feature)}
                          >
                            {feature.place_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                      onClick={handleSearchClick}
                    >
                      Search
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                      onClick={() => onStartNavigation && onStartNavigation()}
                    >
                      Start Navigation
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg"
                      onClick={handleBackClick}
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          </SidebarContext.Provider>

          {/* User Profile */}
          <div className="border-t border-gray-800/30 p-3">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <img
                  src="https://ui-avatars.com/api/?background=222&color=fff&bold=true&name=TU"
                  alt="Profile"
                  className="w-8 h-8 rounded-lg shadow-sm"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border border-white rounded-full"></div>
              </div>
              <div className={`overflow-hidden transition-all duration-500 ${expanded ? "w-24" : "w-0"}`}>
                <h4 className="font-medium text-sm text-white">Tourist</h4>
                <span className="text-xs text-gray-400">Online</span>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}

export function SidebarItem({ icon, text, active, alert, onClick }) {
  const { expanded, setIsOpen } = useContext(SidebarContext)

  const handleClick = () => {
    if (onClick) onClick()
    if (window.innerWidth < 768) {
      setTimeout(() => setIsOpen(false), 150)
    }
  }

  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-0.5
        font-medium rounded-lg cursor-pointer group
        transition-all duration-300 ease-in-out transform hover:scale-[1.02]
        ${active
          ? "bg-gray-800/80 text-white shadow-md"
          : "hover:bg-gray-800/60 text-gray-200 hover:text-white"
        }
      `}
      onClick={handleClick}
    >
      <div className={`transition-all duration-300 flex-shrink-0 ${active ? "text-white" : "text-gray-400"}`}>
        {icon}
      </div>

      <span className={`
        overflow-hidden transition-all duration-500 ease-in-out whitespace-nowrap
        ${expanded ? "w-32 ml-3 opacity-100" : "w-0 ml-0 opacity-0"}
      `}>
        {text}
      </span>

      {/* Alert indicator */}
      {alert && (
        <div className={`
          absolute w-2 h-2 bg-red-400 rounded-full
          animate-pulse transition-all duration-300
          ${expanded ? "right-2" : "right-1 top-1"}
        `} />
      )}

      {/* Tooltip for collapsed state */}
      {!expanded && (
        <div className="
          absolute left-full ml-2 px-2 py-1 rounded-md
          bg-gray-900 text-white text-xs font-medium
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-300 ease-in-out transform translate-x-1 group-hover:translate-x-0
          whitespace-nowrap z-50 shadow-lg
        ">
          {text}
          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-1.5 h-1.5 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </li>
  )
}