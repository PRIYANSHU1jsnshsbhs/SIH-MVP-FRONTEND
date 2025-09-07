import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Map from "./components/Map"

function App() {
  console.log("🚀 App loading with Sidebar + Map")

  const [activeItem, setActiveItem] = useState(null)
  const [route, setRoute] = useState(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [showRiskyAreas, setShowRiskyAreas] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [authMode, setAuthMode] = useState("login") // "login" or "register"
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: ""
  })

  const handleShowAuth = () => {
    console.log("handleShowAuth called!")
    setShowAuthForm(true)
  }

  const handleCloseAuth = () => {
    console.log("handleCloseAuth called!")
    setShowAuthForm(false)
    setAuthData({ email: "", password: "", confirmPassword: "", fullName: "" })
  }

  const handleAuthInputChange = (e) => {
    const { name, value } = e.target
    setAuthData(prev => ({ ...prev, [name]: value }))
  }

  const handleAuthSubmit = (e) => {
    e.preventDefault()
    if (authMode === "register") {
      if (authData.password !== authData.confirmPassword) {
        alert("Passwords do not match!")
        return
      }
      if (!authData.fullName.trim()) {
        alert("Full name is required!")
        return
      }
    }
    console.log(`${authMode} submitted:`, authData)
    alert(`${authMode === "login" ? "Login" : "Registration"} successful!`)
    handleCloseAuth()
  }

  // Search button: Only show route, do NOT start navigation
  const handleNavigationSearch = async (fromCoords, toCoords) => {
    console.log("Navigation search from:", fromCoords, "to:", toCoords)

    try {
      // Parse coordinates
      const [fromLat, fromLng] = fromCoords.split(",").map(Number)
      const [toLat, toLng] = toCoords.split(",").map(Number)

      // Get route from Mapbox Directions API
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLng},${fromLat};${toLng},${toLat}?geometries=geojson&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
      )
      const data = await response.json()

      if (data.routes && data.routes.length > 0) {
        const routeData = data.routes[0]
        setRoute({
          coordinates: routeData.geometry.coordinates,
          routeInfo: {
            distance: routeData.distance,
            duration: routeData.duration
          }
        })
        console.log("Route displayed successfully!")
      } else {
        console.error("No route found")
        alert("No route found between the selected points")
      }
    } catch (error) {
      console.error("Error fetching route:", error)
      alert("Error calculating route")
    }
  }

  // Start Navigation button: Start navigation if route exists
  const handleStartNavigation = () => {
    console.log("Start Navigation clicked!")
    if (route) {
      setIsNavigating(true)
      console.log("Navigation started!")
    } else {
      alert("Please search for a route first!")
    }
  }

  const handleToggleRiskyAreas = () => {
    setShowRiskyAreas(!showRiskyAreas)
    console.log("Toggle risky areas:", !showRiskyAreas)
  }

  const handleStopNavigation = () => {
    setRoute(null)
    setIsNavigating(false)
    console.log("Navigation stopped")
  }

  const handleSidebarItemClick = (item) => {
    setActiveItem(item)
    console.log("Sidebar item clicked:", item)
  }

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Sidebar 
        onNavigationSearch={handleNavigationSearch}
        onStartNavigation={handleStartNavigation}
        onToggleRiskyAreas={handleToggleRiskyAreas}
        onSidebarToggle={setSidebarExpanded}
        onShowAuth={handleShowAuth}
        onItemClick={handleSidebarItemClick}
      />

      <Map 
        activeItem={activeItem}
        route={route}
        isNavigating={isNavigating}
        showRiskyAreas={showRiskyAreas}
        sidebarExpanded={sidebarExpanded}
        onStopNavigation={handleStopNavigation}
      />

      {showAuthForm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
            position: "relative",
            width: "400px",
            maxWidth: "90vw",
            overflow: "hidden"
          }}>
            {/* Close Button */}
            <button
              onClick={handleCloseAuth}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#666",
                zIndex: 10
              }}
            >
              ×
            </button>

            {/* Header with Tabs */}
            <div style={{ backgroundColor: "#f8f9fa", padding: "20px 30px 0" }}>
              <h2 style={{ margin: "0 0 20px", fontSize: "24px", color: "#333" }}>
                Welcome
              </h2>
              <div style={{ display: "flex", borderBottom: "1px solid #e0e0e0" }}>
                <button
                  onClick={() => setAuthMode("login")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: "none",
                    backgroundColor: "transparent",
                    fontSize: "16px",
                    cursor: "pointer",
                    borderBottom: authMode === "login" ? "2px solid #007bff" : "2px solid transparent",
                    color: authMode === "login" ? "#007bff" : "#666"
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthMode("register")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: "none",
                    backgroundColor: "transparent",
                    fontSize: "16px",
                    cursor: "pointer",
                    borderBottom: authMode === "register" ? "2px solid #007bff" : "2px solid transparent",
                    color: authMode === "register" ? "#007bff" : "#666"
                  }}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div style={{ padding: "30px" }}>
              <form onSubmit={handleAuthSubmit}>
                {authMode === "register" && (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "14px" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={authData.fullName}
                      onChange={handleAuthInputChange}
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "16px",
                        boxSizing: "border-box"
                      }}
                      placeholder="Enter your full name"
                    />
                  </div>
                )}

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "14px" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={authData.email}
                    onChange={handleAuthInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "16px",
                      boxSizing: "border-box"
                    }}
                    placeholder="Enter your email"
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "14px" }}>
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={authData.password}
                    onChange={handleAuthInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "16px",
                      boxSizing: "border-box"
                    }}
                    placeholder="Enter your password"
                  />
                </div>

                {authMode === "register" && (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "14px" }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={authData.confirmPassword}
                      onChange={handleAuthInputChange}
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "16px",
                        boxSizing: "border-box"
                      }}
                      placeholder="Confirm your password"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "16px",
                    cursor: "pointer",
                    marginTop: "10px"
                  }}
                >
                  {authMode === "login" ? "Login" : "Create Account"}
                </button>
              </form>

              {authMode === "login" && (
                <div style={{ textAlign: "center", marginTop: "15px" }}>
                  <a href="#" style={{ color: "#007bff", textDecoration: "none", fontSize: "14px" }}>
                    Forgot your password?
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
