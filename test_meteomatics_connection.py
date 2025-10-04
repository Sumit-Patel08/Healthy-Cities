"""
Test script to verify Meteomatics API connection
"""

import os
import sys
import requests
import base64
from datetime import datetime
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent / 'backend'
sys.path.insert(0, str(backend_dir))

def test_meteomatics_connection():
    """Test basic connection to Meteomatics API"""
    
    # Load credentials from environment
    username = "prajapati_neel"
    password = "G6d19PAz5s7i6F6I8M01"
    
    if not username or not password:
        print("❌ Error: Meteomatics credentials not found")
        return False
    
    print(f"🔑 Testing connection with username: {username}")
    
    # Set up authentication
    credentials = f"{username}:{password}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()
    
    headers = {
        'Authorization': f'Basic {encoded_credentials}',
        'User-Agent': 'CityForge-Mumbai-Pulse-Test/1.0'
    }
    
    # Test with a simple API call for Mumbai temperature
    mumbai_lat = 19.0760
    mumbai_lon = 72.8777
    now = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
    
    # Simple temperature request
    url = f"https://api.meteomatics.com/{now}/t_2m:C/{mumbai_lat},{mumbai_lon}/json"
    
    print(f"🌐 Testing API endpoint: {url}")
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        
        print(f"📊 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Connection successful!")
            print(f"📍 Location: Mumbai ({mumbai_lat}, {mumbai_lon})")
            
            if 'data' in data and data['data']:
                temp_data = data['data'][0]
                if 'coordinates' in temp_data and temp_data['coordinates']:
                    coord_data = temp_data['coordinates'][0]
                    if 'dates' in coord_data and coord_data['dates']:
                        temp_value = coord_data['dates'][0].get('value')
                        print(f"🌡️  Current Temperature: {temp_value}°C")
            
            return True
            
        elif response.status_code == 401:
            print("❌ Authentication failed - check your credentials")
            print("   Make sure your username and password are correct")
            return False
            
        elif response.status_code == 403:
            print("❌ Access forbidden - check your API permissions")
            print("   Your account might not have access to this data")
            return False
            
        else:
            print(f"❌ API request failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Request timed out - check your internet connection")
        return False
        
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - check your internet connection")
        return False
        
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return False

def test_weather_service():
    """Test the weather service integration"""
    try:
        from utils.weather_service import WeatherService
        
        print("\n🔧 Testing Weather Service Integration...")
        
        weather_service = WeatherService(
            meteomatics_username="prajapati_neel",
            meteomatics_password="G6d19PAz5s7i6F6I8M01"
        )
        
        print("✅ Weather service initialized successfully")
        
        # Test getting current conditions
        print("🌤️  Testing current conditions...")
        current_data = weather_service.get_mumbai_current_conditions()
        
        if current_data and 'weather' in current_data:
            print("✅ Current conditions retrieved successfully")
            weather = current_data['weather']
            print(f"   Temperature: {weather.get('temperature', 'N/A')}°C")
            print(f"   Humidity: {weather.get('humidity', 'N/A')}%")
            print(f"   Pressure: {weather.get('pressure', 'N/A')} hPa")
        else:
            print("⚠️  Current conditions returned empty data")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {str(e)}")
        print("   Make sure all backend modules are properly set up")
        return False
        
    except Exception as e:
        print(f"❌ Weather service test failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Meteomatics API Connection Test")
    print("=" * 50)
    
    # Test basic connection
    connection_success = test_meteomatics_connection()
    
    if connection_success:
        print("\n" + "=" * 50)
        # Test weather service
        test_weather_service()
    
    print("\n" + "=" * 50)
    if connection_success:
        print("🎉 All tests completed! Your Meteomatics integration is ready.")
        print("   You can now start your backend server with: python start_backend.py")
    else:
        print("❌ Connection test failed. Please check your credentials and try again.")
