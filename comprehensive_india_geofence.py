import requests
import json
import time
from math import cos, sin, pi, sqrt, radians, atan2
import xml.etree.ElementTree as ET
from datetime import datetime
import concurrent.futures
import csv
from io import StringIO
import os

class ComprehensiveIndiaGeofence:
    def __init__(self):
        self.features = []
        self.indian_states = {
            'Andhra Pradesh': {'lat': 15.9129, 'lon': 79.7400},
            'Arunachal Pradesh': {'lat': 28.2180, 'lon': 94.7278},
            'Assam': {'lat': 26.2006, 'lon': 92.9376},
            'Bihar': {'lat': 25.0961, 'lon': 85.3131},
            'Chhattisgarh': {'lat': 21.2787, 'lon': 81.8661},
            'Goa': {'lat': 15.2993, 'lon': 74.1240},
            'Gujarat': {'lat': 23.0225, 'lon': 72.5714},
            'Haryana': {'lat': 29.0588, 'lon': 76.0856},
            'Himachal Pradesh': {'lat': 31.1048, 'lon': 77.1734},
            'Jharkhand': {'lat': 23.6102, 'lon': 85.2799},
            'Karnataka': {'lat': 15.3173, 'lon': 75.7139},
            'Kerala': {'lat': 10.8505, 'lon': 76.2711},
            'Madhya Pradesh': {'lat': 22.9734, 'lon': 78.6569},
            'Maharashtra': {'lat': 19.7515, 'lon': 75.7139},
            'Manipur': {'lat': 24.6637, 'lon': 93.9063},
            'Meghalaya': {'lat': 25.4670, 'lon': 91.3662},
            'Mizoram': {'lat': 23.1645, 'lon': 92.9376},
            'Nagaland': {'lat': 26.1584, 'lon': 94.5624},
            'Odisha': {'lat': 20.9517, 'lon': 85.0985},
            'Punjab': {'lat': 31.1471, 'lon': 75.3412},
            'Rajasthan': {'lat': 27.0238, 'lon': 74.2179},
            'Sikkim': {'lat': 27.5330, 'lon': 88.5122},
            'Tamil Nadu': {'lat': 11.1271, 'lon': 78.6569},
            'Telangana': {'lat': 18.1124, 'lon': 79.0193},
            'Tripura': {'lat': 23.9408, 'lon': 91.9882},
            'Uttar Pradesh': {'lat': 26.8467, 'lon': 80.9462},
            'Uttarakhand': {'lat': 30.0668, 'lon': 79.0193},
            'West Bengal': {'lat': 22.9868, 'lon': 87.8550},
            'Delhi': {'lat': 28.7041, 'lon': 77.1025},
            'Jammu and Kashmir': {'lat': 34.0837, 'lon': 74.7973},
            'Ladakh': {'lat': 34.1526, 'lon': 77.5771}
        }
        
        # Famous dangerous locations across India
        self.dangerous_locations = [
            # Himachal Pradesh
            {'name': 'Rohtang Pass', 'lat': 32.3726, 'lon': 77.2497, 'state': 'Himachal Pradesh', 'elevation': 3978},
            {'name': 'Baralacha La', 'lat': 32.7367, 'lon': 77.4783, 'state': 'Himachal Pradesh', 'elevation': 4890},
            {'name': 'Kunzum Pass', 'lat': 32.3081, 'lon': 77.6394, 'state': 'Himachal Pradesh', 'elevation': 4551},
            
            # Uttarakhand
            {'name': 'Kedarnath Route', 'lat': 30.7346, 'lon': 79.0669, 'state': 'Uttarakhand', 'elevation': 3583},
            {'name': 'Valley of Flowers', 'lat': 30.7268, 'lon': 79.6034, 'state': 'Uttarakhand', 'elevation': 3658},
            {'name': 'Badrinath Route', 'lat': 30.7433, 'lon': 79.4938, 'state': 'Uttarakhand', 'elevation': 3133},
            
            # Jammu & Kashmir / Ladakh  
            {'name': 'Amarnath Route', 'lat': 34.1342, 'lon': 75.4126, 'state': 'Jammu and Kashmir', 'elevation': 3888},
            {'name': 'Vaishno Devi Trek', 'lat': 33.0309, 'lon': 74.9269, 'state': 'Jammu and Kashmir', 'elevation': 1560},
            {'name': 'Khardung La', 'lat': 34.2782, 'lon': 77.6033, 'state': 'Ladakh', 'elevation': 5359},
            
            # Western Ghats
            {'name': 'Munnar Hills', 'lat': 10.0889, 'lon': 77.0595, 'state': 'Kerala', 'elevation': 1600},
            {'name': 'Kodaikanal Hills', 'lat': 10.2381, 'lon': 77.4892, 'state': 'Tamil Nadu', 'elevation': 2133},
            {'name': 'Ooty Hills', 'lat': 11.4064, 'lon': 76.6932, 'state': 'Tamil Nadu', 'elevation': 2240},
        ]
    
    def fetch_sample_weather_data(self):
        """Generate sample weather hazards for demonstration"""
        print("🌦️ Generating sample weather hazards...")
        
        weather_zones = [
            {'state': 'Delhi', 'lat': 28.6, 'lon': 77.2, 'warning': 'heavy rain', 'severity': 'high'},
            {'state': 'Mumbai', 'lat': 19.0, 'lon': 72.8, 'warning': 'cyclone', 'severity': 'extreme'},
            {'state': 'Kolkata', 'lat': 22.5, 'lon': 88.3, 'warning': 'thunderstorm', 'severity': 'medium'},
            {'state': 'Chennai', 'lat': 13.0, 'lon': 80.2, 'warning': 'heavy rain', 'severity': 'high'},
            {'state': 'Bangalore', 'lat': 12.9, 'lon': 77.5, 'warning': 'moderate rain', 'severity': 'low'},
        ]
        
        for zone in weather_zones:
            self.create_circular_geofence(
                zone['lat'], zone['lon'], radius_km=35,
                properties={
                    'risk': 'weather_hazard',
                    'name': f"{zone['state']} Weather Alert",
                    'warning': zone['warning'],
                    'severity': zone['severity'],
                    'source': 'Sample_IMD',
                    'state': zone['state'],
                    'timestamp': datetime.now().isoformat()
                }
            )
    
    def fetch_sample_fire_data(self):
        """Generate sample fire hazards"""
        print("🔥 Generating sample fire hazards...")
        
        fire_zones = [
            {'state': 'Madhya Pradesh', 'lat': 23.0, 'lon': 78.0, 'confidence': 95},
            {'state': 'Chhattisgarh', 'lat': 21.2, 'lon': 81.8, 'confidence': 89},
            {'state': 'Odisha', 'lat': 20.9, 'lon': 85.0, 'confidence': 92},
            {'state': 'Jharkhand', 'lat': 23.6, 'lon': 85.2, 'confidence': 87},
        ]
        
        for zone in fire_zones:
            severity = 'high' if zone['confidence'] >= 90 else 'medium'
            self.create_circular_geofence(
                zone['lat'], zone['lon'], radius_km=20,
                properties={
                    'risk': 'fire_hazard',
                    'name': f"Forest Fire - {zone['state']}",
                    'confidence': zone['confidence'],
                    'severity': severity,
                    'source': 'Sample_NASA_FIRMS',
                    'state': zone['state'],
                    'timestamp': datetime.now().isoformat()
                }
            )
    
    def analyze_elevation_hazards(self):
        """Create elevation hazards for dangerous locations"""
        print("🏔️ Creating elevation hazards...")
        
        for location in self.dangerous_locations:
            # Determine severity based on elevation
            elevation = location['elevation']
            if elevation > 4500:
                severity = 'extreme'
                radius = 60
                hazards = ['altitude_sickness', 'avalanche', 'extreme_cold']
            elif elevation > 3000:
                severity = 'high'
                radius = 40
                hazards = ['altitude_sickness', 'rockfall', 'weather_change']
            elif elevation > 1500:
                severity = 'medium'
                radius = 25
                hazards = ['steep_terrain', 'landslide']
            else:
                severity = 'low'
                radius = 15
                hazards = ['moderate_terrain']
            
            self.create_circular_geofence(
                location['lat'], location['lon'], radius_km=radius,
                properties={
                    'risk': 'elevation_hazard',
                    'name': location['name'],
                    'state': location['state'],
                    'elevation': elevation,
                    'severity': severity,
                    'hazards': hazards,
                    'source': 'Elevation_Analysis',
                    'timestamp': datetime.now().isoformat()
                }
            )
    
    def generate_sample_disasters(self):
        """Generate sample disaster alerts"""
        print("🚨 Generating sample disaster alerts...")
        
        disasters = [
            {'state': 'Bihar', 'lat': 25.0, 'lon': 85.3, 'type': 'flood', 'severity': 'high'},
            {'state': 'Gujarat', 'lat': 23.0, 'lon': 72.5, 'type': 'earthquake', 'severity': 'medium'},
            {'state': 'West Bengal', 'lat': 22.9, 'lon': 87.8, 'type': 'cyclone', 'severity': 'extreme'},
        ]
        
        for disaster in disasters:
            self.create_circular_geofence(
                disaster['lat'], disaster['lon'], radius_km=50,
                properties={
                    'risk': 'disaster_alert',
                    'name': f"{disaster['type'].title()} Alert - {disaster['state']}",
                    'disaster_type': disaster['type'],
                    'severity': disaster['severity'],
                    'source': 'Sample_GDACS',
                    'state': disaster['state'],
                    'timestamp': datetime.now().isoformat()
                }
            )
    
    def create_circular_geofence(self, lat, lon, radius_km=20, properties=None):
        """Create circular geofence polygon"""
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
    
    def generate_comprehensive_india_geofences(self):
        """Generate comprehensive geofences for India"""
        print("🇮🇳 Starting comprehensive India geofencing...")
        print("=" * 60)
        
        # Generate all sample data
        self.fetch_sample_weather_data()
        self.fetch_sample_fire_data()
        self.analyze_elevation_hazards()
        self.generate_sample_disasters()
        
        # Create comprehensive GeoJSON
        geojson_data = {
            "type": "FeatureCollection",
            "features": self.features,
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "total_features": len(self.features),
                "coverage": "All Indian States",
                "sources": ["Sample_IMD", "Sample_GDACS", "Sample_NASA_FIRMS", "Elevation_Analysis"],
                "accuracy": "demonstration"
            }
        }
        
        # Ensure data directory exists
        data_dir = "SIH MVP/src/data"
        os.makedirs(data_dir, exist_ok=True)
        
        # Save to project
        output_file = f"{data_dir}/comprehensive_india_geofences.json"
        with open(output_file, "w") as f:
            json.dump(geojson_data, f, indent=2)
        
        print("=" * 60)
        print(f"🎉 Generated {len(self.features)} comprehensive geofences!")
        print(f"📁 Saved to: {output_file}")
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print summary of generated geofences"""
        sources = {}
        severities = {}
        states = {}
        risks = {}
        
        for feature in self.features:
            props = feature['properties']
            
            source = props.get('source', 'unknown')
            severity = props.get('severity', 'unknown')
            state = props.get('state', 'unknown')
            risk = props.get('risk', 'unknown')
            
            sources[source] = sources.get(source, 0) + 1
            severities[severity] = severities.get(severity, 0) + 1
            states[state] = states.get(state, 0) + 1
            risks[risk] = risks.get(risk, 0) + 1
        
        print("\n📊 Summary:")
        print(f"🌍 Total Geofences: {len(self.features)}")
        print(f"📡 Sources: {dict(sources)}")
        print(f"⚠️ Severities: {dict(severities)}")
        print(f"🗺️ Risk Types: {dict(risks)}")
        print(f"🏛️ States: {len(states)} covered")

if __name__ == "__main__":
    generator = ComprehensiveIndiaGeofence()
    generator.generate_comprehensive_india_geofences()