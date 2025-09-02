import requests
import json
import time
from math import cos, sin, pi

# Bounding box for India
MIN_LAT, MAX_LAT = 6.5, 37.1
MIN_LON, MAX_LON = 68.1, 97.4

# Grid resolution (~20km)
LAT_STEP = 0.18
LON_STEP = 0.18

# Elevation threshold (1000m)
ELEVATION_THRESHOLD = 1000

# Geofence radius (20km)
RADIUS_KM = 20

def get_elevation(lat, lon):
    """Get elevation from OpenTopoData API"""
    url = f"https://api.opentopodata.org/v1/test-dataset?locations={lat},{lon}"
    try:
        resp = requests.get(url, timeout=10)
        data = resp.json()
        if data['status'] == 'OK' and data['results']:
            return data['results'][0]['elevation']
        return None
    except Exception as e:
        print(f"Error fetching elevation for {lat},{lon}: {e}")
        return None

def create_circle_geojson(lat, lon, radius_km=RADIUS_KM, num_points=32):
    """Create a circular polygon in GeoJSON format"""
    coords = []
    for i in range(num_points):
        angle = 2 * pi * i / num_points
        # Approximate conversion: 1 degree ≈ 111km
        dx = radius_km / 111 * cos(angle)
        dy = radius_km / 111 * sin(angle)
        coords.append([lon + dx, lat + dy])
    coords.append(coords[0])  # Close the polygon
    
    return {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [coords]
        },
        "properties": {
            "risk": "elevation",
            "elevation": None,
            "location": f"{lat},{lon}"
        }
    }

def main():
    features = []
    total_points = int((MAX_LAT - MIN_LAT) / LAT_STEP) * int((MAX_LON - MIN_LON) / LON_STEP)
    current_point = 0
    
    print(f"Scanning {total_points} points across India...")
    print("This will take a while due to API rate limits...")
    
    lat = MIN_LAT
    while lat <= MAX_LAT:
        lon = MIN_LON
        while lon <= MAX_LON:
            current_point += 1
            print(f"Progress: {current_point}/{total_points} ({lat:.2f}, {lon:.2f})")
            
            elev = get_elevation(lat, lon)
            if elev is not None and elev > ELEVATION_THRESHOLD:
                print(f"  ✓ High elevation found: {elev}m")
                circle = create_circle_geojson(lat, lon)
                circle['properties']['elevation'] = elev
                features.append(circle)
            
            # Rate limiting - be nice to the API
            time.sleep(1)
            
            lon += LON_STEP
        lat += LAT_STEP
    
    # Create GeoJSON FeatureCollection
    geojson_data = {
        "type": "FeatureCollection",
        "features": features
    }
    
    # Save to file
    output_file = "SIH MVP/src/data/india_elevation_geofences.json"
    with open(output_file, "w") as f:
        json.dump(geojson_data, f, indent=2)
    
    print(f"\n✅ Done! Created {len(features)} elevation geofences")
    print(f"📁 Saved to: {output_file}")

if __name__ == "__main__":
    main()