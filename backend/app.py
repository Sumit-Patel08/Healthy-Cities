"""
CityForge Mumbai Pulse - Backend API Server
Real-time environmental monitoring system using NASA satellite data
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import sys
import logging
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import pickle
import json
from pathlib import Path

# Add the mumbai_pulse_data directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'mumbai_pulse_data'))

from models.model_loader import ModelLoader
from data.data_processor import DataProcessor
from utils.real_time_data import RealTimeDataFetcher

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize components
model_loader = ModelLoader()
data_processor = DataProcessor()
real_time_fetcher = RealTimeDataFetcher()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'models_loaded': model_loader.get_loaded_models(),
        'data_sources': ['NASA MODIS', 'NASA POWER', 'VIIRS', 'SMAP', 'OMI']
    })

@app.route('/api/dashboard/overview', methods=['GET'])
def get_dashboard_overview():
    """Get current environmental overview for Mumbai"""
    try:
        # Get latest real data
        latest_data = data_processor.get_latest_data()
        
        # Get predictions from all models
        environmental_health = model_loader.predict_environmental_health(latest_data)
        risk_assessment = model_loader.predict_risks(latest_data)
        forecasts = model_loader.predict_time_series(latest_data)
        anomalies = model_loader.detect_anomalies(latest_data)
        urban_impact = model_loader.analyze_urban_impact(latest_data)
        
        return jsonify({
            'timestamp': datetime.now().isoformat(),
            'location': 'Mumbai, India',
            'current_conditions': {
                'aqi': float(latest_data.get('aqi_estimated', 0)),
                'temperature': float(latest_data.get('T2M', 0)),
                'humidity': float(latest_data.get('RH2M', 0)),
                'heat_index': float(latest_data.get('heat_index_c', 0)),
                'flood_risk': float(latest_data.get('flood_risk_score', 0)),
                'air_quality_status': latest_data.get('aqi_category', 'Unknown'),
                'heat_risk_level': latest_data.get('heat_risk_level', 'Unknown')
            },
            'environmental_health_score': environmental_health,
            'risk_assessment': risk_assessment,
            'forecasts': forecasts,
            'anomalies': anomalies,
            'urban_impact': urban_impact,
            'data_quality': 'real_nasa_satellite_data'
        })
    except Exception as e:
        logger.error(f"Error in dashboard overview: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/air-quality', methods=['GET'])
def get_air_quality():
    """Get detailed air quality data and predictions"""
    try:
        # Get time range from query params
        days = request.args.get('days', 7, type=int)
        
        # Get historical and current air quality data
        air_quality_data = data_processor.get_air_quality_data(days)
        
        # Get AQI forecasts
        latest_data = data_processor.get_latest_data()
        aqi_forecast = model_loader.predict_aqi_forecast(latest_data)
        
        return jsonify({
            'current_aqi': float(air_quality_data['current']['aqi_estimated']),
            'aqi_category': air_quality_data['current']['aqi_category'],
            'pm25_estimated': float(air_quality_data['current']['pm25_estimated']),
            'no2_levels': float(air_quality_data['current']['no2_column_density']),
            'aod_550nm': float(air_quality_data['current']['aod_550nm']),
            'historical_data': air_quality_data['historical'],
            'forecast': aqi_forecast,
            'health_recommendations': get_health_recommendations(air_quality_data['current']['aqi_estimated']),
            'data_source': 'NASA MODIS & OMI Satellite Data'
        })
    except Exception as e:
        logger.error(f"Error in air quality endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/heat-island', methods=['GET'])
def get_heat_island():
    """Get heat island analysis and temperature data"""
    try:
        days = request.args.get('days', 7, type=int)
        
        # Get heat data
        heat_data = data_processor.get_heat_data(days)
        
        # Get heat risk predictions
        latest_data = data_processor.get_latest_data()
        heat_risks = model_loader.predict_heat_risks(latest_data)
        
        return jsonify({
            'current_temperature': float(heat_data['current']['T2M']),
            'heat_index': float(heat_data['current']['heat_index_c']),
            'heat_risk_level': heat_data['current']['heat_risk_level'],
            'max_temperature': float(heat_data['current']['T2M_MAX']),
            'min_temperature': float(heat_data['current']['T2M_MIN']),
            'humidity': float(heat_data['current']['RH2M']),
            'historical_data': heat_data['historical'],
            'risk_predictions': heat_risks,
            'urban_heat_analysis': model_loader.analyze_urban_heat_impact(latest_data),
            'data_source': 'NASA POWER Meteorological Data'
        })
    except Exception as e:
        logger.error(f"Error in heat island endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/water-resources', methods=['GET'])
def get_water_resources():
    """Get water resources and flood risk analysis"""
    try:
        days = request.args.get('days', 7, type=int)
        
        # Get water data
        water_data = data_processor.get_water_data(days)
        
        # Get flood risk predictions
        latest_data = data_processor.get_latest_data()
        flood_forecast = model_loader.predict_flood_forecast(latest_data)
        
        return jsonify({
            'soil_moisture': float(water_data['current']['soil_moisture']),
            'precipitation': float(water_data['current']['precipitation_mm']),
            'ndwi': float(water_data['current']['ndwi']),
            'flood_risk_score': float(water_data['current']['flood_risk_score']),
            'flood_risk_category': water_data['current']['risk_category'],
            'is_monsoon_season': bool(water_data['current']['is_monsoon_season']),
            'historical_data': water_data['historical'],
            'flood_forecast': flood_forecast,
            'water_stress_index': float(latest_data.get('water_stress_index', 0)),
            'data_source': 'NASA SMAP Soil Moisture Data'
        })
    except Exception as e:
        logger.error(f"Error in water resources endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/urban-development', methods=['GET'])
def get_urban_development():
    """Get urban development and growth analysis"""
    try:
        days = request.args.get('days', 30, type=int)
        
        # Get urban data
        urban_data = data_processor.get_urban_data(days)
        
        # Get urban impact analysis
        latest_data = data_processor.get_latest_data()
        urban_impact = model_loader.analyze_comprehensive_urban_impact(latest_data)
        
        return jsonify({
            'economic_activity_index': float(urban_data['current']['economic_activity_index']),
            'radiance_levels': float(urban_data['current']['radiance_nw_cm2_sr']),
            'activity_level': urban_data['current']['activity_level'],
            'urban_environmental_load': float(urban_data['current']['urban_environmental_load']),
            'historical_trends': urban_data['historical'],
            'urban_impact_analysis': urban_impact,
            'environmental_correlations': model_loader.get_urban_environmental_correlations(),
            'growth_patterns': data_processor.analyze_urban_growth_patterns(days),
            'data_source': 'NASA VIIRS Nighttime Lights Data'
        })
    except Exception as e:
        logger.error(f"Error in urban development endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/anomalies', methods=['GET'])
def get_anomalies():
    """Get environmental anomaly detection results"""
    try:
        days = request.args.get('days', 30, type=int)
        
        # Get recent data for anomaly detection
        recent_data = data_processor.get_recent_data(days)
        
        # Detect anomalies
        anomalies = model_loader.detect_comprehensive_anomalies(recent_data)
        
        return jsonify({
            'anomaly_summary': anomalies['summary'],
            'detected_anomalies': anomalies['anomalies'],
            'anomaly_score': anomalies['overall_score'],
            'affected_parameters': anomalies['affected_parameters'],
            'severity_levels': anomalies['severity'],
            'recommendations': get_anomaly_recommendations(anomalies),
            'detection_timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in anomalies endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/forecasts', methods=['GET'])
def get_forecasts():
    """Get comprehensive environmental forecasts"""
    try:
        horizon = request.args.get('horizon', 7, type=int)
        
        latest_data = data_processor.get_latest_data()
        
        # Get all forecasts
        forecasts = {
            'aqi_forecast': model_loader.predict_aqi_forecast(latest_data, horizon),
            'flood_forecast': model_loader.predict_flood_forecast(latest_data, horizon),
            'environmental_health_trend': model_loader.predict_environmental_health_trend(latest_data, horizon),
            'risk_evolution': model_loader.predict_risk_evolution(latest_data, horizon)
        }
        
        return jsonify({
            'forecast_horizon_days': horizon,
            'forecasts': forecasts,
            'confidence_intervals': model_loader.get_forecast_confidence(),
            'model_performance': model_loader.get_model_performance_metrics(),
            'generated_at': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in forecasts endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/indices', methods=['GET'])
def get_indices():
    """Get comprehensive environmental indices"""
    try:
        latest_data = data_processor.get_latest_data()
        
        # Calculate all indices
        indices = {
            'environmental_stress_index': float(latest_data.get('environmental_stress_index', 0)),
            'air_quality_composite': float(latest_data.get('air_quality_composite', 0)),
            'water_stress_index': float(latest_data.get('water_stress_index', 0)),
            'urban_environmental_load': float(latest_data.get('urban_environmental_load', 0)),
            'overall_health_score': model_loader.predict_environmental_health(latest_data)
        }
        
        # Get historical trends
        historical_indices = data_processor.get_historical_indices(30)
        
        return jsonify({
            'current_indices': indices,
            'historical_trends': historical_indices,
            'index_explanations': get_index_explanations(),
            'risk_thresholds': get_risk_thresholds(),
            'last_updated': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in indices endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/real-time-update', methods=['GET'])
def get_real_time_update():
    """Get the latest real-time data update"""
    try:
        # Fetch latest data from NASA sources
        latest_update = real_time_fetcher.get_latest_update()
        
        return jsonify({
            'update_available': latest_update['available'],
            'last_update': latest_update['timestamp'],
            'data_sources_updated': latest_update['sources'],
            'next_update_expected': latest_update['next_expected'],
            'data_quality': latest_update['quality_score']
        })
    except Exception as e:
        logger.error(f"Error in real-time update: {str(e)}")
        return jsonify({'error': str(e)}), 500

def get_health_recommendations(aqi):
    """Get health recommendations based on AQI"""
    if aqi <= 50:
        return {
            'level': 'Good',
            'message': 'Air quality is satisfactory. Enjoy outdoor activities.',
            'color': 'green'
        }
    elif aqi <= 100:
        return {
            'level': 'Moderate',
            'message': 'Air quality is acceptable. Sensitive individuals should limit outdoor exertion.',
            'color': 'yellow'
        }
    elif aqi <= 150:
        return {
            'level': 'Unhealthy for Sensitive Groups',
            'message': 'Sensitive individuals should avoid outdoor activities.',
            'color': 'orange'
        }
    else:
        return {
            'level': 'Unhealthy',
            'message': 'Everyone should limit outdoor activities.',
            'color': 'red'
        }

def get_anomaly_recommendations(anomalies):
    """Get recommendations based on detected anomalies"""
    recommendations = []
    
    if anomalies['overall_score'] > 0.7:
        recommendations.append("High anomaly detected - increase monitoring frequency")
    
    if 'aqi_estimated' in anomalies['affected_parameters']:
        recommendations.append("Air quality anomaly - check pollution sources")
    
    if 'flood_risk_score' in anomalies['affected_parameters']:
        recommendations.append("Flood risk anomaly - monitor water levels")
    
    return recommendations

def get_index_explanations():
    """Get explanations for environmental indices"""
    return {
        'environmental_stress_index': 'Composite measure of overall environmental stress',
        'air_quality_composite': 'Combined air quality assessment from multiple pollutants',
        'water_stress_index': 'Assessment of water availability and flood risks',
        'urban_environmental_load': 'Impact of urban activities on environment'
    }

def get_risk_thresholds():
    """Get risk level thresholds"""
    return {
        'low': {'min': 0, 'max': 2, 'color': 'green'},
        'moderate': {'min': 2, 'max': 3, 'color': 'yellow'},
        'high': {'min': 3, 'max': 4, 'color': 'orange'},
        'extreme': {'min': 4, 'max': 5, 'color': 'red'}
    }

if __name__ == '__main__':
    logger.info("Starting CityForge Mumbai Pulse Backend Server...")
    logger.info("Loading ML models...")
    
    try:
        # Initialize all models
        model_loader.load_all_models()
        logger.info("All models loaded successfully!")
        
        # Start the server
        app.run(host='0.0.0.0', port=5000, debug=True)
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")
        sys.exit(1)
