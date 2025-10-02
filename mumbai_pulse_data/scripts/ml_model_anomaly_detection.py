#!/usr/bin/env python3
"""
Mumbai Pulse - Anomaly Detection System
Detects unusual environmental events and emergencies
"""

import pandas as pd
import numpy as np
import os
import json
import joblib
from datetime import datetime
from sklearn.ensemble import IsolationForest
from sklearn.svm import OneClassSVM
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.cluster import DBSCAN
import warnings
warnings.filterwarnings('ignore')

class AnomalyDetectionSystem:
    """
    Environmental Anomaly Detection System
    Identifies unusual patterns in environmental data
    """
    
    def __init__(self, data_dir=None):
        if data_dir is None:
            self.data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "ml_ready")
        else:
            self.data_dir = data_dir
            
        self.models = {}
        self.scaler = StandardScaler()
        self.anomaly_threshold = 0.1  # 10% of data expected to be anomalous
        
        # Create models directory
        self.model_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
        os.makedirs(self.model_dir, exist_ok=True)
        
        print("🚨 Anomaly Detection System Initialized")
    
    def load_data(self):
        """Load preprocessed ML data"""
        print("\n📊 Loading data for anomaly detection...")
        
        try:
            # Load master dataset
            self.master_df = pd.read_csv(os.path.join(self.data_dir, "master_dataset.csv"))
            self.master_df['date'] = pd.to_datetime(self.master_df['date'])
            
            # Select numerical features for anomaly detection
            self.feature_cols = []
            for col in self.master_df.columns:
                if col != 'date' and self.master_df[col].dtype in ['int64', 'float64']:
                    self.feature_cols.append(col)
            
            # Remove columns with too many missing values
            self.feature_cols = [col for col in self.feature_cols if self.master_df[col].notna().sum() > len(self.master_df) * 0.7]
            
            # Fill missing values
            self.features_df = self.master_df[self.feature_cols].fillna(self.master_df[self.feature_cols].median())
            
            print(f"✅ Data loaded successfully:")
            print(f"   Total samples: {len(self.master_df)}")
            print(f"   Features for anomaly detection: {len(self.feature_cols)}")
            
            return True
            
        except FileNotFoundError as e:
            print(f"❌ Error loading data: {e}")
            print("💡 Run ml_data_preparation.py first")
            return False
    
    def create_synthetic_anomalies(self):
        """Create synthetic anomalies for training and evaluation"""
        print("\n🎯 Creating synthetic anomalies for evaluation...")
        
        # Create labels (0 = normal, 1 = anomaly)
        np.random.seed(42)
        n_samples = len(self.features_df)
        n_anomalies = int(n_samples * self.anomaly_threshold)
        
        # Initialize all as normal
        self.labels = np.zeros(n_samples)
        
        # Randomly select anomaly indices
        anomaly_indices = np.random.choice(n_samples, n_anomalies, replace=False)
        self.labels[anomaly_indices] = 1
        
        # Create more realistic anomalies by modifying actual data
        self.features_with_anomalies = self.features_df.copy()
        
        for idx in anomaly_indices:
            # Randomly select features to modify
            n_features_to_modify = np.random.randint(1, min(4, len(self.feature_cols)))
            features_to_modify = np.random.choice(self.feature_cols, n_features_to_modify, replace=False)
            
            for feature in features_to_modify:
                # Add extreme values (outliers)
                current_value = self.features_with_anomalies.loc[idx, feature]
                feature_std = self.features_df[feature].std()
                feature_mean = self.features_df[feature].mean()
                
                # Create outlier (3-5 standard deviations away)
                multiplier = np.random.choice([-1, 1]) * np.random.uniform(3, 5)
                anomaly_value = feature_mean + multiplier * feature_std
                
                self.features_with_anomalies.loc[idx, feature] = anomaly_value
        
        print(f"✅ Synthetic anomalies created:")
        print(f"   Normal samples: {np.sum(self.labels == 0)}")
        print(f"   Anomalous samples: {np.sum(self.labels == 1)}")
        print(f"   Anomaly rate: {np.mean(self.labels):.1%}")
    
    def train_models(self):
        """Train multiple anomaly detection models"""
        print("\n🤖 Training Anomaly Detection Models...")
        
        # Clean and scale features
        features_clean = self.features_with_anomalies.fillna(0)
        features_clean = features_clean.replace([np.inf, -np.inf], 0)
        X_scaled = self.scaler.fit_transform(features_clean)
        
        # Model 1: Isolation Forest
        print("🔧 Training Isolation Forest...")
        iso_forest = IsolationForest(
            contamination=self.anomaly_threshold,
            random_state=42,
            n_jobs=-1
        )
        iso_forest.fit(X_scaled)
        self.models['isolation_forest'] = iso_forest
        
        # Model 2: One-Class SVM
        print("🔧 Training One-Class SVM...")
        oc_svm = OneClassSVM(
            nu=self.anomaly_threshold,
            kernel='rbf',
            gamma='scale'
        )
        oc_svm.fit(X_scaled)
        self.models['one_class_svm'] = oc_svm
        
        # Model 3: DBSCAN-based anomaly detection
        print("🔧 Training DBSCAN clustering...")
        dbscan = DBSCAN(eps=0.5, min_samples=5)
        cluster_labels = dbscan.fit_predict(X_scaled)
        
        # Points in cluster -1 are considered anomalies
        dbscan_anomalies = (cluster_labels == -1).astype(int)
        self.models['dbscan'] = dbscan
        self.dbscan_anomalies = dbscan_anomalies
        
        print("✅ All anomaly detection models trained!")
    
    def evaluate_models(self):
        """Evaluate anomaly detection performance"""
        print("\n📊 Evaluating Anomaly Detection Models...")
        
        X_scaled = self.scaler.transform(self.features_with_anomalies)
        results = {}
        
        for model_name, model in self.models.items():
            print(f"\n📈 {model_name.upper()} Results:")
            
            if model_name == 'dbscan':
                # DBSCAN uses cluster labels
                predictions = self.dbscan_anomalies
            else:
                # Isolation Forest and One-Class SVM
                predictions = model.predict(X_scaled)
                # Convert to binary (1 = anomaly, 0 = normal)
                predictions = (predictions == -1).astype(int)
            
            # Calculate metrics
            from sklearn.metrics import precision_score, recall_score, f1_score, accuracy_score
            
            precision = precision_score(self.labels, predictions, zero_division=0)
            recall = recall_score(self.labels, predictions, zero_division=0)
            f1 = f1_score(self.labels, predictions, zero_division=0)
            accuracy = accuracy_score(self.labels, predictions)
            
            print(f"   Accuracy: {accuracy:.3f}")
            print(f"   Precision: {precision:.3f}")
            print(f"   Recall: {recall:.3f}")
            print(f"   F1-Score: {f1:.3f}")
            
            # Anomaly detection specific metrics
            detected_anomalies = np.sum(predictions)
            actual_anomalies = np.sum(self.labels)
            
            print(f"   Detected anomalies: {detected_anomalies}")
            print(f"   Actual anomalies: {actual_anomalies}")
            print(f"   Detection rate: {detected_anomalies / len(predictions):.1%}")
            
            results[model_name] = {
                'accuracy': accuracy,
                'precision': precision,
                'recall': recall,
                'f1_score': f1,
                'detected_anomalies': int(detected_anomalies),
                'detection_rate': detected_anomalies / len(predictions)
            }
        
        # Select best model based on F1-score
        best_model_name = max(results.keys(), key=lambda x: results[x]['f1_score'])
        self.best_model = self.models[best_model_name]
        self.best_model_name = best_model_name
        
        print(f"\n🏆 Best model: {best_model_name} (F1-Score: {results[best_model_name]['f1_score']:.3f})")
        
        return results
    
    def detect_environmental_anomalies(self):
        """Detect specific types of environmental anomalies"""
        print("\n🔍 Analyzing Environmental Anomaly Types...")
        
        X_scaled = self.scaler.transform(self.features_with_anomalies)
        
        if self.best_model_name == 'dbscan':
            anomaly_scores = self.dbscan_anomalies
        else:
            predictions = self.best_model.predict(X_scaled)
            anomaly_scores = (predictions == -1).astype(int)
        
        # Identify anomalous dates
        anomaly_dates = self.master_df.loc[anomaly_scores == 1, 'date']
        
        # Analyze anomaly patterns
        anomaly_analysis = {
            'total_anomalies': int(np.sum(anomaly_scores)),
            'anomaly_dates': [date.strftime('%Y-%m-%d') for date in anomaly_dates],
            'anomaly_rate': float(np.mean(anomaly_scores)),
        }
        
        # Seasonal anomaly analysis
        if len(anomaly_dates) > 0:
            anomaly_months = [date.month for date in anomaly_dates]
            month_counts = pd.Series(anomaly_months).value_counts().to_dict()
            anomaly_analysis['seasonal_pattern'] = month_counts
        
        # Feature-based anomaly analysis
        if len(anomaly_dates) > 0:
            anomaly_indices = np.where(anomaly_scores == 1)[0]
            anomaly_features = self.features_with_anomalies.iloc[anomaly_indices]
            
            # Find which features are most extreme in anomalies
            feature_extremes = {}
            for feature in self.feature_cols:
                if feature in anomaly_features.columns:
                    feature_mean = self.features_df[feature].mean()
                    feature_std = self.features_df[feature].std()
                    
                    anomaly_values = anomaly_features[feature]
                    z_scores = np.abs((anomaly_values - feature_mean) / feature_std)
                    avg_z_score = np.mean(z_scores)
                    
                    if avg_z_score > 2:  # Significantly different
                        feature_extremes[feature] = float(avg_z_score)
            
            anomaly_analysis['extreme_features'] = feature_extremes
        
        print(f"✅ Environmental anomaly analysis completed:")
        print(f"   Total anomalies detected: {anomaly_analysis['total_anomalies']}")
        print(f"   Anomaly rate: {anomaly_analysis['anomaly_rate']:.1%}")
        
        if 'extreme_features' in anomaly_analysis:
            print(f"   Most extreme features: {list(anomaly_analysis['extreme_features'].keys())[:5]}")
        
        return anomaly_analysis
    
    def save_models(self):
        """Save trained models and metadata"""
        print("\n💾 Saving Anomaly Detection Models...")
        
        # Save best model
        model_path = os.path.join(self.model_dir, "anomaly_detection_system.pkl")
        joblib.dump(self.best_model, model_path)
        
        # Save scaler
        scaler_path = os.path.join(self.model_dir, "anomaly_detection_scaler.pkl")
        joblib.dump(self.scaler, scaler_path)
        
        # Save metadata
        metadata = {
            'model_type': 'anomaly_detection_system',
            'best_algorithm': self.best_model_name,
            'features': self.feature_cols,
            'anomaly_threshold': self.anomaly_threshold,
            'training_samples': len(self.features_df),
            'trained_timestamp': datetime.now().isoformat(),
            'model_description': {
                'isolation_forest': 'Detects anomalies by isolating observations',
                'one_class_svm': 'Learns decision boundary around normal data',
                'dbscan': 'Identifies anomalies as noise points in clustering'
            }
        }
        
        metadata_path = os.path.join(self.model_dir, "anomaly_detection_metadata.json")
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"✅ Best model ({self.best_model_name}) saved to: {model_path}")
        print(f"✅ Scaler saved to: {scaler_path}")
        print(f"✅ Metadata saved to: {metadata_path}")
    
    def detect_anomalies(self, new_data):
        """Detect anomalies in new data"""
        if self.best_model is None:
            print("❌ No trained model available")
            return None
        
        # Scale new data
        new_data_scaled = self.scaler.transform(new_data)
        
        # Make predictions
        if self.best_model_name == 'dbscan':
            # For DBSCAN, we need to refit or use distance-based approach
            predictions = np.zeros(len(new_data))  # Simplified for now
        else:
            predictions = self.best_model.predict(new_data_scaled)
            predictions = (predictions == -1).astype(int)
        
        return predictions

def main():
    """Main training pipeline"""
    print("🚨 Mumbai Pulse - Anomaly Detection System Training")
    print("=" * 60)
    
    # Initialize system
    anomaly_system = AnomalyDetectionSystem()
    
    # Load data
    if not anomaly_system.load_data():
        return False
    
    # Create synthetic anomalies for evaluation
    anomaly_system.create_synthetic_anomalies()
    
    # Train models
    anomaly_system.train_models()
    
    # Evaluate models
    results = anomaly_system.evaluate_models()
    
    # Analyze environmental anomalies
    anomaly_analysis = anomaly_system.detect_environmental_anomalies()
    
    # Save models
    anomaly_system.save_models()
    
    print("\n" + "=" * 60)
    print("🎉 Anomaly Detection System Training Completed!")
    print(f"🏆 Best Model: {anomaly_system.best_model_name}")
    print(f"📊 F1-Score: {results[anomaly_system.best_model_name]['f1_score']:.3f}")
    print(f"🚨 Detection Rate: {results[anomaly_system.best_model_name]['detection_rate']:.1%}")
    
    print("\n🚀 System ready for environmental anomaly detection!")
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        print("\n❌ Anomaly Detection System training failed")
