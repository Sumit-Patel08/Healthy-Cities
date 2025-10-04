"""
Configuration settings for CityForge Mumbai Pulse Backend
"""

import os
from pathlib import Path

class Config:
    """Base configuration"""
    
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'cityforge-mumbai-pulse-secret-key-2025'
    DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    # API settings
    API_VERSION = 'v1'
    API_PREFIX = '/api'
    
    # CORS settings
    CORS_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000', '*']
    
    # Data paths
    BASE_DIR = Path(__file__).parent.parent
    DATA_DIR = BASE_DIR / 'mumbai_pulse_data' / 'data'
    MODELS_DIR = BASE_DIR / 'mumbai_pulse_data' / 'models'
    
    # Model settings
    MODEL_CACHE_TIMEOUT = 3600  # 1 hour in seconds
    PREDICTION_BATCH_SIZE = 100
    
    # Real-time data settings
    DATA_REFRESH_INTERVAL = 3600  # 1 hour in seconds
    NASA_API_TIMEOUT = 30  # seconds
    
    # Logging settings
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    # Performance settings
    MAX_WORKERS = os.environ.get('MAX_WORKERS', 4)
    REQUEST_TIMEOUT = 30
    
    # Cache settings
    CACHE_TYPE = 'simple'
    CACHE_DEFAULT_TIMEOUT = 300  # 5 minutes
    
    # Database settings (if needed for future extensions)
    DATABASE_URL = os.environ.get('DATABASE_URL')
    
    # NASA API endpoints
    NASA_POWER_API = 'https://power.larc.nasa.gov/api/temporal/daily/point'
    NASA_EARTHDATA_API = 'https://earthdata.nasa.gov/api'
    
    # Mumbai coordinates
    MUMBAI_LAT = 19.0760
    MUMBAI_LON = 72.8777
    
    # Risk thresholds
    RISK_THRESHOLDS = {
        'aqi': {
            'good': 50,
            'moderate': 100,
            'unhealthy_sensitive': 150,
            'unhealthy': 200,
            'very_unhealthy': 300,
            'hazardous': 500
        },
        'heat_index': {
            'low': 27,
            'caution': 32,
            'extreme_caution': 41,
            'danger': 54,
            'extreme_danger': 100
        },
        'flood_risk': {
            'low': 20,
            'moderate': 40,
            'high': 60,
            'very_high': 80,
            'extreme': 100
        }
    }
    
    # Alert settings
    ALERT_THRESHOLDS = {
        'aqi_critical': 150,
        'heat_critical': 40,
        'flood_critical': 70,
        'anomaly_critical': 0.8
    }

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    LOG_LEVEL = 'DEBUG'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    LOG_LEVEL = 'WARNING'
    
    # Production-specific settings
    CORS_ORIGINS = [
        'https://cityforge-mumbai.netlify.app',
        'https://mumbai-pulse.vercel.app'
    ]

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    LOG_LEVEL = 'DEBUG'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
