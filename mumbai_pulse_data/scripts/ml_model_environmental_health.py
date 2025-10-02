#!/usr/bin/env python3
"""
Mumbai Pulse - Environmental Health Predictor Model
Predicts overall environmental health score (0-100) using all NASA data products
"""

import pandas as pd
import numpy as np
import os
import json
import joblib
from datetime import datetime
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.model_selection import GridSearchCV, cross_val_score
import xgboost as xgb
import lightgbm as lgb
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

class EnvironmentalHealthPredictor:
    """
    Environmental Health Score Predictor
    Combines all environmental factors into a single health metric
    """
    
    def __init__(self, data_dir=None):
        if data_dir is None:
            self.data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "ml_ready")
        else:
            self.data_dir = data_dir
            
        self.models = {}
        self.best_model = None
        self.feature_importance = None
        
        # Create models directory
        self.model_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
        os.makedirs(self.model_dir, exist_ok=True)
        
        print("🌍 Environmental Health Predictor Initialized")
    
    def load_data(self):
        """Load preprocessed ML data"""
        print("\n📊 Loading ML-ready data...")
        
        try:
            # Load training data
            self.X_train = pd.read_csv(os.path.join(self.data_dir, "X_train.csv"))
            self.X_test = pd.read_csv(os.path.join(self.data_dir, "X_test.csv"))
            
            # Load environmental health targets
            self.y_train = pd.read_csv(os.path.join(self.data_dir, "y_train_environmental_health.csv")).iloc[:, 0]
            self.y_test = pd.read_csv(os.path.join(self.data_dir, "y_test_environmental_health.csv")).iloc[:, 0]
            
            print(f"✅ Data loaded successfully:")
            print(f"   Training samples: {len(self.X_train)}")
            print(f"   Test samples: {len(self.X_test)}")
            print(f"   Features: {len(self.X_train.columns)}")
            
            return True
            
        except FileNotFoundError as e:
            print(f"❌ Error loading data: {e}")
            print("💡 Run ml_data_preparation.py first")
            return False
    
    def create_environmental_health_target(self):
        """Create environmental health score if not available"""
        print("\n🎯 Creating environmental health target...")
        
        # If target doesn't exist, create it from available data
        try:
            # Load raw data to create target
            master_df = pd.read_csv(os.path.join(self.data_dir, "master_dataset.csv"))
            
            # Create composite environmental health score
            health_score = []
            for _, row in master_df.iterrows():
                score = 100  # Start with perfect health
                
                # Reduce score based on environmental factors
                if 'aqi_estimated' in row:
                    score -= min(row['aqi_estimated'] * 0.3, 30)  # Max 30 point reduction
                
                if 'flood_risk_score' in row:
                    score -= min(row['flood_risk_score'] * 0.25, 25)  # Max 25 point reduction
                
                if 'heat_index' in row:
                    if row['heat_index'] > 35:  # Dangerous heat
                        score -= min((row['heat_index'] - 35) * 2, 20)  # Max 20 point reduction
                
                if 'radiance_nw_cm2_sr' in row:
                    if row['radiance_nw_cm2_sr'] > 40:  # High urban activity
                        score -= min((row['radiance_nw_cm2_sr'] - 40) * 0.5, 15)  # Max 15 point reduction
                
                health_score.append(max(score, 0))  # Ensure non-negative
            
            # Split into train/test based on existing splits
            train_size = len(self.X_train)
            self.y_train = pd.Series(health_score[:train_size])
            self.y_test = pd.Series(health_score[train_size:train_size + len(self.X_test)])
            
            print(f"✅ Environmental health target created:")
            print(f"   Mean health score: {np.mean(health_score):.1f}")
            print(f"   Score range: {min(health_score):.1f} - {max(health_score):.1f}")
            
        except Exception as e:
            print(f"❌ Error creating target: {e}")
            # Fallback: create synthetic target
            np.random.seed(42)
            self.y_train = pd.Series(np.random.normal(70, 15, len(self.X_train)))
            self.y_test = pd.Series(np.random.normal(70, 15, len(self.X_test)))
            print("⚠️ Using synthetic environmental health scores")
    
    def train_models(self):
        """Train multiple models and select the best one"""
        print("\n🤖 Training Environmental Health Prediction Models...")
        
        # Check for NaN values and clean if necessary
        if self.X_train.isna().any().any():
            print("⚠️ Found NaN values in training data, cleaning...")
            self.X_train = self.X_train.fillna(0)
        
        if self.X_test.isna().any().any():
            print("⚠️ Found NaN values in test data, cleaning...")
            self.X_test = self.X_test.fillna(0)
        
        if self.y_train.isna().any():
            print("⚠️ Found NaN values in target data, cleaning...")
            self.y_train = self.y_train.fillna(self.y_train.median())
        
        # Define models to train
        model_configs = {
            'random_forest': {
                'model': RandomForestRegressor(random_state=42),
                'params': {
                    'n_estimators': [100, 200],
                    'max_depth': [10, 20, None],
                    'min_samples_split': [2, 5]
                }
            },
            'xgboost': {
                'model': xgb.XGBRegressor(random_state=42),
                'params': {
                    'n_estimators': [100, 200],
                    'max_depth': [6, 10],
                    'learning_rate': [0.1, 0.2]
                }
            },
            'lightgbm': {
                'model': lgb.LGBMRegressor(random_state=42, verbose=-1),
                'params': {
                    'n_estimators': [100, 200],
                    'max_depth': [6, 10],
                    'learning_rate': [0.1, 0.2]
                }
            },
            'gradient_boosting': {
                'model': GradientBoostingRegressor(random_state=42),
                'params': {
                    'n_estimators': [100],
                    'max_depth': [6],
                    'learning_rate': [0.1]
                }
            }
        }
        
        best_score = float('inf')
        
        for name, config in model_configs.items():
            print(f"\n🔧 Training {name}...")
            
            # Grid search with cross-validation
            grid_search = GridSearchCV(
                config['model'],
                config['params'],
                cv=5,
                scoring='neg_mean_squared_error',
                n_jobs=-1
            )
            
            grid_search.fit(self.X_train, self.y_train)
            
            # Store best model
            self.models[name] = grid_search.best_estimator_
            
            # Evaluate on test set
            y_pred = grid_search.best_estimator_.predict(self.X_test)
            mse = mean_squared_error(self.y_test, y_pred)
            
            print(f"   Best parameters: {grid_search.best_params_}")
            print(f"   Test MSE: {mse:.3f}")
            print(f"   Test RMSE: {np.sqrt(mse):.3f}")
            
            # Track best model
            if mse < best_score:
                best_score = mse
                self.best_model = grid_search.best_estimator_
                self.best_model_name = name
        
        print(f"\n🏆 Best model: {self.best_model_name} (RMSE: {np.sqrt(best_score):.3f})")
    
    def evaluate_model(self):
        """Comprehensive model evaluation"""
        print("\n📊 Evaluating Environmental Health Predictor...")
        
        # Predictions
        y_train_pred = self.best_model.predict(self.X_train)
        y_test_pred = self.best_model.predict(self.X_test)
        
        # Metrics
        train_metrics = {
            'mse': mean_squared_error(self.y_train, y_train_pred),
            'mae': mean_absolute_error(self.y_train, y_train_pred),
            'r2': r2_score(self.y_train, y_train_pred)
        }
        
        test_metrics = {
            'mse': mean_squared_error(self.y_test, y_test_pred),
            'mae': mean_absolute_error(self.y_test, y_test_pred),
            'r2': r2_score(self.y_test, y_test_pred)
        }
        
        print("📈 Model Performance:")
        print(f"   Training - RMSE: {np.sqrt(train_metrics['mse']):.3f}, MAE: {train_metrics['mae']:.3f}, R²: {train_metrics['r2']:.3f}")
        print(f"   Test - RMSE: {np.sqrt(test_metrics['mse']):.3f}, MAE: {test_metrics['mae']:.3f}, R²: {test_metrics['r2']:.3f}")
        
        # Feature importance
        if hasattr(self.best_model, 'feature_importances_'):
            self.feature_importance = pd.DataFrame({
                'feature': self.X_train.columns,
                'importance': self.best_model.feature_importances_
            }).sort_values('importance', ascending=False)
            
            print("\n🔍 Top 10 Most Important Features:")
            for i, row in self.feature_importance.head(10).iterrows():
                print(f"   {row['feature']}: {row['importance']:.4f}")
        
        return {
            'train_metrics': train_metrics,
            'test_metrics': test_metrics,
            'predictions': {
                'y_train_pred': y_train_pred,
                'y_test_pred': y_test_pred
            }
        }
    
    def save_model(self):
        """Save trained model and metadata"""
        print("\n💾 Saving Environmental Health Predictor...")
        
        model_path = os.path.join(self.model_dir, "environmental_health_predictor.pkl")
        joblib.dump(self.best_model, model_path)
        
        # Save metadata
        metadata = {
            'model_type': 'environmental_health_predictor',
            'algorithm': self.best_model_name,
            'features': list(self.X_train.columns),
            'target': 'environmental_health_score',
            'training_samples': len(self.X_train),
            'test_samples': len(self.X_test),
            'trained_timestamp': datetime.now().isoformat()
        }
        
        if self.feature_importance is not None:
            metadata['feature_importance'] = self.feature_importance.to_dict('records')
        
        metadata_path = os.path.join(self.model_dir, "environmental_health_predictor_metadata.json")
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"✅ Model saved to: {model_path}")
        print(f"✅ Metadata saved to: {metadata_path}")
    
    def predict_environmental_health(self, features):
        """Make environmental health predictions"""
        if self.best_model is None:
            print("❌ No trained model available")
            return None
        
        predictions = self.best_model.predict(features)
        return np.clip(predictions, 0, 100)  # Ensure valid health score range

def main():
    """Main training pipeline"""
    print("🌍 Mumbai Pulse - Environmental Health Predictor Training")
    print("=" * 60)
    
    # Initialize predictor
    predictor = EnvironmentalHealthPredictor()
    
    # Load data
    if not predictor.load_data():
        return False
    
    # Create target if needed
    if predictor.y_train is None:
        predictor.create_environmental_health_target()
    
    # Train models
    predictor.train_models()
    
    # Evaluate model
    results = predictor.evaluate_model()
    
    # Save model
    predictor.save_model()
    
    print("\n" + "=" * 60)
    print("🎉 Environmental Health Predictor Training Completed!")
    print(f"🏆 Best Model: {predictor.best_model_name}")
    print(f"📊 Test R²: {results['test_metrics']['r2']:.3f}")
    print(f"📊 Test RMSE: {np.sqrt(results['test_metrics']['mse']):.3f}")
    
    print("\n🚀 Model ready for environmental health predictions!")
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        print("\n❌ Environmental Health Predictor training failed")
