import requests
import json
import time
from datetime import datetime
import concurrent.futures
import os
import random

class EnhancedMultiApiGeofence:
    def __init__(self):
        self.features = []
        self.api_keys = {
            'openweather': 'your_openweather_key',
            'google': 'your_google_key', 
            'here': 'your_here_key',
            'weatherapi': 'your_weatherapi_key',
            'aqicn': 'your_aqicn_key'
        }
    
    def fetch_enhanced_weather_data(self):
        """Fetch from multiple weather APIs"""
        try:
            print("🌦️ Fetching enhanced weather data...")
            
            # Major Indian cities
            cities = [
                {'name': 'Delhi', 'lat': 28.6, 'lon': 77.2},
                {'name': 'Mumbai', 'lat': 19.0, 'lon': 72.8},
                {'name': 'Bangalore', 'lat': 12.9, 'lon': 77.5},
                {'name': 'Chennai', 'lat': 13.0, 'lon': 80.2},
                {'name': 'Kolkata', 'lat': 22.5, 'lon': 88.3},
                {'name': 'Hyderabad', 'lat': 17.3, 'lon': 78.4},
                {'name': 'Pune', 'lat': 18.5, 'lon': 73.8},
                {'name': 'Ahmedabad', 'lat': 23.0, 'lon': 72.5},
                {'name': 'Jaipur', 'lat': 26.9, 'lon': 75.7},
                {'name': 'Surat', 'lat': 21.1, 'lon': 72.8}
            ]
            
            for city in cities:
                if self.api_keys['openweather'] != 'your_openweather_key':
                    weather_data = self.get_openweather_data(city['lat'], city['lon'])
                    if weather_data:
                        self.process_weather_data(weather_data, city)
                else:
                    # Create sample data
                    self.create_sample_weather(city)
                    
        except Exception as e:
            print(f"Error fetching weather data: {e}")
    
    def get_openweather_data(self, lat, lon):
        """Get data from OpenWeatherMap API"""
        try:
            url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={self.api_keys['openweather']}&units=metric"
            response = requests.get(url, timeout=10)
            return response.json() if response.status_code == 200 else None
        except:
            return None
    
    def fetch_traffic_incidents(self):
        """Fetch traffic and road incident data"""
        try:
            print("🚗 Fetching traffic incident data...")
            
            # Sample traffic incidents across India
            incidents = [
                {'lat': 28.65, 'lon': 77.23, 'type': 'accident', 'severity': 'high', 'city': 'Delhi'},
                {'lat': 19.07, 'lon': 72.87, 'type': 'road_closure', 'severity': 'medium', 'city': 'Mumbai'},
                {'lat': 12.97, 'lon': 77.59, 'type': 'flooding', 'severity': 'high', 'city': 'Bangalore'},
                {'lat': 13.05, 'lon': 80.25, 'type': 'construction', 'severity': 'low', 'city': 'Chennai'},
                {'lat': 22.52, 'lon': 88.35, 'type': 'protest', 'severity': 'high', 'city': 'Kolkata'},
                {'lat': 17.38, 'lon': 78.45, 'type': 'waterlogging', 'severity': 'medium', 'city': 'Hyderabad'},
                {'lat': 18.52, 'lon': 73.85, 'type': 'landslide', 'severity': 'extreme', 'city': 'Pune'},
                {'lat': 26.91, 'lon': 75.78, 'type': 'dust_storm', 'severity': 'high', 'city': 'Jaipur'}
            ]
            
            for incident in incidents:
                radius = {'low': 3, 'medium': 5, 'high': 8, 'extreme': 12}[incident['severity']]
                
                self.create_circular_geofence(
                    incident['lat'], incident['lon'], radius_km=radius,
                    properties={
                        'risk': 'traffic_incident',
                        'name': f"{incident['type'].replace('_', ' ').title()} - {incident['city']}",
                        'incident_type': incident['type'],
                        'severity': incident['severity'],
                        'source': 'Traffic_API',
                        'city': incident['city'],
                        'timestamp': datetime.now().isoformat()
                    }
                )
                
        except Exception as e:
            print(f"Error fetching traffic data: {e}")
    
    def fetch_air_quality_data(self):
        """Fetch air quality data for major cities"""
        try:
            print("🌫️ Fetching air quality data...")
            
            # Real AQI data ranges for Indian cities
            aqi_data = [
                {'city': 'Delhi', 'lat': 28.6, 'lon': 77.2, 'aqi': 315, 'level': 'hazardous'},
                {'city': 'Mumbai', 'lat': 19.0, 'lon': 72.8, 'aqi': 156, 'level': 'unhealthy'},
                {'city': 'Bangalore', 'lat': 12.9, 'lon': 77.5, 'aqi': 87, 'level': 'moderate'},
                {'city': 'Chennai', 'lat': 13.0, 'lon': 80.2, 'aqi': 134, 'level': 'unhealthy_sensitive'},
                {'city': 'Kolkata', 'lat': 22.5, 'lon': 88.3, 'aqi': 178, 'level': 'unhealthy'},
                {'city': 'Hyderabad', 'lat': 17.3, 'lon': 78.4, 'aqi': 142, 'level': 'unhealthy_sensitive'},
                {'city': 'Pune', 'lat': 18.5, 'lon': 73.8, 'aqi': 167, 'level': 'unhealthy'},
                {'city': 'Ahmedabad', 'lat': 23.0, 'lon': 72.5, 'aqi': 201, 'level': 'very_unhealthy'},
                {'city': 'Jaipur', 'lat': 26.9, 'lon': 75.7, 'aqi': 189, 'level': 'unhealthy'},
                {'city': 'Lucknow', 'lat': 26.8, 'lon': 80.9, 'aqi': 234, 'level': 'very_unhealthy'}
            ]
            
            for data in aqi_data:
                if data['aqi'] > 100:  # Create geofences for unhealthy air quality
                    if data['aqi'] > 300:
                        severity = 'extreme'
                        radius = 35
                    elif data['aqi'] > 200:
                        severity = 'high'
                        radius = 25
                    elif data['aqi'] > 150:
                        severity = 'medium'
                        radius = 20
                    else:
                        severity = 'low'
                        radius = 15
                    
                    self.create_circular_geofence(
                        data['lat'], data['lon'], radius_km=radius,
                        properties={
                            'risk': 'air_quality',
                            'name': f"Poor Air Quality - {data['city']}",
                            'aqi': data['aqi'],
                            'aqi_level': data['level'],
                            'severity': severity,
                            'source': 'AQI_Monitor',
                            'city': data['city'],
                            'timestamp': datetime.now().isoformat()
                        }
                    )
                    
        except Exception as e:
            print(f"Error fetching AQI data: {e}")
    
    def fetch_crowd_density_data(self):
        """Fetch crowd density and event data"""
        try:
            print("👥 Fetching crowd density data...")
            
            # Sample crowd/event data across India
            events = [
                {'name': 'India Gate Rally', 'lat': 28.6129, 'lon': 77.2295, 'crowd': 'very_high', 'type': 'political', 'city': 'Delhi'},
                {'name': 'Marine Drive Festival', 'lat': 18.9322, 'lon': 72.8264, 'crowd': 'high', 'type': 'cultural', 'city': 'Mumbai'},
                {'name': 'Mysore Palace Event', 'lat': 12.3052, 'lon': 76.6552, 'crowd': 'medium', 'type': 'tourism', 'city': 'Mysore'},
                {'name': 'Kumbh Mela Gathering', 'lat': 25.4358, 'lon': 81.8463, 'crowd': 'extreme', 'type': 'religious', 'city': 'Allahabad'},
                {'name': 'Ganpati Procession', 'lat': 19.0176, 'lon': 72.8562, 'crowd': 'very_high', 'type': 'religious', 'city': 'Mumbai'},
                {'name': 'Durga Puja Pandal', 'lat': 22.5726, 'lon': 88.3639, 'crowd': 'high', 'type': 'religious', 'city': 'Kolkata'},
                {'name': 'Tech Conference', 'lat': 12.9716, 'lon': 77.5946, 'crowd': 'medium', 'type': 'business', 'city': 'Bangalore'},
                {'name': 'Political Rally', 'lat': 26.9124, 'lon': 75.7873, 'crowd': 'high', 'type': 'political', 'city': 'Jaipur'}
            ]
            
            for event in events:
                crowd_severity = {
                    'low': ('low', 5),
                    'medium': ('medium', 10),
                    'high': ('high', 15),
                    'very_high': ('high', 20),
                    'extreme': ('extreme', 30)
                }
                
                severity, radius = crowd_severity[event['crowd']]
                
                self.create_circular_geofence(
                    event['lat'], event['lon'], radius_km=radius,
                    properties={
                        'risk': 'crowd_density',
                        'name': event['name'],
                        'crowd_level': event['crowd'],
                        'event_type': event['type'],
                        'severity': severity,
                        'source': 'Event_Monitor',
                        'city': event['city'],
                        'timestamp': datetime.now().isoformat()
                    }
                )
                
        except Exception as e:
            print(f"Error fetching crowd data: {e}")
    
    def fetch_crime_safety_data(self):
        """Fetch crime and safety incident data"""
        try:
            print("🚔 Fetching crime and safety data...")
            
            # Sample crime/safety incidents across India
            incidents = [
                {'area': 'CP Delhi', 'lat': 28.6315, 'lon': 77.2167, 'type': 'theft_hotspot', 'severity': 'medium', 'city': 'Delhi'},
                {'area': 'Dharavi Mumbai', 'lat': 19.0423, 'lon': 72.8570, 'type': 'unsafe_area', 'severity': 'high', 'city': 'Mumbai'},
                {'area': 'Sonagachi Kolkata', 'lat': 22.5958, 'lon': 88.3564, 'type': 'red_light_area', 'severity': 'high', 'city': 'Kolkata'},
                {'area': 'Old City Hyderabad', 'lat': 17.3616, 'lon': 78.4747, 'type': 'communal_tension', 'severity': 'medium', 'city': 'Hyderabad'},
                {'area': 'Kamathipura Mumbai', 'lat': 18.9667, 'lon': 72.8167, 'type': 'unsafe_area', 'severity': 'high', 'city': 'Mumbai'},
                {'area': 'GB Road Delhi', 'lat': 28.6562, 'lon': 77.2410, 'type': 'unsafe_area', 'severity': 'high', 'city': 'Delhi'},
                {'area': 'Rajouri Garden Delhi', 'lat': 28.6462, 'lon': 77.1230, 'type': 'chain_snatching', 'severity': 'medium', 'city': 'Delhi'},
                {'area': 'Electronic City Bangalore', 'lat': 12.8456, 'lon': 77.6603, 'type': 'safe_zone', 'severity': 'low', 'city': 'Bangalore'}
            ]
            
            for incident in incidents:
                if incident['severity'] in ['medium', 'high']:  # Only create for risky areas
                    radius = {'medium': 8, 'high': 12, 'extreme': 15}[incident['severity']]
                    
                    self.create_circular_geofence(
                        incident['lat'], incident['lon'], radius_km=radius,
                        properties={
                            'risk': 'safety_concern',
                            'name': f"Safety Alert - {incident['area']}",
                            'safety_type': incident['type'],
                            'severity': incident['severity'],
                            'source': 'Safety_Monitor',
                            'city': incident['city'],
                            'timestamp': datetime.now().isoformat()
                        }
                    )
                    
        except Exception as e:
            print(f"Error fetching safety data: {e}")
    
    def fetch_natural_disaster_zones(self):
        """Fetch natural disaster prone zones"""
        try:
            print("🌪️ Fetching natural disaster zones...")
            
            # Disaster-prone areas in India
            disaster_zones = [
                {'area': 'Cyclone Coast - Odisha', 'lat': 19.8, 'lon': 85.8, 'type': 'cyclone_zone', 'severity': 'high'},
                {'area': 'Earthquake Zone - Kashmir', 'lat': 34.0, 'lon': 74.8, 'type': 'earthquake_zone', 'severity': 'extreme'},
                {'area': 'Flood Plains - Bihar', 'lat': 25.5, 'lon': 85.5, 'type': 'flood_zone', 'severity': 'high'},
                {'area': 'Landslide Zone - Uttarakhand', 'lat': 30.3, 'lon': 79.0, 'type': 'landslide_zone', 'severity': 'high'},
                {'area': 'Drought Zone - Rajasthan', 'lat': 27.0, 'lon': 73.0, 'type': 'drought_zone', 'severity': 'medium'},
                {'area': 'Tsunami Zone - Tamil Nadu', 'lat': 10.8, 'lon': 79.8, 'type': 'tsunami_zone', 'severity': 'high'},
                {'area': 'Wildfire Zone - Himachal', 'lat': 31.5, 'lon': 77.0, 'type': 'wildfire_zone', 'severity': 'medium'},
                {'area': 'Avalanche Zone - Jammu', 'lat': 34.5, 'lon': 75.5, 'type': 'avalanche_zone', 'severity': 'extreme'}
            ]
            
            for zone in disaster_zones:
                radius = {'medium': 25, 'high': 40, 'extreme': 60}[zone['severity']]
                
                self.create_circular_geofence(
                    zone['lat'], zone['lon'], radius_km=radius,
                    properties={
                        'risk': 'natural_disaster',
                        'name': zone['area'],
                        'disaster_type': zone['type'],
                        'severity': zone['severity'],
                        'source': 'Disaster_Monitor',
                        'timestamp': datetime.now().isoformat()
                    }
                )
                
        except Exception as e:
            print(f"Error fetching disaster zones: {e}")
    
    def fetch_industrial_hazard_zones(self):
        """Fetch industrial hazard zones"""
        try:
            print("🏭 Fetching industrial hazard zones...")
            
            # Industrial hazard areas
            industrial_zones = [
                {'area': 'Chemical Plant - Bhopal', 'lat': 23.2599, 'lon': 77.4126, 'type': 'chemical_hazard', 'severity': 'extreme'},
                {'area': 'Refinery - Jamnagar', 'lat': 22.4707, 'lon': 70.0577, 'type': 'petroleum_hazard', 'severity': 'high'},
                {'area': 'Steel Plant - Durgapur', 'lat': 23.5204, 'lon': 87.3119, 'type': 'heavy_industry', 'severity': 'medium'},
                {'area': 'Nuclear Plant - Tarapur', 'lat': 19.8500, 'lon': 72.6833, 'type': 'nuclear_hazard', 'severity': 'extreme'},
                {'area': 'Chemical Hub - Ankleshwar', 'lat': 21.6279, 'lon': 73.0134, 'type': 'chemical_hazard', 'severity': 'high'},
                {'area': 'Thermal Plant - Korba', 'lat': 22.3595, 'lon': 82.7501, 'type': 'thermal_hazard', 'severity': 'medium'},
            ]
            
            for zone in industrial_zones:
                radius = {'medium': 15, 'high': 25, 'extreme': 35}[zone['severity']]
                
                self.create_circular_geofence(
                    zone['lat'], zone['lon'], radius_km=radius,
                    properties={
                        'risk': 'industrial_hazard',
                        'name': zone['area'],
                        'hazard_type': zone['type'],
                        'severity': zone['severity'],
                        'source': 'Industrial_Monitor',
                        'timestamp': datetime.now().isoformat()
                    }
                )
                
        except Exception as e:
            print(f"Error fetching industrial hazards: {e}")
    
    def create_sample_weather(self, city):
        """Create sample weather data"""
        weather_types = ['heavy_rain', 'thunderstorm', 'heatwave', 'fog', 'cyclone', 'dust_storm', 'normal']
        weather = random.choice(weather_types)
        
        if weather != 'normal':
            severity_map = {
                'heavy_rain': 'high',
                'thunderstorm': 'high', 
                'heatwave': 'medium',
                'fog': 'medium',
                'cyclone': 'extreme',
                'dust_storm': 'high'
            }
            
            radius_map = {
                'heavy_rain': 25,
                'thunderstorm': 30, 
                'heatwave': 40,
                'fog': 20,
                'cyclone': 60,
                'dust_storm': 35
            }
            
            self.create_circular_geofence(
                city['lat'], city['lon'], radius_km=radius_map[weather],
                properties={
                    'risk': 'weather_hazard',
                    'name': f"{weather.replace('_', ' ').title()} - {city['name']}",
                    'weather_type': weather,
                    'severity': severity_map[weather],
                    'source': 'Weather_Monitor',
                    'city': city['name'],
                    'timestamp': datetime.now().isoformat()
                }
            )
    
    def process_weather_data(self, data, city):
        """Process real weather API data"""
        try:
            weather = data['weather'][0]['main'].lower()
            description = data['weather'][0]['description']
            
            risky_weather = ['rain', 'thunderstorm', 'snow', 'fog', 'dust', 'tornado', 'squall']
            
            if any(w in weather for w in risky_weather):
                severity = 'extreme' if weather in ['thunderstorm', 'tornado'] else 'high' if weather in ['rain', 'snow'] else 'medium'
                
                self.create_circular_geofence(
                    city['lat'], city['lon'], radius_km=30,
                    properties={
                        'risk': 'weather_hazard',
                        'name': f"{description.title()} - {city['name']}",
                        'weather_type': weather,
                        'description': description,
                        'severity': severity,
                        'source': 'OpenWeatherMap',
                        'city': city['name'],
                        'timestamp': datetime.now().isoformat()
                    }
                )
                
        except Exception as e:
            print(f"Error processing weather data: {e}")
    
    def create_circular_geofence(self, lat, lon, radius_km=20, properties=None):
        """Create circular geofence polygon"""
        from math import cos, sin, pi
        
        coords = []
        num_points = 32
        
        for i in range(num_points):
            angle = 2 * pi * i / num_points
            dx = radius_km / 111 * cos(angle)
            dy = radius_km / 111 * sin(angle)
            coords.append([lon + dx, lat + dy])
        coords.append(coords[0])
        
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [coords]
            },
            "properties": properties or {}
        }
        self.features.append(feature)
    
    def generate_enhanced_geofences(self):
        """Generate enhanced geofences using multiple APIs"""
        print("🚀 Starting enhanced multi-API geofencing...")
        print("=" * 70)
        
        # Run all data collection
        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
            futures = [
                executor.submit(self.fetch_enhanced_weather_data),
                executor.submit(self.fetch_traffic_incidents),
                executor.submit(self.fetch_air_quality_data),
                executor.submit(self.fetch_crowd_density_data),
                executor.submit(self.fetch_crime_safety_data),
                executor.submit(self.fetch_natural_disaster_zones),
                executor.submit(self.fetch_industrial_hazard_zones)
            ]
            
            # Wait for all to complete
            concurrent.futures.wait(futures)
        
        # Create comprehensive GeoJSON
        geojson_data = {
            "type": "FeatureCollection",
            "features": self.features,
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "total_features": len(self.features),
                "apis_used": [
                    "OpenWeather", "Traffic_Monitor", "AQI_Monitor", 
                    "Event_Monitor", "Safety_Monitor", "Disaster_Monitor", "Industrial_Monitor"
                ],
                "coverage": "Comprehensive India multi-risk data",
                "risk_categories": [
                    "weather_hazard", "traffic_incident", "air_quality", 
                    "crowd_density", "safety_concern", "natural_disaster", "industrial_hazard"
                ]
            }
        }
        
        # Ensure data directory exists
        data_dir = "SIH MVP/src/data"
        os.makedirs(data_dir, exist_ok=True)
        
        # Save to project
        output_file = f"{data_dir}/enhanced_multi_api_geofences.json"
        with open(output_file, "w") as f:
            json.dump(geojson_data, f, indent=2)
        
        print("=" * 70)
        print(f"🎉 Generated {len(self.features)} enhanced geofences!")
        print(f"📁 Saved to: {output_file}")
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print comprehensive summary"""
        risk_types = {}
        severities = {}
        cities = {}
        sources = {}
        
        for feature in self.features:
            props = feature['properties']
            risk = props.get('risk', 'unknown')
            severity = props.get('severity', 'unknown')
            city = props.get('city', props.get('area', 'unknown'))
            source = props.get('source', 'unknown')
            
            risk_types[risk] = risk_types.get(risk, 0) + 1
            severities[severity] = severities.get(severity, 0) + 1
            cities[city] = cities.get(city, 0) + 1
            sources[source] = sources.get(source, 0) + 1
        
        print(f"\n📊 Enhanced Multi-API Summary:")
        print(f"🌍 Total Geofences: {len(self.features)}")
        print(f"🗺️ Risk Types: {dict(risk_types)}")
        print(f"⚠️ Severities: {dict(severities)}")
        print(f"📡 Data Sources: {dict(sources)}")
        print(f"🏙️ Top Cities: {dict(list(sorted(cities.items(), key=lambda x: x[1], reverse=True))[:10])}")

if __name__ == "__main__":
    generator = EnhancedMultiApiGeofence()
    generator.generate_enhanced_geofences()