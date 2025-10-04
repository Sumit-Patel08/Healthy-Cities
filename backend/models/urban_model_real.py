import asyncio
import os
import sys
from datetime import datetime

# Add the backend path to import real data loader
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from real_data_loader import RealNASADataLoader

class UrbanModel:
    """
    Urban Model using YOUR REAL VIIRS nighttime lights data
    Connects to your actual urban patterns datasets
    """
    
    def __init__(self):
        self.name = "REAL NASA Urban Model"
        self.data_loader = RealNASADataLoader()
        print(f"🏙️  {self.name} initialized - CONNECTED to your real VIIRS/urban data!")
    
    async def get_current_data(self):
        """Get REAL urban data from your VIIRS datasets"""
        print("🛰️  Loading REAL VIIRS nighttime lights data...")
        
        # Small delay to simulate processing
        await asyncio.sleep(0.1)
        
        # Get real data from your urban datasets
        return self.data_loader.get_real_urban_data()
