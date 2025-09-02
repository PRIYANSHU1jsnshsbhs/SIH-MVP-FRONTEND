# 🌍 SIH MVP - Comprehensive India Geofencing System

A real-time geofencing application for comprehensive risk monitoring across India, built for the Smart India Hackathon (SIH). This application provides real-time monitoring of various hazards including weather, crime, industrial risks, natural disasters, and more.

## 🚀 Features

### Real-Time Monitoring
- **Weather Hazards**: Heat waves, heavy rain, fog, dust storms, cyclones
- **Air Quality**: PM2.5, PM10, AQI monitoring with health advisories
- **Natural Disasters**: Earthquakes, floods, landslides, droughts
- **Crime & Security**: High-risk zones, border security, Naxal-affected areas
- **Industrial Hazards**: Nuclear facilities, chemical plants, mining operations
- **Traffic Incidents**: Real-time traffic alerts and road conditions
- **Crowd Density**: Festival monitoring, public gatherings
- **Infrastructure**: Power grids, energy facilities, ports, airports

### Geographic Coverage
- **200+ Cities** across all Indian states and union territories
- **Comprehensive Crime Database** with 100+ high-risk zones
- **Border Security Zones** including Kashmir, Northeast, Myanmar borders
- **Naxal-Affected Areas** with real-time threat assessment
- **Tourist Safety Zones** covering major destinations
- **Transportation Hubs** including airports, railway stations

### Interactive Map Features
- **Dynamic Geofences** with risk-based color coding
- **Real-time Updates** with automatic data refresh
- **Detailed Popups** with hazard-specific information
- **Layer Controls** for filtering different risk types
- **Responsive Design** for mobile and desktop

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite
- **Mapping**: Leaflet with custom geofencing
- **Styling**: Tailwind CSS
- **APIs**: Weather API, simulated government data sources
- **State Management**: React Hooks
- **Build Tool**: Vite with HMR

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **Weather API Key** (from WeatherAPI.com)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/PRIYANSHU1jsnshsbhs/SIH-MVP-FRONTEND.git
cd "SIH MVP"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_WEATHER_API_KEY=your_weather_api_key_here
```

**Get your Weather API key:**
1. Visit [WeatherAPI.com](https://www.weatherapi.com/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env` file

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

## 🗂️ Project Structure

```
SIH MVP/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── Map.jsx              # Main map component
│   │   ├── Sidebar.jsx          # Control sidebar
│   │   └── StyleSwitchButton.jsx # Map style switcher
│   ├── data/
│   │   ├── comprehensive_india_geofences.json
│   │   ├── enhanced_multi_api_geofences.json
│   │   ├── india_elevation_geofences.json
│   │   └── mountain_hazard_geofences.json
│   ├── services/
│   │   └── apiServices.js       # API integration
│   ├── utils/
│   │   └── realTimeAPIs.jsx     # Core geofencing logic
│   ├── App.jsx                  # Main application
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.cjs
└── README.md
```

## 🎯 How It Works

### 1. Data Collection & Processing

The application aggregates data from multiple sources:

```javascript
// Real-time data fetching from multiple APIs
const [
  weather,      // Weather hazards and conditions
  earthquakes,  // Seismic activity monitoring
  fires,        // Wildfire risk assessment
  traffic,      // Road incidents and congestion
  industrial,   // Industrial facility risks
  crime,        // Security threat zones
  health,       // Epidemiological risks
  power,        // Energy infrastructure
] = await Promise.all([...])
```

### 2. Geofence Generation

Each risk type is converted into geographic boundaries:

```javascript
const createGeofence = ({ name, lat, lng, radius, risk, severity }) => {
  // Creates circular or polygonal boundaries
  // Color-coded based on risk severity
  // Interactive popups with detailed information
}
```

### 3. Risk Assessment

Multi-layered risk evaluation:

- **Extreme**: Immediate danger, evacuation recommended
- **High**: Significant risk, extreme caution required
- **Medium**: Moderate risk, heightened awareness
- **Low**: Minor risk, general precautions

### 4. Real-Time Updates

- **Auto-refresh** every 5 minutes for weather data
- **Event-driven updates** for emergency situations
- **User-triggered refresh** for latest information

## 🌐 Data Sources

### Real APIs
- **WeatherAPI.com**: Weather conditions, air quality
- **USGS**: Earthquake monitoring
- **Government APIs**: Traffic, emergency services

### Simulated Data (For Demonstration)
- **Crime Statistics**: Based on public safety reports
- **Industrial Facilities**: Public infrastructure data
- **Border Security**: General security zone information
- **Health Risks**: Epidemiological pattern simulation

## 🎮 Usage Guide

### Basic Navigation
1. **Zoom**: Mouse wheel or touch gestures
2. **Pan**: Click and drag to move around
3. **Layer Toggle**: Use sidebar controls to filter risks
4. **Info Popup**: Click on any geofence for details

### Understanding Risk Levels

| Color | Risk Level | Action Required |
|-------|------------|----------------|
| 🔴 Red | Extreme | Immediate action/evacuation |
| 🟠 Orange | High | Extreme caution required |
| 🟡 Yellow | Medium | Heightened awareness |
| 🟢 Green | Low | General precautions |

### Feature Controls

- **🌦️ Weather**: Toggle weather-related hazards
- **🚔 Security**: Show/hide crime and security zones
- **🏭 Industrial**: Industrial facility risks
- **🌍 Natural**: Earthquakes, floods, natural disasters
- **🚗 Traffic**: Road incidents and congestion
- **👥 Crowds**: Public gathering monitoring

## 🔧 Configuration

### Adding New Risk Types

1. **Define risk data** in `realTimeAPIs.jsx`:
```javascript
const NEW_RISK_ZONES = [
  { name: "Risk Zone", lat: 28.6, lng: 77.2, type: "new_risk" }
]
```

2. **Create fetcher function**:
```javascript
export const fetchNewRiskData = async () => {
  // Process and return geofences
}
```

3. **Add to main aggregator**:
```javascript
const newRisks = await fetchNewRiskData()
```

### Customizing Map Styles

Modify `Map.jsx` to add new tile layers:

```javascript
const mapStyles = {
  satellite: "https://server.arcgisonline.com/...",
  terrain: "https://stamen-tiles-{s}.a.ssl.fastly.net/...",
  custom: "your-custom-tile-server"
}
```

## 🚨 Emergency Response Integration

The system is designed to integrate with emergency response services:

### Alert System
- **Color-coded severity** for quick assessment
- **Detailed risk information** in popups
- **Contact information** for emergency services
- **Evacuation routes** and safe zones

### Data Export
- **JSON format** for integration with other systems
- **Real-time API endpoints** for external services
- **Bulk data download** for analysis

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-feature`
3. **Commit changes**: `git commit -am 'Add new feature'`
4. **Push to branch**: `git push origin feature/new-feature`
5. **Submit pull request**

### Development Guidelines

- **Follow React best practices**
- **Use meaningful variable names**
- **Add comments for complex logic**
- **Test new features thoroughly**
- **Update documentation**

## 📊 Performance Optimization

### Data Loading
- **Lazy loading** for large datasets
- **Chunked API requests** to prevent timeouts
- **Caching strategy** for frequently accessed data
- **Progressive enhancement** for slow connections

### Map Performance
- **Efficient geofence rendering**
- **Level-of-detail** based on zoom level
- **Debounced user interactions**
- **Memory management** for large datasets

## 🔒 Security Considerations

### API Key Protection
- **All API keys** are stored in environment variables (`.env` file)
- **Never commit** the `.env` file to version control
- **Use `.env.example`** as a template for required environment variables
- **Production deployment** should use secure environment variable management

### Required Environment Variables
```bash
VITE_WEATHER_API_KEY=your_weather_api_key_here
VITE_MAPBOX_TOKEN=your_mapbox_access_token_here
```

### Security Best Practices
- **API key protection** through environment variables
- **Rate limiting** for API requests  
- **Data sanitization** for user inputs
- **Secure data transmission** over HTTPS
- **Regular token rotation** for production systems
- **Access logging** for API usage monitoring

### Important Security Notes
⚠️ **Never expose API keys in source code**  
⚠️ **The `.env` file is ignored by git** to prevent accidental commits  
⚠️ **Regenerate tokens** if accidentally exposed  
⚠️ **Use different tokens** for development and production

## 🐛 Troubleshooting

### Common Issues

**Issue**: Blank screen on startup
```bash
# Check for JavaScript errors in browser console
# Verify all dependencies are installed
npm install
```

**Issue**: Weather data not loading
```bash
# Verify API key is set correctly
echo $VITE_WEATHER_API_KEY
```

**Issue**: Build errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## 📈 Future Enhancements

- **Mobile App** using React Native
- **Real-time Notifications** via WebSocket
- **Machine Learning** for predictive analysis
- **Government API Integration** for official data
- **Multi-language Support** for regional access
- **Offline Mode** for emergency situations

## 📞 Support

For issues and support:

- **GitHub Issues**: [Create an issue](https://github.com/PRIYANSHU1jsnshsbhs/SIH-MVP-FRONTEND/issues)
- **Email**: your-email@example.com
- **Documentation**: Check this README and code comments

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Acknowledgments

- **Smart India Hackathon** for the opportunity
- **WeatherAPI.com** for weather data services
- **Leaflet** for mapping capabilities
- **React Community** for excellent documentation
- **Open Source Contributors** for various libraries

---

**Built with ❤️ for Smart India Hackathon**

*Making India safer through technology*
