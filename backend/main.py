from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from datetime import datetime
import asyncio
import random
import json

# Import our 5 NASA data models
from models.air_model_real import AirQualityModel
from models.heat_model_real import HeatModel
from models.water_model_real import WaterModel
from models.urban_model_real import UrbanModel
from models.indices_model_real import IndicesModel

app = FastAPI(
    title="CityForge - Mumbai Pulse API",
    description="Urban Resilience Powered by NASA Data",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize our 5 NASA data models
air_model = AirQualityModel()
heat_model = HeatModel()
water_model = WaterModel()
urban_model = UrbanModel()
indices_model = IndicesModel()

@app.get("/")
async def root():
    return {
        "message": "CityForge - Mumbai Pulse API",
        "description": "Urban Resilience Powered by NASA Data",
        "version": "1.0.0",
        "endpoints": ["/api/air", "/api/heat", "/api/water", "/api/urban", "/api/indices"],
        "status": "🚀 All 5 NASA models online!"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "models": {
            "air_quality": "✅ MODIS AOD + Ground Sensors",
            "heat_index": "✅ MODIS LST + NASA POWER",
            "water_management": "✅ NDWI + SMAP Soil Moisture",
            "urban_activity": "✅ VIIRS Nighttime Lights",
            "resilience_indices": "✅ Multi-domain AI Analysis"
        }
    }

@app.get("/api/air")
async def get_air_quality_data():
    """Air Quality Model - MODIS AOD + Ground Sensors"""
    try:
        data = await air_model.get_current_data()
        return JSONResponse(content=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Air model error: {str(e)}")

@app.get("/api/heat")
async def get_heat_data():
    """Heat Index Model - MODIS LST + NASA POWER"""
    try:
        data = await heat_model.get_current_data()
        return JSONResponse(content=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Heat model error: {str(e)}")

@app.get("/api/water")
async def get_water_data():
    """Water Management Model - NDWI + SMAP"""
    try:
        data = await water_model.get_current_data()
        return JSONResponse(content=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Water model error: {str(e)}")

@app.get("/api/urban")
async def get_urban_data():
    """Urban Activity Model - VIIRS Nighttime Lights"""
    try:
        data = await urban_model.get_current_data()
        return JSONResponse(content=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Urban model error: {str(e)}")

@app.get("/api/indices")
async def get_indices_data():
    """Resilience Indices Model - Multi-domain Analysis"""
    try:
        data = await indices_model.get_current_data()
        return JSONResponse(content=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Indices model error: {str(e)}")

if __name__ == "__main__":
    print("🚀 Starting CityForge - Mumbai Pulse Backend")
    print("📡 Loading NASA satellite data models...")
    print("🛰️  MODIS, VIIRS, SMAP, Landsat integration active")
    print("🌐 Server will be available at: http://localhost:8000")
    print("📊 API Documentation: http://localhost:8000/docs")
    
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )
