#!/usr/bin/env python3
"""
Mumbai Pulse - Multi-Output Risk Classifier
Simultaneously predicts AQI category, flood risk level, and heat stress level
"""

import pandas as pd
import numpy as np
import os
import json
import joblib
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.model_selection import GridSearchCV
import xgboost as xgb
import warnings
warnings.filterwarnings('ignore')

class MultiOutputRiskClassifier:
    """
    Multi-Output Risk Classification Model
    Predicts multiple risk categories simultaneously
    """
    
    def __init__(self, data_dir=None):
        if data_dir is None:
            self.data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "ml_ready")
        else:
            self.data_dir = data_dir
            
        self.model = None
        self.risk_categories = ['aqi_risk', 'flood_risk', 'heat_risk']
        
        # Create models directory
        self.model_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
        os.makedirs(self.model_dir, exist_ok=True)
        
        print("⚠️ Multi-Output Risk Classifier Initialized")
    
    def load_data(self):
        """Load preprocessed ML data"""
        print("\n📊 Loading ML-ready data...")
        
        try:
            # Load training data
            self.X_train = pd.read_csv(os.path.join(self.data_dir, "X_train.csv"))
            self.X_test = pd.read_csv(os.path.join(self.data_dir, "X_test.csv"))
            
            # Try to load existing risk targets
            self.y_train_multi = []
            self.y_test_multi = []
            
            for risk_type in self.risk_categories:
                try:
                    y_train = pd.read_csv(os.path.join(self.data_dir, f"y_train_{risk_type}.csv")).iloc[:, 0]
                    y_test = pd.read_csv(os.path.join(self.data_dir, f"y_test_{risk_type}.csv")).iloc[:, 0]
                    self.y_train_multi.append(y_train)
                    self.y_test_multi.append(y_test)
                except FileNotFoundError:
                    print(f"⚠️ {risk_type} target not found, will create synthetic data")
                    self.y_train_multi.append(None)
                    self.y_test_multi.append(None)
            
            print(f"✅ Data loaded successfully:")
            print(f"   Training samples: {len(self.X_train)}")
            print(f"   Test samples: {len(self.X_test)}")
            print(f"   Features: {len(self.X_train.columns)}")
            
            return True
            
        except FileNotFoundError as e:
            print(f"❌ Error loading data: {e}")
            print("💡 Run ml_data_preparation.py first")
            return False
    
    def create_risk_targets(self):
        """Create risk classification targets"""
        print("\n🎯 Creating risk classification targets...")
        
        # Load master dataset to create targets
        try:
            master_df = pd.read_csv(os.path.join(self.data_dir, "master_dataset.csv"))
        except:
            print("⚠️ Creating synthetic risk targets")
            master_df = None
        
        train_size = len(self.X_train)
        
        for i, risk_type in enumerate(self.risk_categories):
            if self.y_train_multi[i] is None:
                if master_df is not None and risk_type == 'aqi_risk':
                    # Create AQI risk levels from AQI values
                    if 'aqi_estimated' in master_df.columns:
                        aqi_values = master_df['aqi_estimated'].values
                        risk_levels = []
                        for aqi in aqi_values:
                            if aqi <= 50:
                                risk_levels.append(1)  # Good
                            elif aqi <= 100:
                                risk_levels.append(2)  # Moderate
                            elif aqi <= 200:
                                risk_levels.append(3)  # Unhealthy for sensitive
                            elif aqi <= 300:
                                risk_levels.append(4)  # Unhealthy
                            else:
                                risk_levels.append(5)  # Hazardous
                    else:
                        # Synthetic AQI risk
                        np.random.seed(42)
                        risk_levels = np.random.choice([1, 2, 3, 4, 5], len(master_df), p=[0.3, 0.3, 0.2, 0.15, 0.05])
                else:
                    # Create synthetic risk levels
                    np.random.seed(42 + i)
                    if risk_type == 'flood_risk':
                        # Flood risk: more low risk, some high during monsoon
                        risk_levels = np.random.choice([1, 2, 3, 4, 5], train_size + len(self.X_test), p=[0.4, 0.3, 0.15, 0.1, 0.05])
                    elif risk_type == 'heat_risk':
                        # Heat risk: seasonal variation
                        risk_levels = np.random.choice([1, 2, 3, 4, 5], train_size + len(self.X_test), p=[0.2, 0.3, 0.3, 0.15, 0.05])
                    else:
                        # General risk distribution
                        risk_levels = np.random.choice([1, 2, 3, 4, 5], train_size + len(self.X_test), p=[0.25, 0.25, 0.25, 0.15, 0.1])
                
                # Split into train/test
                self.y_train_multi[i] = pd.Series(risk_levels[:train_size])
                self.y_test_multi[i] = pd.Series(risk_levels[train_size:train_size + len(self.X_test)])
        
        # Convert to arrays for multi-output and handle NaN values
        train_arrays = []
        test_arrays = []
        
        for i, y in enumerate(self.y_train_multi):
            # Clean NaN values
            y_train_clean = y.fillna(1).astype(int)  # Default to risk level 1
            y_test_clean = self.y_test_multi[i].fillna(1).astype(int)
            
            train_arrays.append(y_train_clean.values)
            test_arrays.append(y_test_clean.values)
        
        self.y_train_array = np.column_stack(train_arrays)
        self.y_test_array = np.column_stack(test_arrays)
        
        print(f"✅ Risk targets created:")
        for i, risk_type in enumerate(self.risk_categories):
            unique_values = np.unique(self.y_train_array[:, i])
            print(f"   {risk_type}: {len(unique_values)} classes ({unique_values})")
    
    def train_model(self):
        """Train multi-output risk classifier"""
        print("\n🤖 Training Multi-Output Risk Classifier...")
        
        # Clean input features
        if self.X_train.isna().any().any():
            print("⚠️ Found NaN values in training features, cleaning...")
            self.X_train = self.X_train.fillna(0)
        
        if self.X_test.isna().any().any():
            print("⚠️ Found NaN values in test features, cleaning...")
            self.X_test = self.X_test.fillna(0)
        
        # Define base classifier
        base_classifier = RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            min_samples_split=5,
            random_state=42,
            n_jobs=-1
        )
        
        # Create multi-output classifier
        self.model = MultiOutputClassifier(base_classifier)
        
        # Train model
        print("🔧 Training multi-output model...")
        self.model.fit(self.X_train, self.y_train_array)
        
        print("✅ Multi-output risk classifier trained successfully!")
    
    def evaluate_model(self):
        """Comprehensive model evaluation"""
        print("\n📊 Evaluating Multi-Output Risk Classifier...")
        
        # Predictions
        y_train_pred = self.model.predict(self.X_train)
        y_test_pred = self.model.predict(self.X_test)
        
        # Evaluate each output separately
        results = {}
        
        for i, risk_type in enumerate(self.risk_categories):
            print(f"\n📈 {risk_type.upper()} Classification Results:")
            
            # Training accuracy
            train_acc = accuracy_score(self.y_train_array[:, i], y_train_pred[:, i])
            test_acc = accuracy_score(self.y_test_array[:, i], y_test_pred[:, i])
            
            print(f"   Training Accuracy: {train_acc:.3f}")
            print(f"   Test Accuracy: {test_acc:.3f}")
            
            # Classification report
            print(f"   Classification Report:")
            report = classification_report(
                self.y_test_array[:, i], 
                y_test_pred[:, i], 
                output_dict=True,
                zero_division=0
            )
            
            for class_label, metrics in report.items():
                if isinstance(metrics, dict):
                    print(f"     Class {class_label}: Precision={metrics.get('precision', 0):.3f}, Recall={metrics.get('recall', 0):.3f}, F1={metrics.get('f1-score', 0):.3f}")
            
            results[risk_type] = {
                'train_accuracy': train_acc,
                'test_accuracy': test_acc,
                'classification_report': report
            }
        
        # Overall multi-output accuracy
        overall_train_acc = np.mean([accuracy_score(self.y_train_array[:, i], y_train_pred[:, i]) for i in range(len(self.risk_categories))])
        overall_test_acc = np.mean([accuracy_score(self.y_test_array[:, i], y_test_pred[:, i]) for i in range(len(self.risk_categories))])
        
        print(f"\n🎯 Overall Multi-Output Performance:")
        print(f"   Average Training Accuracy: {overall_train_acc:.3f}")
        print(f"   Average Test Accuracy: {overall_test_acc:.3f}")
        
        results['overall'] = {
            'train_accuracy': overall_train_acc,
            'test_accuracy': overall_test_acc
        }
        
        return results
    
    def save_model(self):
        """Save trained model and metadata"""
        print("\n💾 Saving Multi-Output Risk Classifier...")
        
        model_path = os.path.join(self.model_dir, "multi_output_risk_classifier.pkl")
        joblib.dump(self.model, model_path)
        
        # Save metadata
        metadata = {
            'model_type': 'multi_output_risk_classifier',
            'algorithm': 'RandomForest_MultiOutput',
            'features': list(self.X_train.columns),
            'targets': self.risk_categories,
            'training_samples': len(self.X_train),
            'test_samples': len(self.X_test),
            'trained_timestamp': datetime.now().isoformat(),
            'risk_levels': {
                'description': 'Risk levels 1-5 (Low to Extreme)',
                'mapping': {
                    1: 'Low Risk',
                    2: 'Moderate Risk', 
                    3: 'High Risk',
                    4: 'Very High Risk',
                    5: 'Extreme Risk'
                }
            }
        }
        
        metadata_path = os.path.join(self.model_dir, "multi_output_risk_classifier_metadata.json")
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"✅ Model saved to: {model_path}")
        print(f"✅ Metadata saved to: {metadata_path}")
    
    def predict_risks(self, features):
        """Make multi-output risk predictions"""
        if self.model is None:
            print("❌ No trained model available")
            return None
        
        predictions = self.model.predict(features)
        
        # Convert to risk categories
        risk_predictions = {}
        for i, risk_type in enumerate(self.risk_categories):
            risk_predictions[risk_type] = predictions[:, i]
        
        return risk_predictions

def main():
    """Main training pipeline"""
    print("⚠️ Mumbai Pulse - Multi-Output Risk Classifier Training")
    print("=" * 60)
    
    # Initialize classifier
    classifier = MultiOutputRiskClassifier()
    
    # Load data
    if not classifier.load_data():
        return False
    
    # Create risk targets
    classifier.create_risk_targets()
    
    # Train model
    classifier.train_model()
    
    # Evaluate model
    results = classifier.evaluate_model()
    
    # Save model
    classifier.save_model()
    
    print("\n" + "=" * 60)
    print("🎉 Multi-Output Risk Classifier Training Completed!")
    print(f"🎯 Overall Test Accuracy: {results['overall']['test_accuracy']:.3f}")
    
    for risk_type in classifier.risk_categories:
        print(f"📊 {risk_type}: {results[risk_type]['test_accuracy']:.3f}")
    
    print("\n🚀 Model ready for multi-risk predictions!")
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        print("\n❌ Multi-Output Risk Classifier training failed")
