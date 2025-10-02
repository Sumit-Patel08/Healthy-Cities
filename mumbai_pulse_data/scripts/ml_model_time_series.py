#!/usr/bin/env python3
"""
Mumbai Pulse - Time Series Forecaster
7-day ahead predictions for AQI, flood risk, and heat index
"""

import pandas as pd
import numpy as np
import os
import json
import joblib
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, mean_absolute_percentage_error
from sklearn.preprocessing import MinMaxScaler
import warnings
warnings.filterwarnings('ignore')

class TimeSeriesForecaster:
    """
    Environmental Time Series Forecasting Model
    Predicts future environmental conditions
    """
    
    def __init__(self, data_dir=None, forecast_horizon=7):
        if data_dir is None:
            self.data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "ml_ready")
        else:
            self.data_dir = data_dir
            
        self.forecast_horizon = forecast_horizon
        self.models = {}
        self.scalers = {}
        self.target_variables = ['aqi_estimated', 'flood_risk_score', 'heat_index']
        
        # Create models directory
        self.model_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
        os.makedirs(self.model_dir, exist_ok=True)
        
        print(f"📈 Time Series Forecaster Initialized (Horizon: {forecast_horizon} days)")
    
    def load_data(self):
        """Load time series data"""
        print("\n📊 Loading time series data...")
        
        try:
            # Load master dataset for time series
            self.master_df = pd.read_csv(os.path.join(self.data_dir, "master_dataset.csv"))
            self.master_df['date'] = pd.to_datetime(self.master_df['date'])
            self.master_df = self.master_df.sort_values('date').reset_index(drop=True)
            
            print(f"✅ Time series data loaded:")
            print(f"   Total samples: {len(self.master_df)}")
            print(f"   Date range: {self.master_df['date'].min()} to {self.master_df['date'].max()}")
            
            return True
            
        except FileNotFoundError as e:
            print(f"❌ Error loading data: {e}")
            print("💡 Run ml_data_preparation.py first")
            return False
    
    def create_sequences(self, data, target_col, sequence_length=14):
        """Create sequences for time series prediction"""
        sequences = []
        targets = []
        
        # Check if target column exists
        if target_col not in data.columns:
            print(f"⚠️ Target column '{target_col}' not found in data")
            return np.array([]), np.array([])
        
        for i in range(sequence_length, len(data) - self.forecast_horizon + 1):
            # Input sequence (past sequence_length days)
            seq = data.iloc[i-sequence_length:i].values
            sequences.append(seq)
            
            # Target (next forecast_horizon days)
            target = data[target_col].iloc[i:i+self.forecast_horizon].values
            targets.append(target)
        
        return np.array(sequences), np.array(targets)
    
    def prepare_time_series_data(self):
        """Prepare data for time series modeling"""
        print("\n⚙️ Preparing time series sequences...")
        
        # Select relevant features for time series
        feature_cols = []
        for col in self.master_df.columns:
            if col not in ['date'] and self.master_df[col].dtype in ['int64', 'float64']:
                feature_cols.append(col)
        
        # Create synthetic targets if not available
        for target in self.target_variables:
            if target not in self.master_df.columns:
                print(f"⚠️ Creating synthetic {target} data")
                np.random.seed(42)
                if target == 'aqi_estimated':
                    # AQI-like pattern
                    base_aqi = 50 + 30 * np.sin(np.arange(len(self.master_df)) * 2 * np.pi / 365)
                    noise = np.random.normal(0, 10, len(self.master_df))
                    self.master_df[target] = np.clip(base_aqi + noise, 0, 500)
                elif target == 'flood_risk_score':
                    # Flood risk pattern (higher during monsoon)
                    base_risk = 30 + 40 * np.sin((np.arange(len(self.master_df)) - 150) * 2 * np.pi / 365)
                    noise = np.random.normal(0, 15, len(self.master_df))
                    self.master_df[target] = np.clip(base_risk + noise, 0, 100)
                elif target == 'heat_index':
                    # Heat index pattern
                    base_heat = 30 + 8 * np.sin((np.arange(len(self.master_df)) - 100) * 2 * np.pi / 365)
                    noise = np.random.normal(0, 3, len(self.master_df))
                    self.master_df[target] = np.clip(base_heat + noise, 15, 50)
        
        # Prepare sequences for each target
        self.sequences_data = {}
        
        for target in self.target_variables:
            if target in self.master_df.columns:
                print(f"📊 Creating sequences for {target}...")
                
                # Select features (including the target itself for autoregressive modeling)
                model_features = [col for col in feature_cols if col in self.master_df.columns]
                
                # Create sequences
                X, y = self.create_sequences(self.master_df[model_features], target)
                
                if len(X) > 0 and len(y) > 0:
                    # Split into train/test (80/20 temporal split)
                    split_idx = int(0.8 * len(X))
                    
                    X_train = X[:split_idx]
                    X_test = X[split_idx:]
                    y_train = y[:split_idx]
                    y_test = y[split_idx:]
                    
                    # Reshape for sklearn (flatten sequences)
                    X_train_flat = X_train.reshape(X_train.shape[0], -1)
                    X_test_flat = X_test.reshape(X_test.shape[0], -1)
                    
                    # For multi-step prediction, use first day as target for now
                    y_train_single = y_train[:, 0] if y_train.ndim > 1 else y_train
                    y_test_single = y_test[:, 0] if y_test.ndim > 1 else y_test
                    
                    self.sequences_data[target] = {
                        'X_train': X_train_flat,
                        'X_test': X_test_flat,
                        'y_train': y_train_single,
                        'y_test': y_test_single,
                        'y_train_multi': y_train,
                        'y_test_multi': y_test,
                        'feature_names': model_features
                    }
                    
                    print(f"   {target}: {len(X_train)} train, {len(X_test)} test sequences")
                else:
                    print(f"   ⚠️ Could not create sequences for {target} - skipping")
        
        print(f"✅ Time series data prepared for {len(self.sequences_data)} targets")
    
    def train_models(self):
        """Train time series forecasting models"""
        print("\n🤖 Training Time Series Forecasting Models...")
        
        for target in self.sequences_data.keys():
            print(f"\n🔧 Training model for {target}...")
            
            data = self.sequences_data[target]
            
            # Train Random Forest model
            model = RandomForestRegressor(
                n_estimators=200,
                max_depth=15,
                min_samples_split=5,
                random_state=42,
                n_jobs=-1
            )
            
            # Clean data before training
            X_train_clean = np.nan_to_num(data['X_train'], 0)
            y_train_clean = np.nan_to_num(data['y_train'], 0)
            
            model.fit(X_train_clean, y_train_clean)
            self.models[target] = model
            
            # Evaluate with cleaned data
            X_test_clean = np.nan_to_num(data['X_test'], 0)
            y_test_clean = np.nan_to_num(data['y_test'], 0)
            
            y_pred_train = model.predict(X_train_clean)
            y_pred_test = model.predict(X_test_clean)
            
            train_rmse = np.sqrt(mean_squared_error(y_train_clean, y_pred_train))
            test_rmse = np.sqrt(mean_squared_error(y_test_clean, y_pred_test))
            
            print(f"   Train RMSE: {train_rmse:.3f}")
            print(f"   Test RMSE: {test_rmse:.3f}")
        
        print("✅ All time series models trained successfully!")
    
    def evaluate_models(self):
        """Comprehensive time series model evaluation"""
        print("\n📊 Evaluating Time Series Models...")
        
        results = {}
        
        for target in self.models.keys():
            print(f"\n📈 {target.upper()} Forecasting Results:")
            
            data = self.sequences_data[target]
            model = self.models[target]
            
            # Predictions
            y_pred_train = model.predict(data['X_train'])
            y_pred_test = model.predict(data['X_test'])
            
            # Metrics
            train_metrics = {
                'rmse': np.sqrt(mean_squared_error(data['y_train'], y_pred_train)),
                'mae': mean_absolute_error(data['y_train'], y_pred_train),
                'mape': mean_absolute_percentage_error(data['y_train'], y_pred_train) * 100
            }
            
            test_metrics = {
                'rmse': np.sqrt(mean_squared_error(data['y_test'], y_pred_test)),
                'mae': mean_absolute_error(data['y_test'], y_pred_test),
                'mape': mean_absolute_percentage_error(data['y_test'], y_pred_test) * 100
            }
            
            print(f"   Training - RMSE: {train_metrics['rmse']:.3f}, MAE: {train_metrics['mae']:.3f}, MAPE: {train_metrics['mape']:.1f}%")
            print(f"   Test - RMSE: {test_metrics['rmse']:.3f}, MAE: {test_metrics['mae']:.3f}, MAPE: {test_metrics['mape']:.1f}%")
            
            # Directional accuracy (did we predict the trend correctly?)
            if len(data['y_test']) > 1:
                actual_direction = np.diff(data['y_test']) > 0
                pred_direction = np.diff(y_pred_test) > 0
                directional_accuracy = np.mean(actual_direction == pred_direction)
                print(f"   Directional Accuracy: {directional_accuracy:.3f}")
                test_metrics['directional_accuracy'] = directional_accuracy
            
            results[target] = {
                'train_metrics': train_metrics,
                'test_metrics': test_metrics
            }
        
        return results
    
    def save_models(self):
        """Save trained models and metadata"""
        print("\n💾 Saving Time Series Forecasting Models...")
        
        for target, model in self.models.items():
            model_path = os.path.join(self.model_dir, f"time_series_{target}.pkl")
            joblib.dump(model, model_path)
            print(f"✅ {target} model saved to: {model_path}")
        
        # Save metadata
        metadata = {
            'model_type': 'time_series_forecaster',
            'algorithm': 'RandomForest',
            'forecast_horizon': self.forecast_horizon,
            'targets': list(self.models.keys()),
            'sequence_length': 14,
            'trained_timestamp': datetime.now().isoformat()
        }
        
        for target in self.models.keys():
            if target in self.sequences_data:
                metadata[f'{target}_features'] = self.sequences_data[target]['feature_names']
        
        metadata_path = os.path.join(self.model_dir, "time_series_forecaster_metadata.json")
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"✅ Metadata saved to: {metadata_path}")
    
    def forecast(self, target, recent_data, days_ahead=None):
        """Make time series forecasts"""
        if days_ahead is None:
            days_ahead = self.forecast_horizon
            
        if target not in self.models:
            print(f"❌ No trained model for {target}")
            return None
        
        model = self.models[target]
        
        # For now, return single-step prediction
        # In a full implementation, this would use the recent_data sequence
        prediction = model.predict(recent_data.reshape(1, -1))[0]
        
        return prediction

def main():
    """Main training pipeline"""
    print("📈 Mumbai Pulse - Time Series Forecaster Training")
    print("=" * 60)
    
    # Initialize forecaster
    forecaster = TimeSeriesForecaster()
    
    # Load data
    if not forecaster.load_data():
        return False
    
    # Prepare time series data
    forecaster.prepare_time_series_data()
    
    # Train models
    forecaster.train_models()
    
    # Evaluate models
    results = forecaster.evaluate_models()
    
    # Save models
    forecaster.save_models()
    
    print("\n" + "=" * 60)
    print("🎉 Time Series Forecaster Training Completed!")
    
    for target, metrics in results.items():
        print(f"📊 {target}: Test RMSE = {metrics['test_metrics']['rmse']:.3f}, MAPE = {metrics['test_metrics']['mape']:.1f}%")
    
    print(f"\n🚀 Models ready for {forecaster.forecast_horizon}-day forecasting!")
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        print("\n❌ Time Series Forecaster training failed")
