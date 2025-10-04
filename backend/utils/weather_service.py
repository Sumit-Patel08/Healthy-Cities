"""
Weather Service Module
Integrates Meteomatics API with CityForge Mumbai Pulse system
"""

import logging
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import json
from .meteomatics_client import MeteomaticsClient

logger = logging.getLogger(__name__)

class WeatherService:
    """Service for managing weather and environmental data"""
    
    def __init__(self, meteomatics_username: str, meteomatics_password: str):
        """
        Initialize weather service
        
        Args:
            meteomatics_username: Meteomatics API username
            meteomatics_password: Meteomatics API password
        """
        self.meteomatics_client = MeteomaticsClient(
            username=meteomatics_username,
            password=meteomatics_password
        )
        self._cache = {}
        self._cache_timeout = 300  # 5 minutes
    
    def get_mumbai_current_conditions(self) -> Dict:
        """
        Get current weather and air quality conditions for Mumbai
        
        Returns:
            Combined weather and air quality data
        """
        mumbai_lat = 19.0760
        mumbai_lon = 72.8777
        
        cache_key = f"current_conditions_{mumbai_lat}_{mumbai_lon}"
        
        # Check cache
        if self._is_cache_valid(cache_key):
            logger.info("Returning cached current conditions")
            return self._cache[cache_key]['data']
        
        try:
            # Get weather data
            weather_data = self.meteomatics_client.get_current_weather(mumbai_lat, mumbai_lon)
            
            # Get air quality data
            air_quality_data = self.meteomatics_client.get_air_quality(mumbai_lat, mumbai_lon)
            
            # Get environmental data
            environmental_data = self.meteomatics_client.get_environmental_data(mumbai_lat, mumbai_lon)
            
            # Combine all data
            combined_data = {
                'location': {
                    'city': 'Mumbai',
                    'latitude': mumbai_lat,
                    'longitude': mumbai_lon
                },
                'timestamp': datetime.utcnow().isoformat(),
                'weather': weather_data,
                'air_quality': air_quality_data,
                'environmental': environmental_data,
                'health_indices': self._calculate_health_indices(weather_data, air_quality_data, environmental_data)
            }
            
            # Cache the result
            self._cache[cache_key] = {
                'data': combined_data,
                'timestamp': datetime.utcnow()
            }
            
            logger.info("Successfully retrieved current conditions for Mumbai")
            return combined_data
            
        except Exception as e:
            logger.error(f"Failed to get current conditions: {str(e)}")
            return self._get_fallback_data()
    
    def get_mumbai_forecast(self, hours: int = 24) -> List[Dict]:
        """
        Get weather forecast for Mumbai
        
        Args:
            hours: Number of hours to forecast
            
        Returns:
            List of forecast data points
        """
        mumbai_lat = 19.0760
        mumbai_lon = 72.8777
        
        cache_key = f"forecast_{mumbai_lat}_{mumbai_lon}_{hours}"
        
        # Check cache
        if self._is_cache_valid(cache_key):
            logger.info("Returning cached forecast")
            return self._cache[cache_key]['data']
        
        try:
            forecast_data = self.meteomatics_client.get_forecast(mumbai_lat, mumbai_lon, hours)
            
            # Enhance forecast with health indices
            enhanced_forecast = []
            for point in forecast_data:
                enhanced_point = point.copy()
                enhanced_point['health_risk'] = self._calculate_forecast_health_risk(point)
                enhanced_forecast.append(enhanced_point)
            
            # Cache the result
            self._cache[cache_key] = {
                'data': enhanced_forecast,
                'timestamp': datetime.utcnow()
            }
            
            logger.info(f"Successfully retrieved {hours}h forecast for Mumbai")
            return enhanced_forecast
            
        except Exception as e:
            logger.error(f"Failed to get forecast: {str(e)}")
            return []
    
    def get_air_quality_analysis(self) -> Dict:
        """
        Get detailed air quality analysis for Mumbai
        
        Returns:
            Air quality analysis with recommendations
        """
        cache_key = "air_quality_analysis"
        
        # Check cache
        if self._is_cache_valid(cache_key):
            logger.info("Returning cached air quality analysis")
            return self._cache[cache_key]['data']
        
        try:
            mumbai_lat = 19.0760
            mumbai_lon = 72.8777
            
            air_quality_data = self.meteomatics_client.get_air_quality(mumbai_lat, mumbai_lon)
            
            analysis = {
                'current_aqi': air_quality_data.get('aqi'),
                'pollutants': {
                    'pm2_5': air_quality_data.get('pm2_5'),
                    'pm10': air_quality_data.get('pm10'),
                    'no2': air_quality_data.get('no2'),
                    'o3': air_quality_data.get('o3'),
                    'so2': air_quality_data.get('so2'),
                    'co': air_quality_data.get('co')
                },
                'health_impact': self._assess_air_quality_health_impact(air_quality_data),
                'recommendations': self._get_air_quality_recommendations(air_quality_data),
                'timestamp': datetime.utcnow().isoformat()
            }
            
            # Cache the result
            self._cache[cache_key] = {
                'data': analysis,
                'timestamp': datetime.utcnow()
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Failed to get air quality analysis: {str(e)}")
            return {}
    
    def get_heat_stress_analysis(self) -> Dict:
        """
        Get heat stress analysis for Mumbai
        
        Returns:
            Heat stress analysis with risk assessment
        """
        cache_key = "heat_stress_analysis"
        
        # Check cache
        if self._is_cache_valid(cache_key):
            logger.info("Returning cached heat stress analysis")
            return self._cache[cache_key]['data']
        
        try:
            mumbai_lat = 19.0760
            mumbai_lon = 72.8777
            
            weather_data = self.meteomatics_client.get_current_weather(mumbai_lat, mumbai_lon)
            environmental_data = self.meteomatics_client.get_environmental_data(mumbai_lat, mumbai_lon)
            
            analysis = {
                'current_temperature': weather_data.get('temperature'),
                'heat_index': environmental_data.get('heat_index'),
                'humidity': weather_data.get('humidity'),
                'uv_index': weather_data.get('uv_index'),
                'risk_level': self._assess_heat_stress_risk(weather_data, environmental_data),
                'recommendations': self._get_heat_stress_recommendations(weather_data, environmental_data),
                'timestamp': datetime.utcnow().isoformat()
            }
            
            # Cache the result
            self._cache[cache_key] = {
                'data': analysis,
                'timestamp': datetime.utcnow()
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Failed to get heat stress analysis: {str(e)}")
            return {}
    
    def _calculate_health_indices(self, weather_data: Dict, air_quality_data: Dict, environmental_data: Dict) -> Dict:
        """Calculate various health indices"""
        indices = {}
        
        # Air Quality Health Index
        aqi = air_quality_data.get('aqi')
        if aqi is not None:
            if aqi <= 50:
                indices['air_quality_risk'] = 'Low'
            elif aqi <= 100:
                indices['air_quality_risk'] = 'Moderate'
            elif aqi <= 150:
                indices['air_quality_risk'] = 'Unhealthy for Sensitive Groups'
            elif aqi <= 200:
                indices['air_quality_risk'] = 'Unhealthy'
            elif aqi <= 300:
                indices['air_quality_risk'] = 'Very Unhealthy'
            else:
                indices['air_quality_risk'] = 'Hazardous'
        
        # Heat Stress Index
        heat_index = environmental_data.get('heat_index')
        if heat_index is not None:
            if heat_index < 27:
                indices['heat_stress_risk'] = 'Low'
            elif heat_index < 32:
                indices['heat_stress_risk'] = 'Caution'
            elif heat_index < 41:
                indices['heat_stress_risk'] = 'Extreme Caution'
            elif heat_index < 54:
                indices['heat_stress_risk'] = 'Danger'
            else:
                indices['heat_stress_risk'] = 'Extreme Danger'
        
        # UV Risk Index
        uv_index = weather_data.get('uv_index')
        if uv_index is not None:
            if uv_index < 3:
                indices['uv_risk'] = 'Low'
            elif uv_index < 6:
                indices['uv_risk'] = 'Moderate'
            elif uv_index < 8:
                indices['uv_risk'] = 'High'
            elif uv_index < 11:
                indices['uv_risk'] = 'Very High'
            else:
                indices['uv_risk'] = 'Extreme'
        
        return indices
    
    def _calculate_forecast_health_risk(self, forecast_point: Dict) -> str:
        """Calculate health risk for a forecast point"""
        temperature = forecast_point.get('temperature')
        humidity = forecast_point.get('humidity')
        
        if temperature is None or humidity is None:
            return 'Unknown'
        
        # Simple heat index calculation
        if temperature > 35 and humidity > 70:
            return 'High'
        elif temperature > 30 and humidity > 80:
            return 'Moderate'
        elif temperature > 40:
            return 'High'
        else:
            return 'Low'
    
    def _assess_air_quality_health_impact(self, air_quality_data: Dict) -> Dict:
        """Assess health impact of current air quality"""
        aqi = air_quality_data.get('aqi', 0)
        pm2_5 = air_quality_data.get('pm2_5', 0)
        
        impact = {
            'overall_risk': 'Low',
            'sensitive_groups_risk': 'Low',
            'primary_concern': None
        }
        
        if aqi > 150:
            impact['overall_risk'] = 'High'
            impact['sensitive_groups_risk'] = 'Very High'
            impact['primary_concern'] = 'Unhealthy air quality for all groups'
        elif aqi > 100:
            impact['overall_risk'] = 'Moderate'
            impact['sensitive_groups_risk'] = 'High'
            impact['primary_concern'] = 'Unhealthy for sensitive groups'
        elif aqi > 50:
            impact['overall_risk'] = 'Low'
            impact['sensitive_groups_risk'] = 'Moderate'
            impact['primary_concern'] = 'Acceptable for most people'
        
        return impact
    
    def _get_air_quality_recommendations(self, air_quality_data: Dict) -> List[str]:
        """Get recommendations based on air quality"""
        aqi = air_quality_data.get('aqi', 0)
        recommendations = []
        
        if aqi > 150:
            recommendations.extend([
                "Avoid outdoor activities",
                "Keep windows closed",
                "Use air purifiers indoors",
                "Wear N95 masks when going outside"
            ])
        elif aqi > 100:
            recommendations.extend([
                "Limit prolonged outdoor activities",
                "Sensitive individuals should stay indoors",
                "Consider wearing masks outdoors"
            ])
        elif aqi > 50:
            recommendations.extend([
                "Outdoor activities are generally safe",
                "Sensitive individuals should monitor symptoms"
            ])
        else:
            recommendations.append("Air quality is good for outdoor activities")
        
        return recommendations
    
    def _assess_heat_stress_risk(self, weather_data: Dict, environmental_data: Dict) -> str:
        """Assess heat stress risk level"""
        heat_index = environmental_data.get('heat_index')
        temperature = weather_data.get('temperature')
        
        if heat_index is not None:
            if heat_index > 54:
                return 'Extreme'
            elif heat_index > 41:
                return 'High'
            elif heat_index > 32:
                return 'Moderate'
            else:
                return 'Low'
        elif temperature is not None:
            if temperature > 40:
                return 'High'
            elif temperature > 35:
                return 'Moderate'
            else:
                return 'Low'
        
        return 'Unknown'
    
    def _get_heat_stress_recommendations(self, weather_data: Dict, environmental_data: Dict) -> List[str]:
        """Get heat stress recommendations"""
        risk_level = self._assess_heat_stress_risk(weather_data, environmental_data)
        recommendations = []
        
        if risk_level == 'Extreme':
            recommendations.extend([
                "Avoid outdoor activities during peak hours",
                "Stay in air-conditioned spaces",
                "Drink water frequently",
                "Seek immediate medical attention for heat exhaustion symptoms"
            ])
        elif risk_level == 'High':
            recommendations.extend([
                "Limit outdoor activities",
                "Take frequent breaks in shade",
                "Wear light-colored, loose clothing",
                "Stay hydrated"
            ])
        elif risk_level == 'Moderate':
            recommendations.extend([
                "Take precautions during outdoor activities",
                "Stay hydrated",
                "Avoid prolonged sun exposure"
            ])
        else:
            recommendations.append("Weather conditions are comfortable")
        
        return recommendations
    
    def _is_cache_valid(self, cache_key: str) -> bool:
        """Check if cached data is still valid"""
        if cache_key not in self._cache:
            return False
        
        cache_time = self._cache[cache_key]['timestamp']
        return (datetime.utcnow() - cache_time).seconds < self._cache_timeout
    
    def _get_fallback_data(self) -> Dict:
        """Get fallback data when API is unavailable"""
        return {
            'location': {
                'city': 'Mumbai',
                'latitude': 19.0760,
                'longitude': 72.8777
            },
            'timestamp': datetime.utcnow().isoformat(),
            'weather': {
                'temperature': None,
                'humidity': None,
                'status': 'API unavailable'
            },
            'air_quality': {
                'aqi': None,
                'status': 'API unavailable'
            },
            'environmental': {
                'status': 'API unavailable'
            },
            'health_indices': {
                'status': 'Unable to calculate - API unavailable'
            }
        }
