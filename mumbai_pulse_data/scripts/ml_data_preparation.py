#!/usr/bin/env python3
"""
Mumbai Pulse ML Data Preparation Pipeline
Transforms 10 NASA data products into ML-ready datasets
"""

import pandas as pd
import numpy as np
import os
import json
from datetime import datetime, timedelta
from sklearn.preprocessing import StandardScaler, LabelEncoder, MinMaxScaler
from sklearn.model_selection import train_test_split, TimeSeriesSplit
import warnings
warnings.filterwarnings('ignore')

class MumbaiPulseDataProcessor:
    """
    Comprehensive data processor for Mumbai Pulse ML pipeline
    Handles data loading, feature engineering, and ML preparation
    """
    
    def __init__(self, data_dir=None):
        if data_dir is None:
            self.data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
        else:
            self.data_dir = data_dir
            
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_names = []
        
        print("🚀 Mumbai Pulse ML Data Processor Initialized")
        print(f"📁 Data directory: {self.data_dir}")
    
    def load_all_datasets(self):
        """Load all 10 NASA data products"""
        print("\n📊 Loading all NASA data products...")
        
        datasets = {}
        
        try:
            # Load core environmental data
            datasets['aqi'] = pd.read_csv(os.path.join(self.data_dir, "air", "processed_aqi", "mumbai_aqi_estimation.csv"))
            datasets['flood'] = pd.read_csv(os.path.join(self.data_dir, "water", "flood_risk", "mumbai_flood_risk.csv"))
            datasets['urban'] = pd.read_csv(os.path.join(self.data_dir, "urban", "urban_patterns", "mumbai_urban_patterns.csv"))
            datasets['heat'] = pd.read_csv(os.path.join(self.data_dir, "heat", "heat_index", "mumbai_heat_index.csv"))
            datasets['power'] = pd.read_csv(os.path.join(self.data_dir, "heat", "nasa_power.csv"))
            
            print("✅ Successfully loaded all datasets:")
            for name, df in datasets.items():
                print(f"   {name}: {len(df)} records, {len(df.columns)} features")
                
            return datasets
            
        except FileNotFoundError as e:
            print(f"❌ Error loading datasets: {e}")
            print("💡 Make sure all data processing scripts have been run first")
            return None
    
    def create_master_dataset(self, datasets):
        """Merge all datasets into a single master dataset"""
        print("\n🔗 Creating master dataset...")
        
        # Start with AQI data as base
        master_df = datasets['aqi'].copy()
        
        # Merge flood risk data
        master_df = master_df.merge(
            datasets['flood'], 
            on='date', 
            suffixes=('', '_flood'),
            how='outer'
        )
        
        # Merge urban patterns data
        master_df = master_df.merge(
            datasets['urban'], 
            on='date', 
            suffixes=('', '_urban'),
            how='outer'
        )
        
        # Merge heat index data
        master_df = master_df.merge(
            datasets['heat'], 
            on='date', 
            suffixes=('', '_heat'),
            how='outer'
        )
        
        # Merge NASA POWER data
        master_df = master_df.merge(
            datasets['power'], 
            on='date', 
            suffixes=('', '_power'),
            how='outer'
        )
        
        print(f"✅ Master dataset created: {len(master_df)} records, {len(master_df.columns)} features")
        
        # Handle duplicate columns and clean up
        master_df = self._clean_master_dataset(master_df)
        
        return master_df
    
    def _clean_master_dataset(self, df):
        """Clean and standardize the master dataset"""
        print("\n🧹 Cleaning master dataset...")
        
        # Remove duplicate columns
        df = df.loc[:, ~df.columns.duplicated()]
        
        df['date'] = pd.to_datetime(df['date'])
        
        # Sort by date
        df = df.sort_values('date').reset_index(drop=True)
        
        # Additional NaN cleanup before scaling
        df = df.replace([np.inf, -np.inf], np.nan)
        numeric_columns = df.select_dtypes(include=[np.number]).columns
        for col in numeric_columns:
            if df[col].isna().any():
                median_val = df[col].median()
                if pd.isna(median_val):
                    df[col] = df[col].fillna(0)
                else:
                    df[col] = df[col].fillna(median_val)
        
        # Handle categorical missing values
        categorical_columns = df.select_dtypes(include=['object']).columns
        for col in categorical_columns:
            if col != 'date':
                df[col] = df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else 'unknown')
        
        print(f"✅ Dataset cleaned: {len(df)} records, {len(df.columns)} features")
        return df
    
    def engineer_features(self, df):
        """Create advanced features for ML models"""
        print("\n⚙️ Engineering advanced features...")
        
        # Temporal features
        df['day_of_year'] = df['date'].dt.dayofyear
        df['month'] = df['date'].dt.month
        df['day_of_week'] = df['date'].dt.dayofweek
        df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
        df['is_monsoon'] = df['month'].isin([6, 7, 8, 9]).astype(int)
        df['season'] = df['month'].map({
            12: 'winter', 1: 'winter', 2: 'winter',
            3: 'spring', 4: 'spring', 5: 'spring',
            6: 'monsoon', 7: 'monsoon', 8: 'monsoon', 9: 'monsoon',
            10: 'post_monsoon', 11: 'post_monsoon'
        })
        
        # Environmental composite indices
        if 'aqi_estimated' in df.columns and 'flood_risk_score' in df.columns:
            df['environmental_stress_index'] = (
                df['aqi_estimated'] * 0.3 + 
                df['flood_risk_score'] * 0.3 + 
                (df['heat_index'] if 'heat_index' in df.columns else 0) * 0.4
            )
        
        # Multi-sensor fusion features
        if 'aod_550nm' in df.columns and 'no2_column_density' in df.columns:
            df['air_quality_composite'] = df['aod_550nm'] * df['no2_column_density']
        
        if 'soil_moisture' in df.columns and 'precipitation_mm' in df.columns:
            df['water_stress_index'] = df['soil_moisture'] * df['precipitation_mm']
        
        if 'radiance_nw_cm2_sr' in df.columns and 'aqi_estimated' in df.columns:
            df['urban_environmental_load'] = df['radiance_nw_cm2_sr'] * df['aqi_estimated']
        
        # Lag features (previous day values)
        lag_columns = ['aqi_estimated', 'flood_risk_score']
        if 'heat_index' in df.columns:
            lag_columns.append('heat_index')
            
        for col in lag_columns:
            if col in df.columns:
                df[f'{col}_lag1'] = df[col].shift(1)
                df[f'{col}_lag3'] = df[col].shift(3)
        
        # Rolling averages (7-day windows)
        rolling_columns = ['aqi_estimated', 'flood_risk_score', 'environmental_stress_index']
        for col in rolling_columns:
            if col in df.columns:
                df[f'{col}_7day_avg'] = df[col].rolling(window=7, min_periods=1).mean()
                df[f'{col}_7day_std'] = df[col].rolling(window=7, min_periods=1).std()
        
        # Risk level encodings
        if 'aqi_category' in df.columns:
            df['aqi_risk_level'] = df['aqi_category'].map({
                'Good': 1, 'Satisfactory': 2, 'Moderate': 3, 
                'Poor': 4, 'Very Poor': 5, 'Severe': 6
            })
        
        if 'risk_category' in df.columns:
            df['flood_risk_level'] = df['risk_category'].map({
                'Low Risk': 1, 'Moderate Risk': 2, 'High Risk': 3,
                'Very High Risk': 4, 'Extreme Risk': 5
            })
        
        print(f"✅ Feature engineering completed: {len(df.columns)} total features")
        return df
    
    def prepare_ml_datasets(self, df):
        """Prepare datasets for different ML tasks"""
        print("\n🤖 Preparing ML-ready datasets...")
        
        # Remove non-numeric columns for ML (except target variables)
        exclude_cols = ['date', 'aqi_category', 'risk_category', 'activity_level', 'data_source']
        
        # Identify feature columns
        feature_cols = [col for col in df.columns if col not in exclude_cols]
        
        # Handle categorical variables
        categorical_cols = df[feature_cols].select_dtypes(include=['object']).columns
        for col in categorical_cols:
            if col not in self.label_encoders:
                self.label_encoders[col] = LabelEncoder()
                df[col] = self.label_encoders[col].fit_transform(df[col].astype(str))
            else:
                df[col] = self.label_encoders[col].transform(df[col].astype(str))
        
        # Store feature names
        self.feature_names = [col for col in feature_cols if col in df.columns]
        
        # Create different target variables for different models
        targets = {}
        
        # Environmental Health Score (0-100)
        if 'environmental_stress_index' in df.columns:
            targets['environmental_health'] = 100 - np.clip(df['environmental_stress_index'], 0, 100)
        
        # Risk classification targets
        if 'aqi_risk_level' in df.columns:
            targets['aqi_risk'] = df['aqi_risk_level']
        
        if 'flood_risk_level' in df.columns:
            targets['flood_risk'] = df['flood_risk_level']
        
        # Time series targets
        time_series_targets = ['aqi_estimated', 'flood_risk_score']
        if 'heat_index' in df.columns:
            time_series_targets.append('heat_index')
        
        for target in time_series_targets:
            if target in df.columns:
                targets[f'{target}_forecast'] = df[target]
        
        print(f"✅ ML datasets prepared:")
        print(f"   Features: {len(self.feature_names)}")
        print(f"   Targets: {list(targets.keys())}")
        
        return df[self.feature_names], targets, df['date']
    
    def create_train_test_splits(self, features, targets, dates, test_size=0.2):
        """Create time-aware train/test splits"""
        print("\n📊 Creating train/test splits...")
        
        # Time-based split (no data leakage)
        split_date = dates.quantile(1 - test_size)
        
        train_mask = dates <= split_date
        test_mask = dates > split_date
        
        splits = {}
        
        # Features
        X_train = features[train_mask].reset_index(drop=True)
        X_test = features[test_mask].reset_index(drop=True)
        
        # Scale features
        X_train_scaled = pd.DataFrame(
            self.scaler.fit_transform(X_train),
            columns=X_train.columns
        )
        X_test_scaled = pd.DataFrame(
            self.scaler.transform(X_test),
            columns=X_test.columns
        )
        
        splits['X_train'] = X_train_scaled
        splits['X_test'] = X_test_scaled
        splits['X_train_raw'] = X_train
        splits['X_test_raw'] = X_test
        
        # Targets
        for target_name, target_values in targets.items():
            y_train = target_values[train_mask].reset_index(drop=True)
            y_test = target_values[test_mask].reset_index(drop=True)
            
            splits[f'y_train_{target_name}'] = y_train
            splits[f'y_test_{target_name}'] = y_test
        
        # Dates
        splits['dates_train'] = dates[train_mask].reset_index(drop=True)
        splits['dates_test'] = dates[test_mask].reset_index(drop=True)
        
        print(f"✅ Train/test splits created:")
        print(f"   Training samples: {len(X_train)} ({train_mask.sum()}/{len(features)} = {train_mask.mean():.1%})")
        print(f"   Test samples: {len(X_test)} ({test_mask.sum()}/{len(features)} = {test_mask.mean():.1%})")
        print(f"   Split date: {split_date.strftime('%Y-%m-%d')}")
        
        return splits
    
    def save_processed_data(self, master_df, splits, output_dir=None):
        """Save processed data and metadata"""
        if output_dir is None:
            output_dir = os.path.join(self.data_dir, "ml_ready")
        
        os.makedirs(output_dir, exist_ok=True)
        
        print(f"\n💾 Saving processed data to: {output_dir}")
        
        # Save master dataset
        master_df.to_csv(os.path.join(output_dir, "master_dataset.csv"), index=False)
        
        # Save train/test splits
        for key, data in splits.items():
            if isinstance(data, pd.DataFrame) or isinstance(data, pd.Series):
                data.to_csv(os.path.join(output_dir, f"{key}.csv"), index=False)
        
        # Save metadata
        metadata = {
            'feature_names': self.feature_names,
            'n_features': len(self.feature_names),
            'n_samples': len(master_df),
            'date_range': {
                'start': master_df['date'].min().strftime('%Y-%m-%d'),
                'end': master_df['date'].max().strftime('%Y-%m-%d')
            },
            'processing_timestamp': datetime.now().isoformat(),
            'label_encoders': {k: list(v.classes_) for k, v in self.label_encoders.items()}
        }
        
        with open(os.path.join(output_dir, "metadata.json"), 'w') as f:
            json.dump(metadata, f, indent=2)
        
        # Save scalers
        import joblib
        joblib.dump(self.scaler, os.path.join(output_dir, "feature_scaler.pkl"))
        joblib.dump(self.label_encoders, os.path.join(output_dir, "label_encoders.pkl"))
        
        print("✅ All processed data saved successfully!")
        
        return output_dir

def main():
    """Main data preparation pipeline"""
    print("🚀 Mumbai Pulse ML Data Preparation Pipeline")
    print("=" * 60)
    
    # Initialize processor
    processor = MumbaiPulseDataProcessor()
    
    # Load all datasets
    datasets = processor.load_all_datasets()
    if datasets is None:
        return False
    
    # Create master dataset
    master_df = processor.create_master_dataset(datasets)
    
    # Engineer features
    master_df = processor.engineer_features(master_df)
    
    # Prepare ML datasets
    features, targets, dates = processor.prepare_ml_datasets(master_df)
    
    # Create train/test splits
    splits = processor.create_train_test_splits(features, targets, dates)
    
    # Save processed data
    output_dir = processor.save_processed_data(master_df, splits)
    
    print("\n" + "=" * 60)
    print("🎉 Data preparation completed successfully!")
    print(f"📁 ML-ready data saved to: {output_dir}")
    print("\n📊 Summary:")
    print(f"   Total samples: {len(master_df)}")
    print(f"   Features: {len(processor.feature_names)}")
    print(f"   Targets: {len(targets)}")
    print(f"   Date range: {master_df['date'].min().strftime('%Y-%m-%d')} to {master_df['date'].max().strftime('%Y-%m-%d')}")
    
    print("\n🚀 Ready for Model Training!")
    print("Next steps:")
    print("1. Run model training scripts")
    print("2. Evaluate model performance")
    print("3. Deploy models for real-time predictions")
    
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        print("\n❌ Data preparation failed. Please check your data files.")
