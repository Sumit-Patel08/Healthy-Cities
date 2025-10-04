import asyncio
import os
import sys
from datetime import datetime

# Add the backend path to import real data loader
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from real_data_loader import RealNASADataLoader

class IndicesModel:
    """
    Resilience Indices Model using YOUR REAL trained XGBoost model
    Connects to your actual environmental health predictor
    """
    
    def __init__(self):
        self.name = "REAL NASA Resilience Model"
        self.data_loader = RealNASADataLoader()
        print(f"📈 {self.name} initialized - CONNECTED to your real XGBoost model!")
    
    async def get_current_data(self):
        """Get REAL resilience indices from your trained model"""
        print("🧠 Processing with your REAL XGBoost environmental health predictor...")
        
        # Small delay to simulate processing
        await asyncio.sleep(0.1)
        
        # Get real predictions from your trained model
        return self.data_loader.get_real_indices_data()
