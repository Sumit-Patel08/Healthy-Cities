import asyncio
import os
import sys
from datetime import datetime

# Add the backend path to import real data loader
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from real_data_loader import RealNASADataLoader

class HeatModel:
    """
    Heat Model using YOUR REAL NASA POWER data
    Connects to your actual NASA temperature datasets
    """
    
    def __init__(self):
        self.name = "REAL NASA Heat Model"
        self.data_loader = RealNASADataLoader()
        print(f"🌡️  {self.name} initialized - CONNECTED to your real NASA POWER data!")
    
    async def get_current_data(self):
        """Get REAL heat data from your NASA POWER dataset"""
        print("🛰️  Loading REAL NASA POWER temperature data...")
        
        # Small delay to simulate processing
        await asyncio.sleep(0.1)
        
        # Get real data from your NASA POWER dataset
        return self.data_loader.get_real_heat_data()
