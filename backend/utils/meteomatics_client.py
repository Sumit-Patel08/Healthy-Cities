"""
Meteomatics Weather API Client
Provides real-time weather, air quality, and environmental data
"""

import requests
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import base64
from urllib.parse import quote

logger = logging.getLogger(__name__)

class MeteomaticsClient:
    """Client for Meteomatics Weather API"""
    
    def __init__(self, username: str, password: str, base_url: str = "https://api.meteomatics.com"):
        """
        Initialize Meteomatics client
        
        Args:
            username: Meteomatics API username
            password: Meteomatics API password
            base_url: Base URL for Meteomatics API
        """
        self.username = username
        self.password = password
        self.base_url = base_url
        self.session = requests.Session()
        
        # Set up authentication
        credentials = f"{username}:{password}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        self.session.headers.update({
            'Authorization': f'Basic {encoded_credentials}',
            'User-Agent': 'CityForge-Mumbai-Pulse/1.0'
        })
    
    def _make_request(self, endpoint: str, timeout: int = 30) -> Dict:
        """
        Make authenticated request to Meteomatics API
        
        Args:
            endpoint: API endpoint
            timeout: Request timeout in seconds
            
        Returns:
            JSON response data
        """
        try:
            url = f"{self.base_url}/{endpoint}"
            logger.info(f"Making request to: {url}")
            
            response = self.session.get(url, timeout=timeout)
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed: {str(e)}")
            raise Exception(f"Meteomatics API request failed: {str(e)}")
    
    def get_current_weather(self, lat: float, lon: float) -> Dict:
        """
        Get current weather conditions
        
        Args:
            lat: Latitude
            lon: Longitude
            
        Returns:
            Current weather data
        """
        now = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
        
        # Parameters for comprehensive weather data
        parameters = [
            't_2m:C',           # Temperature at 2m in Celsius
            'relative_humidity_2m:p',  # Relative humidity
            'precip_1h:mm',     # Precipitation
            'wind_speed_10m:ms', # Wind speed at 10m
            'wind_dir_10m:d',   # Wind direction
            'msl_pressure:hPa', # Mean sea level pressure
            'uv:idx',           # UV index
            'weather_symbol_1h:idx'  # Weather symbol
        ]
        
        params_str = ','.join(parameters)
        endpoint = f"{now}/{params_str}/{lat},{lon}/json"
        
        try:
            data = self._make_request(endpoint)
            return self._parse_weather_data(data)
        except Exception as e:
            logger.error(f"Failed to get current weather: {str(e)}")
            return {}
    
    def get_air_quality(self, lat: float, lon: float) -> Dict:
        """
        Get current air quality data
        
        Args:
            lat: Latitude
            lon: Longitude
            
        Returns:
            Air quality data including AQI, PM2.5, PM10, etc.
        """
        now = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
        
        # Air quality parameters
        parameters = [
            'pm2p5:ugm3',       # PM2.5 concentration
            'pm10:ugm3',        # PM10 concentration
            'no2:ugm3',         # NO2 concentration
            'o3:ugm3',          # Ozone concentration
            'so2:ugm3',         # SO2 concentration
            'co:mgm3',          # Carbon monoxide
            'aqi_us:idx'        # US AQI index
        ]
        
        params_str = ','.join(parameters)
        endpoint = f"{now}/{params_str}/{lat},{lon}/json"
        
        try:
            data = self._make_request(endpoint)
            return self._parse_air_quality_data(data)
        except Exception as e:
            logger.error(f"Failed to get air quality: {str(e)}")
            return {}
    
    def get_forecast(self, lat: float, lon: float, hours: int = 24) -> List[Dict]:
        """
        Get weather forecast
        
        Args:
            lat: Latitude
            lon: Longitude
            hours: Number of hours to forecast
            
        Returns:
            List of forecast data points
        """
        start_time = datetime.utcnow()
        end_time = start_time + timedelta(hours=hours)
        
        start_str = start_time.strftime('%Y-%m-%dT%H:%M:%SZ')
        end_str = end_time.strftime('%Y-%m-%dT%H:%M:%SZ')
        
        parameters = [
            't_2m:C',
            'relative_humidity_2m:p',
            'precip_1h:mm',
            'wind_speed_10m:ms',
            'weather_symbol_1h:idx'
        ]
        
        params_str = ','.join(parameters)
        endpoint = f"{start_str}--{end_str}:PT1H/{params_str}/{lat},{lon}/json"
        
        try:
            data = self._make_request(endpoint)
            return self._parse_forecast_data(data)
        except Exception as e:
            logger.error(f"Failed to get forecast: {str(e)}")
            return []
    
    def get_environmental_data(self, lat: float, lon: float) -> Dict:
        """
        Get comprehensive environmental data
        
        Args:
            lat: Latitude
            lon: Longitude
            
        Returns:
            Environmental data including solar radiation, soil data, etc.
        """
        now = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
        
        parameters = [
            'global_rad:Wm2',   # Global solar radiation
            'soil_temperature_0cm:C',  # Soil temperature
            'soil_moisture_0_1cm:m3m3',  # Soil moisture
            'evapotranspiration:mm',  # Evapotranspiration
            'heat_index:C'      # Heat index
        ]
        
        params_str = ','.join(parameters)
        endpoint = f"{now}/{params_str}/{lat},{lon}/json"
        
        try:
            data = self._make_request(endpoint)
            return self._parse_environmental_data(data)
        except Exception as e:
            logger.error(f"Failed to get environmental data: {str(e)}")
            return {}
    
    def _parse_weather_data(self, data: Dict) -> Dict:
        """Parse weather API response"""
        try:
            parsed = {
                'timestamp': datetime.utcnow().isoformat(),
                'temperature': None,
                'humidity': None,
                'precipitation': None,
                'wind_speed': None,
                'wind_direction': None,
                'pressure': None,
                'uv_index': None,
                'weather_code': None
            }
            
            if 'data' in data:
                for item in data['data']:
                    param = item.get('parameter', '')
                    values = item.get('coordinates', [{}])[0].get('dates', [{}])
                    
                    if values:
                        value = values[0].get('value')
                        
                        if 't_2m:C' in param:
                            parsed['temperature'] = value
                        elif 'relative_humidity_2m:p' in param:
                            parsed['humidity'] = value
                        elif 'precip_1h:mm' in param:
                            parsed['precipitation'] = value
                        elif 'wind_speed_10m:ms' in param:
                            parsed['wind_speed'] = value
                        elif 'wind_dir_10m:d' in param:
                            parsed['wind_direction'] = value
                        elif 'msl_pressure:hPa' in param:
                            parsed['pressure'] = value
                        elif 'uv:idx' in param:
                            parsed['uv_index'] = value
                        elif 'weather_symbol_1h:idx' in param:
                            parsed['weather_code'] = value
            
            return parsed
            
        except Exception as e:
            logger.error(f"Failed to parse weather data: {str(e)}")
            return {}
    
    def _parse_air_quality_data(self, data: Dict) -> Dict:
        """Parse air quality API response"""
        try:
            parsed = {
                'timestamp': datetime.utcnow().isoformat(),
                'aqi': None,
                'pm2_5': None,
                'pm10': None,
                'no2': None,
                'o3': None,
                'so2': None,
                'co': None
            }
            
            if 'data' in data:
                for item in data['data']:
                    param = item.get('parameter', '')
                    values = item.get('coordinates', [{}])[0].get('dates', [{}])
                    
                    if values:
                        value = values[0].get('value')
                        
                        if 'aqi_us:idx' in param:
                            parsed['aqi'] = value
                        elif 'pm2p5:ugm3' in param:
                            parsed['pm2_5'] = value
                        elif 'pm10:ugm3' in param:
                            parsed['pm10'] = value
                        elif 'no2:ugm3' in param:
                            parsed['no2'] = value
                        elif 'o3:ugm3' in param:
                            parsed['o3'] = value
                        elif 'so2:ugm3' in param:
                            parsed['so2'] = value
                        elif 'co:mgm3' in param:
                            parsed['co'] = value
            
            return parsed
            
        except Exception as e:
            logger.error(f"Failed to parse air quality data: {str(e)}")
            return {}
    
    def _parse_forecast_data(self, data: Dict) -> List[Dict]:
        """Parse forecast API response"""
        try:
            forecast_list = []
            
            if 'data' in data and data['data']:
                # Get the first parameter's dates to establish timeline
                first_param = data['data'][0]
                dates = first_param.get('coordinates', [{}])[0].get('dates', [])
                
                for date_entry in dates:
                    timestamp = date_entry.get('date')
                    forecast_point = {
                        'timestamp': timestamp,
                        'temperature': None,
                        'humidity': None,
                        'precipitation': None,
                        'wind_speed': None,
                        'weather_code': None
                    }
                    
                    # Extract values for this timestamp from all parameters
                    for item in data['data']:
                        param = item.get('parameter', '')
                        param_dates = item.get('coordinates', [{}])[0].get('dates', [])
                        
                        # Find matching timestamp
                        for param_date in param_dates:
                            if param_date.get('date') == timestamp:
                                value = param_date.get('value')
                                
                                if 't_2m:C' in param:
                                    forecast_point['temperature'] = value
                                elif 'relative_humidity_2m:p' in param:
                                    forecast_point['humidity'] = value
                                elif 'precip_1h:mm' in param:
                                    forecast_point['precipitation'] = value
                                elif 'wind_speed_10m:ms' in param:
                                    forecast_point['wind_speed'] = value
                                elif 'weather_symbol_1h:idx' in param:
                                    forecast_point['weather_code'] = value
                                break
                    
                    forecast_list.append(forecast_point)
            
            return forecast_list
            
        except Exception as e:
            logger.error(f"Failed to parse forecast data: {str(e)}")
            return []
    
    def _parse_environmental_data(self, data: Dict) -> Dict:
        """Parse environmental API response"""
        try:
            parsed = {
                'timestamp': datetime.utcnow().isoformat(),
                'solar_radiation': None,
                'soil_temperature': None,
                'soil_moisture': None,
                'evapotranspiration': None,
                'heat_index': None
            }
            
            if 'data' in data:
                for item in data['data']:
                    param = item.get('parameter', '')
                    values = item.get('coordinates', [{}])[0].get('dates', [{}])
                    
                    if values:
                        value = values[0].get('value')
                        
                        if 'global_rad:Wm2' in param:
                            parsed['solar_radiation'] = value
                        elif 'soil_temperature_0cm:C' in param:
                            parsed['soil_temperature'] = value
                        elif 'soil_moisture_0_1cm:m3m3' in param:
                            parsed['soil_moisture'] = value
                        elif 'evapotranspiration:mm' in param:
                            parsed['evapotranspiration'] = value
                        elif 'heat_index:C' in param:
                            parsed['heat_index'] = value
            
            return parsed
            
        except Exception as e:
            logger.error(f"Failed to parse environmental data: {str(e)}")
            return {}
