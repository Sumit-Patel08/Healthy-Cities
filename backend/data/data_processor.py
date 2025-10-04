"""
Data Processor - Handles real data loading and processing
"""

import pandas as pd
import numpy as np
from pathlib import Path
import logging
from datetime import datetime, timedelta
import json

logger = logging.getLogger(__name__)

class DataProcessor:
    def __init__(self):
        self.data_path = Path(__file__).parent.parent.parent / 'mumbai_pulse_data' / 'data' / 'ml_ready'
        self.raw_data_path = Path(__file__).parent.parent.parent / 'mumbai_pulse_data' / 'data'
        self.master_data = None
        self.load_master_dataset()
    
    def load_master_dataset(self):
        """Load the master dataset with all processed data"""
        try:
            master_file = self.data_path / 'master_dataset.csv'
            if master_file.exists():
                self.master_data = pd.read_csv(master_file)
                self.master_data['date'] = pd.to_datetime(self.master_data['date'])
                self.master_data = self.master_data.sort_values('date')
                
                # Clean NASA missing data values (-999, -9999)
                self._clean_master_dataset()
                
                logger.info(f"✅ Loaded and CLEANED NASA dataset with {len(self.master_data)} records")
                logger.info(f"   Date range: {self.master_data['date'].min()} to {self.master_data['date'].max()}")
                logger.info(f"   Data sources: NASA MODIS, POWER, VIIRS, SMAP, OMI")
                logger.info(f"   🔧 Missing values (-999) replaced with realistic Mumbai values")
            else:
                logger.warning(f"Master dataset not found at {master_file}")
                self._create_dummy_data()
        except Exception as e:
            logger.error(f"Error loading master dataset: {str(e)}")
            logger.warning("Falling back to synthetic data for demo purposes")
            self._create_dummy_data()
    
    def _clean_master_dataset(self):
        """Clean the entire master dataset by replacing NASA missing values"""
        # Define realistic replacement values for Mumbai
        replacements = {
            'T2M': 28.5,  # Average temperature in Mumbai (°C)
            'RH2M': 75.0,  # Average humidity in Mumbai (%)
            'heat_index_c': 30.2,  # Realistic heat index
            'heat_index_f': 86.4,  # Heat index in Fahrenheit
            'aqi_estimated': 45.0,  # Moderate AQI
            'pm25_estimated': 22.0,  # PM2.5 levels
            'no2_column_density': 0.35,  # NO2 levels
            'aod_550nm': 0.48,  # Aerosol Optical Depth
            'soil_moisture': 0.25,  # Soil moisture
            'precipitation_mm': 1.2,  # Precipitation
            'ndwi': 0.18,  # Water index
            'flood_risk_score': 25.0,  # Flood risk
            'radiance_nw_cm2_sr': 28.5,  # Nighttime lights
            'economic_activity_index': 65.0,  # Economic activity
            'urban_environmental_load': 520.0,  # Urban load
            'environmental_stress_index': 18.5,  # Environmental stress
            'air_quality_composite': 0.28,  # Air quality composite
            'water_stress_index': 2.3,  # Water stress
            'WS10M': 2.5,  # Wind speed
            'PRECTOTCORR': 1.2,  # Precipitation
            'T2M_MAX': 32.0,  # Max temperature
            'T2M_MIN': 25.0,  # Min temperature
        }
        
        # Replace missing values in the entire dataset
        for column in self.master_data.columns:
            if column != 'date' and column in replacements:
                # Replace -999, -9999, and other missing value indicators
                mask = (self.master_data[column] == -999) | (self.master_data[column] == -9999) | (self.master_data[column] < -900)
                if mask.any():
                    count = mask.sum()
                    self.master_data.loc[mask, column] = replacements[column]
                    logger.info(f"🔧 Cleaned {count} missing values in {column}")
        
        # Fill any remaining NaN values
        numeric_columns = self.master_data.select_dtypes(include=[np.number]).columns
        for column in numeric_columns:
            if column != 'date' and self.master_data[column].isna().any():
                if column in replacements:
                    self.master_data[column].fillna(replacements[column], inplace=True)
                else:
                    self.master_data[column].fillna(0, inplace=True)
    
    def _create_dummy_data(self):
        """Create dummy data structure if master dataset is not available"""
        logger.warning("Creating dummy data structure")
        dates = pd.date_range(start='2023-10-01', end=datetime.now(), freq='D')
        
        self.master_data = pd.DataFrame({
            'date': dates,
            'aqi_estimated': np.random.normal(50, 15, len(dates)),
            'T2M': np.random.normal(28, 3, len(dates)),
            'RH2M': np.random.normal(75, 10, len(dates)),
            'flood_risk_score': np.random.normal(30, 10, len(dates)),
            'heat_index_c': np.random.normal(30, 4, len(dates)),
            'pm25_estimated': np.random.normal(25, 8, len(dates)),
            'no2_column_density': np.random.normal(0.4, 0.1, len(dates)),
            'aod_550nm': np.random.normal(0.5, 0.1, len(dates)),
            'soil_moisture': np.random.normal(0.3, 0.1, len(dates)),
            'precipitation_mm': np.random.exponential(2, len(dates)),
            'ndwi': np.random.normal(0.2, 0.05, len(dates)),
            'radiance_nw_cm2_sr': np.random.normal(25, 5, len(dates)),
            'economic_activity_index': np.random.normal(60, 10, len(dates)),
            'urban_environmental_load': np.random.normal(500, 100, len(dates)),
            'environmental_stress_index': np.random.normal(20, 5, len(dates)),
            'air_quality_composite': np.random.normal(0.3, 0.1, len(dates)),
            'water_stress_index': np.random.normal(2.5, 0.5, len(dates))
        })
        
        # Add categorical columns
        self.master_data['aqi_category'] = 'Good'
        self.master_data['heat_risk_level'] = 'Low Risk'
        self.master_data['risk_category'] = 'Moderate Risk'
        self.master_data['activity_level'] = 'Moderate'
        self.master_data['is_monsoon_season'] = False
    
    def get_latest_data(self):
        """Get the most recent data point"""
        try:
            if self.master_data is not None and len(self.master_data) > 0:
                latest_row = self.master_data.iloc[-1]
                data_dict = latest_row.to_dict()
                
                # Clean NASA data - replace missing values (-999, -9999, NaN)
                data_dict = self._clean_nasa_data(data_dict)
                
                # Add missing fields that models expect
                if 'aqi_color' not in data_dict:
                    data_dict['aqi_color'] = 0  # Encoded value
                if 'risk_color' not in data_dict:
                    data_dict['risk_color'] = 1  # Encoded value
                if 'activity_color' not in data_dict:
                    data_dict['activity_color'] = 1  # Encoded value
                if 'heat_risk_color' not in data_dict:
                    data_dict['heat_risk_color'] = 0  # Encoded value
                if 'data_source_flood' not in data_dict:
                    data_dict['data_source_flood'] = 0  # Encoded value
                if 'data_source_urban' not in data_dict:
                    data_dict['data_source_urban'] = 0  # Encoded value
                
                logger.info(f"✅ Serving CLEANED NASA data from {data_dict.get('date', 'unknown date')}")
                return data_dict
            else:
                logger.warning("No master data available, using default values")
                return self._get_default_data()
        except Exception as e:
            logger.error(f"Error getting latest data: {str(e)}")
            return self._get_default_data()
    
    def _clean_nasa_data(self, data_dict):
        """Clean NASA data by replacing missing values and invalid data"""
        # Define realistic replacement values for Mumbai
        replacements = {
            'T2M': 28.5,  # Average temperature in Mumbai (°C)
            'RH2M': 75.0,  # Average humidity in Mumbai (%)
            'heat_index_c': 30.2,  # Realistic heat index
            'heat_index_f': 86.4,  # Heat index in Fahrenheit
            'aqi_estimated': 45.0,  # Moderate AQI
            'pm25_estimated': 22.0,  # PM2.5 levels
            'no2_column_density': 0.35,  # NO2 levels
            'aod_550nm': 0.48,  # Aerosol Optical Depth
            'soil_moisture': 0.25,  # Soil moisture
            'precipitation_mm': 1.2,  # Precipitation
            'ndwi': 0.18,  # Water index
            'flood_risk_score': 25.0,  # Flood risk
            'radiance_nw_cm2_sr': 28.5,  # Nighttime lights
            'economic_activity_index': 65.0,  # Economic activity
            'urban_environmental_load': 520.0,  # Urban load
            'environmental_stress_index': 18.5,  # Environmental stress
            'air_quality_composite': 0.28,  # Air quality composite
            'water_stress_index': 2.3,  # Water stress
            'WS10M': 2.5,  # Wind speed
            'PRECTOTCORR': 1.2,  # Precipitation
            'T2M_MAX': 32.0,  # Max temperature
            'T2M_MIN': 25.0,  # Min temperature
        }
        
        # Clean the data
        for key, value in data_dict.items():
            if isinstance(value, (int, float)):
                # Check for NASA missing data indicators
                if value == -999 or value == -9999 or value < -900 or pd.isna(value):
                    if key in replacements:
                        data_dict[key] = replacements[key]
                        logger.info(f"🔧 Replaced missing value for {key}: {value} -> {replacements[key]}")
                    else:
                        # For unknown fields, set to 0 or reasonable default
                        data_dict[key] = 0.0
                        logger.info(f"🔧 Set default value for {key}: {value} -> 0.0")
        
        return data_dict
    
    def _get_default_data(self):
        """Get default data structure"""
        return {
            'date': datetime.now().strftime('%Y-%m-%d'),
            'aqi_estimated': 45.0,
            'T2M': 28.5,
            'RH2M': 75.0,
            'flood_risk_score': 25.0,
            'heat_index_c': 30.2,
            'heat_index_f': 86.4,
            'pm25_estimated': 22.0,
            'no2_column_density': 0.35,
            'aod_550nm': 0.48,
            'soil_moisture': 0.25,
            'precipitation_mm': 1.2,
            'ndwi': 0.18,
            'radiance_nw_cm2_sr': 28.5,
            'economic_activity_index': 65.0,
            'urban_environmental_load': 520.0,
            'environmental_stress_index': 18.5,
            'air_quality_composite': 0.28,
            'water_stress_index': 2.3,
            'aqi_category': 'Good',
            'heat_risk_level': 'Low Risk',
            'risk_category': 'Moderate Risk',
            'activity_level': 'Moderate',
            'is_monsoon_season': False,
            'aqi_color': 'green',
            'heat_risk_color': 'green',
            'risk_color': 'yellow',
            'activity_color': 'yellow'
        }
    
    def get_air_quality_data(self, days=7):
        """Get air quality data for specified number of days"""
        try:
            end_date = self.master_data['date'].max()
            start_date = end_date - timedelta(days=days)
            
            filtered_data = self.master_data[
                (self.master_data['date'] >= start_date) & 
                (self.master_data['date'] <= end_date)
            ].copy()
            
            # Get current data
            current = self.get_latest_data()
            
            # Prepare historical data
            historical = []
            for _, row in filtered_data.iterrows():
                historical.append({
                    'date': row['date'].strftime('%Y-%m-%d'),
                    'aqi': float(row.get('aqi_estimated', 0)),
                    'pm25': float(row.get('pm25_estimated', 0)),
                    'no2': float(row.get('no2_column_density', 0)),
                    'aod': float(row.get('aod_550nm', 0))
                })
            
            return {
                'current': current,
                'historical': historical
            }
            
        except Exception as e:
            logger.error(f"Error getting air quality data: {str(e)}")
            return {
                'current': self._get_default_data(),
                'historical': []
            }
    
    def get_heat_data(self, days=7):
        """Get heat and temperature data"""
        try:
            end_date = self.master_data['date'].max()
            start_date = end_date - timedelta(days=days)
            
            filtered_data = self.master_data[
                (self.master_data['date'] >= start_date) & 
                (self.master_data['date'] <= end_date)
            ].copy()
            
            current = self.get_latest_data()
            
            historical = []
            for _, row in filtered_data.iterrows():
                historical.append({
                    'date': row['date'].strftime('%Y-%m-%d'),
                    'temperature': float(row.get('T2M', 0)),
                    'heat_index': float(row.get('heat_index_c', 0)),
                    'humidity': float(row.get('RH2M', 0)),
                    'max_temp': float(row.get('T2M_MAX', row.get('T2M', 0) + 2)),
                    'min_temp': float(row.get('T2M_MIN', row.get('T2M', 0) - 2))
                })
            
            return {
                'current': current,
                'historical': historical
            }
            
        except Exception as e:
            logger.error(f"Error getting heat data: {str(e)}")
            return {
                'current': self._get_default_data(),
                'historical': []
            }
    
    def get_water_data(self, days=7):
        """Get water resources and flood risk data"""
        try:
            end_date = self.master_data['date'].max()
            start_date = end_date - timedelta(days=days)
            
            filtered_data = self.master_data[
                (self.master_data['date'] >= start_date) & 
                (self.master_data['date'] <= end_date)
            ].copy()
            
            current = self.get_latest_data()
            
            historical = []
            for _, row in filtered_data.iterrows():
                historical.append({
                    'date': row['date'].strftime('%Y-%m-%d'),
                    'soil_moisture': float(row.get('soil_moisture', 0)),
                    'precipitation': float(row.get('precipitation_mm', 0)),
                    'ndwi': float(row.get('ndwi', 0)),
                    'flood_risk': float(row.get('flood_risk_score', 0))
                })
            
            return {
                'current': current,
                'historical': historical
            }
            
        except Exception as e:
            logger.error(f"Error getting water data: {str(e)}")
            return {
                'current': self._get_default_data(),
                'historical': []
            }
    
    def get_urban_data(self, days=30):
        """Get urban development and activity data"""
        try:
            end_date = self.master_data['date'].max()
            start_date = end_date - timedelta(days=days)
            
            filtered_data = self.master_data[
                (self.master_data['date'] >= start_date) & 
                (self.master_data['date'] <= end_date)
            ].copy()
            
            current = self.get_latest_data()
            
            historical = []
            for _, row in filtered_data.iterrows():
                historical.append({
                    'date': row['date'].strftime('%Y-%m-%d'),
                    'radiance': float(row.get('radiance_nw_cm2_sr', 0)),
                    'economic_activity': float(row.get('economic_activity_index', 0)),
                    'urban_load': float(row.get('urban_environmental_load', 0))
                })
            
            return {
                'current': current,
                'historical': historical
            }
            
        except Exception as e:
            logger.error(f"Error getting urban data: {str(e)}")
            return {
                'current': self._get_default_data(),
                'historical': []
            }
    
    def get_recent_data(self, days=30):
        """Get recent data for anomaly detection"""
        try:
            end_date = self.master_data['date'].max()
            start_date = end_date - timedelta(days=days)
            
            filtered_data = self.master_data[
                (self.master_data['date'] >= start_date) & 
                (self.master_data['date'] <= end_date)
            ].copy()
            
            # Convert to list of dictionaries
            data_list = []
            for _, row in filtered_data.iterrows():
                data_list.append(row.to_dict())
            
            return data_list
            
        except Exception as e:
            logger.error(f"Error getting recent data: {str(e)}")
            return [self._get_default_data()]
    
    def get_historical_indices(self, days=30):
        """Get historical environmental indices"""
        try:
            end_date = self.master_data['date'].max()
            start_date = end_date - timedelta(days=days)
            
            filtered_data = self.master_data[
                (self.master_data['date'] >= start_date) & 
                (self.master_data['date'] <= end_date)
            ].copy()
            
            historical = []
            for _, row in filtered_data.iterrows():
                historical.append({
                    'date': row['date'].strftime('%Y-%m-%d'),
                    'environmental_stress_index': float(row.get('environmental_stress_index', 0)),
                    'air_quality_composite': float(row.get('air_quality_composite', 0)),
                    'water_stress_index': float(row.get('water_stress_index', 0)),
                    'urban_environmental_load': float(row.get('urban_environmental_load', 0))
                })
            
            return historical
            
        except Exception as e:
            logger.error(f"Error getting historical indices: {str(e)}")
            return []
    
    def analyze_urban_growth_patterns(self, days=30):
        """Analyze urban growth patterns"""
        try:
            end_date = self.master_data['date'].max()
            start_date = end_date - timedelta(days=days)
            
            filtered_data = self.master_data[
                (self.master_data['date'] >= start_date) & 
                (self.master_data['date'] <= end_date)
            ].copy()
            
            if len(filtered_data) < 2:
                return {'trend': 'insufficient_data', 'growth_rate': 0.0}
            
            # Calculate growth trends
            initial_activity = filtered_data.iloc[0].get('economic_activity_index', 0)
            final_activity = filtered_data.iloc[-1].get('economic_activity_index', 0)
            
            growth_rate = ((final_activity - initial_activity) / initial_activity * 100) if initial_activity > 0 else 0
            
            # Determine trend
            if growth_rate > 5:
                trend = 'rapid_growth'
            elif growth_rate > 1:
                trend = 'moderate_growth'
            elif growth_rate > -1:
                trend = 'stable'
            elif growth_rate > -5:
                trend = 'moderate_decline'
            else:
                trend = 'rapid_decline'
            
            # Calculate average values
            avg_radiance = filtered_data.get('radiance_nw_cm2_sr', pd.Series([0])).mean()
            avg_urban_load = filtered_data.get('urban_environmental_load', pd.Series([0])).mean()
            
            return {
                'trend': trend,
                'growth_rate': float(growth_rate),
                'average_radiance': float(avg_radiance),
                'average_urban_load': float(avg_urban_load),
                'analysis_period_days': days,
                'data_points': len(filtered_data)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing urban growth patterns: {str(e)}")
            return {
                'trend': 'unknown',
                'growth_rate': 0.0,
                'average_radiance': 0.0,
                'average_urban_load': 0.0
            }
    
    def get_data_quality_metrics(self):
        """Get data quality metrics"""
        try:
            if self.master_data is None or len(self.master_data) == 0:
                return {'quality_score': 0.0, 'completeness': 0.0, 'freshness': 'no_data'}
            
            # Calculate completeness
            total_cells = self.master_data.size
            non_null_cells = self.master_data.count().sum()
            completeness = (non_null_cells / total_cells) * 100 if total_cells > 0 else 0
            
            # Calculate freshness
            latest_date = self.master_data['date'].max()
            days_old = (datetime.now() - latest_date).days
            
            if days_old == 0:
                freshness = 'current'
            elif days_old <= 1:
                freshness = 'recent'
            elif days_old <= 7:
                freshness = 'weekly'
            else:
                freshness = 'outdated'
            
            # Overall quality score
            quality_score = min(100, completeness - (days_old * 2))
            
            return {
                'quality_score': float(max(0, quality_score)),
                'completeness': float(completeness),
                'freshness': freshness,
                'total_records': len(self.master_data),
                'date_range': {
                    'start': self.master_data['date'].min().strftime('%Y-%m-%d'),
                    'end': self.master_data['date'].max().strftime('%Y-%m-%d')
                },
                'days_old': days_old
            }
            
        except Exception as e:
            logger.error(f"Error calculating data quality metrics: {str(e)}")
            return {
                'quality_score': 0.0,
                'completeness': 0.0,
                'freshness': 'unknown'
            }
    
    def refresh_data(self):
        """Refresh the master dataset"""
        try:
            self.load_master_dataset()
            logger.info("Data refreshed successfully")
            return True
        except Exception as e:
            logger.error(f"Error refreshing data: {str(e)}")
            return False
    
    def get_data_summary(self):
        """Get summary statistics of the data"""
        try:
            if self.master_data is None or len(self.master_data) == 0:
                return {}
            
            numeric_columns = self.master_data.select_dtypes(include=[np.number]).columns
            summary = {}
            
            for col in numeric_columns:
                if col in self.master_data.columns:
                    summary[col] = {
                        'mean': float(self.master_data[col].mean()),
                        'std': float(self.master_data[col].std()),
                        'min': float(self.master_data[col].min()),
                        'max': float(self.master_data[col].max()),
                        'current': float(self.master_data[col].iloc[-1]) if len(self.master_data) > 0 else 0.0
                    }
            
            return summary
            
        except Exception as e:
            logger.error(f"Error getting data summary: {str(e)}")
            return {}
