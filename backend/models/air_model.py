import asyncio
import os
import sys
from datetime import datetime, timedelta

# Add the backend path to import real data loader
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from real_data_loader import RealNASADataLoader

class AirQualityModel:
    """
    Air Quality Model using YOUR REAL NASA data and trained models
    Connects to your actual Model 1 Environment data
    """
    
    def __init__(self):
        self.name = "REAL NASA Air Quality Model"
        self.data_loader = RealNASADataLoader()
        print(f"🌬️  {self.name} initialized - CONNECTED to your real trained model!")
    
    async def fetch_modis_aod_data(self):
        """Simulate fetching MODIS Aerosol Optical Depth data"""
        await asyncio.sleep(0.1)  # Simulate API call
        return {
            "current_value": round(random.uniform(0.3, 1.2), 2),
            "description": "Moderate to high aerosol optical depth",
        }
    
    async def fetch_ground_sensor_data(self):
        """Simulate fetching ground sensor data"""
        await asyncio.sleep(0.1)
        base_aqi = random.randint(120, 200)
        return {
            "current_aqi": base_aqi,
            "pm25_current": round(base_aqi * 0.6, 1),
            "pm10_current": round(base_aqi * 0.8, 1),
            "no2_current": round(random.uniform(30, 60), 1),
            "so2_current": round(random.uniform(10, 25), 1),
            "co_current": round(random.uniform(0.8, 2.0), 1),
            "o3_current": round(random.uniform(60, 100), 1)
        }
    
        """Calculate AQI category and health advisory"""
        if aqi <= 50:
            return "Good", "Air quality is satisfactory"
        elif aqi <= 100:
            return "Moderate", "Air quality is acceptable for most people"
    
    async def get_current_data(self):
        """Get REAL air quality data from your trained model and NASA datasets"""
        print("🛰️  Loading REAL data from your trained Model 1 Environment...")
        
        # Small delay to simulate processing
        await asyncio.sleep(0.1)
        
        # Get real data from your trained model and datasets
        return self.data_loader.get_real_air_data()
            "time_series": time_series,
            "modis_aod": modis_data,
            "satellite_imagery": {
                "visible": "/data/mumbai_visible_latest.jpg",
                "infrared": "/data/mumbai_ir_latest.jpg", 
                "last_updated": datetime.now().isoformat()
            },
            "insights": [
                f"PM2.5 levels are {round(sensor_data['pm25_current']/15, 1)}x higher than WHO guidelines",
                "Traffic emissions contribute to 45% of current pollution",
                "Air quality typically improves after 2 PM due to wind patterns",
                "Monsoon season shows 60% improvement in air quality"
            ],
            "thresholds": {
                "good": 50,
                "moderate": 100, 
                "unhealthy_sensitive": 150,
                "unhealthy": 200,
                "very_unhealthy": 300,
                "hazardous": 500
            },
            "data_sources": self.data_sources,
            "last_updated": datetime.now().isoformat()
        }
