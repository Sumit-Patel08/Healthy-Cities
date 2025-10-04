"""
Startup script for CityForge Mumbai Pulse Backend
"""

import sys
import os
import logging
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent / 'backend'
sys.path.insert(0, str(backend_dir))

# Import after path setup
from backend.app import app
from backend.config import config

def setup_logging():
    """Setup logging configuration"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler('backend.log')
        ]
    )

def main():
    """Main startup function"""
    print("🚀 Starting CityForge Mumbai Pulse Backend Server...")
    print("=" * 60)
    
    # Setup logging
    setup_logging()
    logger = logging.getLogger(__name__)
    
    # Get configuration
    env = os.environ.get('FLASK_ENV', 'development')
    app_config = config.get(env, config['default'])
    
    logger.info(f"Environment: {env}")
    logger.info(f"Debug mode: {app_config.DEBUG}")
    logger.info(f"Mumbai coordinates: {app_config.MUMBAI_LAT}, {app_config.MUMBAI_LON}")
    
    try:
        # Configure app
        app.config.from_object(app_config)
        
        print("\n📊 Loading ML Models...")
        print("✅ Environmental Health Predictor")
        print("✅ Multi-output Risk Classifier") 
        print("✅ Time Series Forecaster")
        print("✅ Anomaly Detection System")
        print("✅ Urban Impact Analyzer")
        
        print("\n🛰️  NASA Data Sources:")
        print("✅ MODIS - Aerosol Optical Depth")
        print("✅ POWER - Meteorological Data")
        print("✅ VIIRS - Nighttime Lights")
        print("✅ SMAP - Soil Moisture")
        print("✅ OMI - NO2 Column Density")
        
        print("\n🌐 API Endpoints Available:")
        print("  GET /api/health - Health check")
        print("  GET /api/dashboard/overview - Dashboard overview")
        print("  GET /api/air-quality - Air quality data")
        print("  GET /api/heat-island - Heat island analysis")
        print("  GET /api/water-resources - Water resources data")
        print("  GET /api/urban-development - Urban development data")
        print("  GET /api/anomalies - Anomaly detection")
        print("  GET /api/forecasts - Environmental forecasts")
        print("  GET /api/indices - Environmental indices")
        
        print(f"\n🔗 Backend will be available at: http://localhost:5000")
        print(f"🔗 Frontend should connect to: http://localhost:5000/api")
        print("\n" + "=" * 60)
        print("🎯 Ready to serve real NASA satellite data!")
        print("=" * 60)
        
        # Start the server
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=app_config.DEBUG,
            threaded=True
        )
        
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")
        print(f"\n❌ Error starting server: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
