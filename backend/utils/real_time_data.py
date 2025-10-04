"""
Real-time Data Fetcher - Handles fetching latest data from NASA sources
"""

import requests
import json
import logging
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from pathlib import Path
import os

logger = logging.getLogger(__name__)

class RealTimeDataFetcher:
    def __init__(self):
        self.data_sources = {
            'MODIS': 'https://modis.gsfc.nasa.gov/data/',
            'POWER': 'https://power.larc.nasa.gov/api/',
            'VIIRS': 'https://www.earthdata.nasa.gov/learn/find-data/near-real-time/viirs',
            'SMAP': 'https://smap.jpl.nasa.gov/data/',
            'OMI': 'https://aura.gsfc.nasa.gov/omi.html'
        }
        self.last_update = None
        self.cache_duration = timedelta(hours=1)  # Cache data for 1 hour
        
    def get_latest_update(self):
        """Get information about latest data updates"""
        try:
            # Check if we have recent cached data
            now = datetime.now()
            
            if self.last_update and (now - self.last_update) < self.cache_duration:
                time_since_update = now - self.last_update
                return {
                    'available': False,
                    'timestamp': self.last_update.isoformat(),
                    'sources': list(self.data_sources.keys()),
                    'next_expected': (self.last_update + self.cache_duration).isoformat(),
                    'quality_score': 0.85,
                    'cache_status': f'Using cached data from {time_since_update.seconds // 60} minutes ago'
                }
            
            # Simulate checking for updates from NASA sources
            updated_sources = []
            quality_scores = []
            
            for source in self.data_sources.keys():
                # Simulate API check (in real implementation, this would make actual API calls)
                if self._check_source_update(source):
                    updated_sources.append(source)
                    quality_scores.append(np.random.uniform(0.8, 0.95))
            
            self.last_update = now
            
            return {
                'available': len(updated_sources) > 0,
                'timestamp': now.isoformat(),
                'sources': updated_sources,
                'next_expected': (now + self.cache_duration).isoformat(),
                'quality_score': float(np.mean(quality_scores)) if quality_scores else 0.75,
                'cache_status': 'Fresh data fetched'
            }
            
        except Exception as e:
            logger.error(f"Error getting latest update: {str(e)}")
            return {
                'available': False,
                'timestamp': datetime.now().isoformat(),
                'sources': [],
                'next_expected': (datetime.now() + self.cache_duration).isoformat(),
                'quality_score': 0.0,
                'error': str(e)
            }
    
    def _check_source_update(self, source):
        """Check if a specific data source has updates"""
        try:
            # Simulate checking data source availability
            # In real implementation, this would make actual API calls to NASA services
            
            if source == 'POWER':
                return self._check_power_api()
            elif source == 'MODIS':
                return self._check_modis_data()
            elif source == 'VIIRS':
                return self._check_viirs_data()
            elif source == 'SMAP':
                return self._check_smap_data()
            elif source == 'OMI':
                return self._check_omi_data()
            
            return np.random.choice([True, False], p=[0.7, 0.3])  # 70% chance of update
            
        except Exception as e:
            logger.error(f"Error checking {source} update: {str(e)}")
            return False
    
    def _check_power_api(self):
        """Check NASA POWER API for meteorological data"""
        try:
            # NASA POWER API endpoint for Mumbai coordinates
            base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
            params = {
                'parameters': 'T2M,RH2M,PRECTOTCORR,WS10M',
                'community': 'RE',
                'longitude': 72.8777,
                'latitude': 19.0760,
                'start': (datetime.now() - timedelta(days=1)).strftime('%Y%m%d'),
                'end': datetime.now().strftime('%Y%m%d'),
                'format': 'JSON'
            }
            
            # In a real implementation, you would make the actual API call
            # response = requests.get(base_url, params=params, timeout=10)
            # return response.status_code == 200
            
            # For now, simulate successful check
            return True
            
        except Exception as e:
            logger.error(f"Error checking POWER API: {str(e)}")
            return False
    
    def _check_modis_data(self):
        """Check MODIS data availability"""
        try:
            # MODIS data is typically available with 1-2 day delay
            # Check if we're within the expected update window
            return True
        except Exception as e:
            logger.error(f"Error checking MODIS data: {str(e)}")
            return False
    
    def _check_viirs_data(self):
        """Check VIIRS nighttime lights data"""
        try:
            # VIIRS data for urban activity monitoring
            return True
        except Exception as e:
            logger.error(f"Error checking VIIRS data: {str(e)}")
            return False
    
    def _check_smap_data(self):
        """Check SMAP soil moisture data"""
        try:
            # SMAP data for soil moisture and flood risk
            return True
        except Exception as e:
            logger.error(f"Error checking SMAP data: {str(e)}")
            return False
    
    def _check_omi_data(self):
        """Check OMI NO2 data"""
        try:
            # OMI data for air quality monitoring
            return True
        except Exception as e:
            logger.error(f"Error checking OMI data: {str(e)}")
            return False
    
    def fetch_latest_power_data(self):
        """Fetch latest meteorological data from NASA POWER"""
        try:
            # This would implement actual NASA POWER API calls
            # For now, return simulated current data
            return {
                'T2M': np.random.normal(28, 3),
                'RH2M': np.random.normal(75, 10),
                'PRECTOTCORR': np.random.exponential(2),
                'WS10M': np.random.normal(2.5, 0.5),
                'timestamp': datetime.now().isoformat(),
                'source': 'NASA_POWER_API'
            }
        except Exception as e:
            logger.error(f"Error fetching POWER data: {str(e)}")
            return None
    
    def fetch_latest_modis_data(self):
        """Fetch latest MODIS AOD data"""
        try:
            return {
                'aod_550nm': np.random.normal(0.5, 0.1),
                'timestamp': datetime.now().isoformat(),
                'source': 'NASA_MODIS'
            }
        except Exception as e:
            logger.error(f"Error fetching MODIS data: {str(e)}")
            return None
    
    def fetch_latest_viirs_data(self):
        """Fetch latest VIIRS nighttime lights data"""
        try:
            return {
                'radiance_nw_cm2_sr': np.random.normal(25, 5),
                'timestamp': datetime.now().isoformat(),
                'source': 'NASA_VIIRS'
            }
        except Exception as e:
            logger.error(f"Error fetching VIIRS data: {str(e)}")
            return None
    
    def fetch_latest_smap_data(self):
        """Fetch latest SMAP soil moisture data"""
        try:
            return {
                'soil_moisture': np.random.normal(0.3, 0.1),
                'timestamp': datetime.now().isoformat(),
                'source': 'NASA_SMAP'
            }
        except Exception as e:
            logger.error(f"Error fetching SMAP data: {str(e)}")
            return None
    
    def fetch_latest_omi_data(self):
        """Fetch latest OMI NO2 data"""
        try:
            return {
                'no2_column_density': np.random.normal(0.4, 0.1),
                'timestamp': datetime.now().isoformat(),
                'source': 'NASA_OMI'
            }
        except Exception as e:
            logger.error(f"Error fetching OMI data: {str(e)}")
            return None
    
    def get_comprehensive_update(self):
        """Get comprehensive data update from all sources"""
        try:
            updates = {}
            
            # Fetch from all sources
            power_data = self.fetch_latest_power_data()
            if power_data:
                updates.update(power_data)
            
            modis_data = self.fetch_latest_modis_data()
            if modis_data:
                updates.update(modis_data)
            
            viirs_data = self.fetch_latest_viirs_data()
            if viirs_data:
                updates.update(viirs_data)
            
            smap_data = self.fetch_latest_smap_data()
            if smap_data:
                updates.update(smap_data)
            
            omi_data = self.fetch_latest_omi_data()
            if omi_data:
                updates.update(omi_data)
            
            # Add derived calculations
            if 'T2M' in updates and 'RH2M' in updates:
                updates['heat_index_c'] = self._calculate_heat_index(
                    updates['T2M'], updates['RH2M']
                )
            
            if 'aod_550nm' in updates:
                updates['pm25_estimated'] = self._estimate_pm25_from_aod(updates['aod_550nm'])
                updates['aqi_estimated'] = self._estimate_aqi_from_pm25(updates['pm25_estimated'])
            
            if 'soil_moisture' in updates and 'PRECTOTCORR' in updates:
                updates['flood_risk_score'] = self._calculate_flood_risk(
                    updates['soil_moisture'], updates['PRECTOTCORR']
                )
            
            return updates
            
        except Exception as e:
            logger.error(f"Error getting comprehensive update: {str(e)}")
            return {}
    
    def _calculate_heat_index(self, temp_c, humidity):
        """Calculate heat index from temperature and humidity"""
        try:
            # Convert to Fahrenheit for heat index calculation
            temp_f = (temp_c * 9/5) + 32
            
            # Simplified heat index calculation
            if temp_f < 80:
                return temp_c
            
            # Heat index formula coefficients
            c1 = -42.379
            c2 = 2.04901523
            c3 = 10.14333127
            c4 = -0.22475541
            c5 = -6.83783e-3
            c6 = -5.481717e-2
            c7 = 1.22874e-3
            c8 = 8.5282e-4
            c9 = -1.99e-6
            
            hi = (c1 + (c2 * temp_f) + (c3 * humidity) + 
                  (c4 * temp_f * humidity) + (c5 * temp_f * temp_f) + 
                  (c6 * humidity * humidity) + (c7 * temp_f * temp_f * humidity) + 
                  (c8 * temp_f * humidity * humidity) + 
                  (c9 * temp_f * temp_f * humidity * humidity))
            
            # Convert back to Celsius
            return (hi - 32) * 5/9
            
        except Exception as e:
            logger.error(f"Error calculating heat index: {str(e)}")
            return temp_c
    
    def _estimate_pm25_from_aod(self, aod):
        """Estimate PM2.5 from AOD using empirical relationship"""
        try:
            # Empirical relationship for Mumbai region
            # PM2.5 ≈ AOD * scaling_factor
            scaling_factor = 40  # Typical for urban areas
            return max(0, aod * scaling_factor)
        except Exception as e:
            logger.error(f"Error estimating PM2.5: {str(e)}")
            return 0
    
    def _estimate_aqi_from_pm25(self, pm25):
        """Estimate AQI from PM2.5 concentration"""
        try:
            # US EPA AQI breakpoints for PM2.5
            if pm25 <= 12:
                return (50 / 12) * pm25
            elif pm25 <= 35.4:
                return 50 + ((100 - 50) / (35.4 - 12)) * (pm25 - 12)
            elif pm25 <= 55.4:
                return 100 + ((150 - 100) / (55.4 - 35.4)) * (pm25 - 35.4)
            elif pm25 <= 150.4:
                return 150 + ((200 - 150) / (150.4 - 55.4)) * (pm25 - 55.4)
            elif pm25 <= 250.4:
                return 200 + ((300 - 200) / (250.4 - 150.4)) * (pm25 - 150.4)
            else:
                return 300 + ((500 - 300) / (500.4 - 250.4)) * (pm25 - 250.4)
        except Exception as e:
            logger.error(f"Error estimating AQI: {str(e)}")
            return 0
    
    def _calculate_flood_risk(self, soil_moisture, precipitation):
        """Calculate flood risk score from soil moisture and precipitation"""
        try:
            # Simple flood risk calculation
            # Higher soil moisture + high precipitation = higher flood risk
            base_risk = 20
            moisture_factor = (soil_moisture - 0.2) * 100  # Normalize around 0.2
            precip_factor = min(precipitation * 5, 50)  # Cap precipitation effect
            
            flood_risk = base_risk + moisture_factor + precip_factor
            return max(0, min(100, flood_risk))
            
        except Exception as e:
            logger.error(f"Error calculating flood risk: {str(e)}")
            return 20
    
    def get_data_freshness_status(self):
        """Get status of data freshness across all sources"""
        try:
            status = {}
            
            for source in self.data_sources.keys():
                # Simulate checking last update time for each source
                last_update = datetime.now() - timedelta(
                    hours=np.random.randint(0, 24),
                    minutes=np.random.randint(0, 60)
                )
                
                hours_old = (datetime.now() - last_update).total_seconds() / 3600
                
                if hours_old < 1:
                    freshness = 'very_fresh'
                elif hours_old < 6:
                    freshness = 'fresh'
                elif hours_old < 24:
                    freshness = 'acceptable'
                else:
                    freshness = 'stale'
                
                status[source] = {
                    'last_update': last_update.isoformat(),
                    'hours_old': round(hours_old, 2),
                    'freshness': freshness,
                    'status': 'active' if hours_old < 48 else 'inactive'
                }
            
            return status
            
        except Exception as e:
            logger.error(f"Error getting data freshness status: {str(e)}")
            return {}
    
    def force_refresh_all_sources(self):
        """Force refresh data from all sources"""
        try:
            logger.info("Forcing refresh of all data sources...")
            
            # Reset cache
            self.last_update = None
            
            # Get fresh data
            fresh_data = self.get_comprehensive_update()
            
            # Update timestamp
            self.last_update = datetime.now()
            
            return {
                'success': True,
                'refreshed_at': self.last_update.isoformat(),
                'data_points': len(fresh_data),
                'sources_updated': list(self.data_sources.keys())
            }
            
        except Exception as e:
            logger.error(f"Error forcing refresh: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'refreshed_at': datetime.now().isoformat()
            }
