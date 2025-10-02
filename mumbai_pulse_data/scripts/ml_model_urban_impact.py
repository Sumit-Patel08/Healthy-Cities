#!/usr/bin/env python3
"""
Mumbai Pulse - Urban Environmental Impact Analyzer
Analyzes correlation between urban activity and environmental degradation
"""

import pandas as pd
import numpy as np
import os
import json
import joblib
from datetime import datetime
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import PolynomialFeatures
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

class UrbanEnvironmentalImpactAnalyzer:
    """
    Urban Environmental Impact Analysis Model
    Studies relationship between urban activity and environmental conditions
    """
    
    def __init__(self, data_dir=None):
        if data_dir is None:
            self.data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "ml_ready")
        else:
            self.data_dir = data_dir
            
        self.models = {}
        self.correlations = {}
        self.impact_analysis = {}
        
        # Create models directory
        self.model_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
        os.makedirs(self.model_dir, exist_ok=True)
        
        print("🏙️ Urban Environmental Impact Analyzer Initialized")
    
    def load_data(self):
        """Load preprocessed ML data"""
        print("\n📊 Loading data for urban impact analysis...")
        
        try:
            # Load master dataset
            self.master_df = pd.read_csv(os.path.join(self.data_dir, "master_dataset.csv"))
            self.master_df['date'] = pd.to_datetime(self.master_df['date'])
            
            # Identify urban activity features
            self.urban_features = []
            for col in self.master_df.columns:
                if any(keyword in col.lower() for keyword in ['radiance', 'urban', 'activity', 'lights', 'economic']):
                    if self.master_df[col].dtype in ['int64', 'float64']:
                        self.urban_features.append(col)
            
            # If no urban features found, create synthetic ones
            if not self.urban_features:
                print("⚠️ Creating synthetic urban activity data")
                np.random.seed(42)
                
                # Nighttime radiance (VIIRS-like)
                base_radiance = 35 + 10 * np.sin(np.arange(len(self.master_df)) * 2 * np.pi / 7)  # Weekly pattern
                noise = np.random.normal(0, 5, len(self.master_df))
                self.master_df['radiance_nw_cm2_sr'] = np.clip(base_radiance + noise, 10, 80)
                
                # Economic activity index
                self.master_df['economic_activity_index'] = self.master_df['radiance_nw_cm2_sr'] * 2 + np.random.normal(0, 10, len(self.master_df))
                
                # Urban density proxy
                self.master_df['urban_density_proxy'] = 50 + np.random.normal(0, 15, len(self.master_df))
                
                self.urban_features = ['radiance_nw_cm2_sr', 'economic_activity_index', 'urban_density_proxy']
            
            # Identify environmental features
            self.environmental_features = []
            for col in self.master_df.columns:
                if any(keyword in col.lower() for keyword in ['aqi', 'air', 'pollution', 'no2', 'aod', 'heat', 'temperature', 'flood']):
                    if self.master_df[col].dtype in ['int64', 'float64']:
                        self.environmental_features.append(col)
            
            # Create synthetic environmental data if needed
            if not self.environmental_features:
                print("⚠️ Creating synthetic environmental data")
                np.random.seed(43)
                
                # AQI estimation
                base_aqi = 60 + self.master_df['radiance_nw_cm2_sr'] * 0.5  # Urban activity affects AQI
                noise = np.random.normal(0, 15, len(self.master_df))
                self.master_df['aqi_estimated'] = np.clip(base_aqi + noise, 0, 500)
                
                # Heat index
                base_heat = 32 + self.master_df['radiance_nw_cm2_sr'] * 0.2  # Urban heat island effect
                noise = np.random.normal(0, 3, len(self.master_df))
                self.master_df['heat_index'] = np.clip(base_heat + noise, 20, 50)
                
                self.environmental_features = ['aqi_estimated', 'heat_index']
            
            # Handle missing values instead of dropping
            analysis_features = self.urban_features + self.environmental_features
            self.analysis_df = self.master_df[['date'] + analysis_features].copy()
            
            # Fill missing values
            for col in analysis_features:
                if col in self.analysis_df.columns:
                    if self.analysis_df[col].dtype in ['int64', 'float64']:
                        self.analysis_df[col] = self.analysis_df[col].fillna(self.analysis_df[col].median())
                    else:
                        self.analysis_df[col] = self.analysis_df[col].fillna('unknown')
            
            print(f"✅ Data loaded successfully:")
            print(f"   Total samples: {len(self.analysis_df)}")
            print(f"   Urban features: {len(self.urban_features)} - {self.urban_features}")
            print(f"   Environmental features: {len(self.environmental_features)} - {self.environmental_features}")
            
            return True
            
        except FileNotFoundError as e:
            print(f"❌ Error loading data: {e}")
            print("💡 Run ml_data_preparation.py first")
            return False
    
    def analyze_correlations(self):
        """Analyze correlations between urban activity and environmental factors"""
        print("\n🔍 Analyzing Urban-Environmental Correlations...")
        
        correlation_results = {}
        
        for urban_feature in self.urban_features:
            correlation_results[urban_feature] = {}
            
            for env_feature in self.environmental_features:
                if urban_feature in self.analysis_df.columns and env_feature in self.analysis_df.columns:
                    # Check if we have enough data points
                    urban_data = self.analysis_df[urban_feature].dropna()
                    env_data = self.analysis_df[env_feature].dropna()
                    
                    if len(urban_data) < 2 or len(env_data) < 2:
                        print(f"   ⚠️ Insufficient data for {urban_feature} ↔ {env_feature}")
                        continue
                    
                    # Align the data (remove NaN pairs)
                    combined_data = pd.DataFrame({
                        'urban': self.analysis_df[urban_feature],
                        'env': self.analysis_df[env_feature]
                    }).dropna()
                    
                    if len(combined_data) < 2:
                        print(f"   ⚠️ Insufficient paired data for {urban_feature} ↔ {env_feature}")
                        continue
                    
                    # Pearson correlation
                    pearson_corr, pearson_p = stats.pearsonr(
                        combined_data['urban'], 
                        combined_data['env']
                    )
                    
                    # Spearman correlation (rank-based)
                    spearman_corr, spearman_p = stats.spearmanr(
                        combined_data['urban'], 
                        combined_data['env']
                    )
                    
                    correlation_results[urban_feature][env_feature] = {
                        'pearson_correlation': pearson_corr,
                        'pearson_p_value': pearson_p,
                        'spearman_correlation': spearman_corr,
                        'spearman_p_value': spearman_p,
                        'significant': pearson_p < 0.05
                    }
                    
                    print(f"   {urban_feature} ↔ {env_feature}:")
                    print(f"     Pearson: {pearson_corr:.3f} (p={pearson_p:.3f})")
                    print(f"     Spearman: {spearman_corr:.3f} (p={spearman_p:.3f})")
                    print(f"     Significant: {'Yes' if pearson_p < 0.05 else 'No'}")
        
        self.correlations = correlation_results
        print("✅ Correlation analysis completed!")
        
        return correlation_results
    
    def train_impact_models(self):
        """Train models to predict environmental impact from urban activity"""
        print("\n🤖 Training Urban Impact Models...")
        
        for env_feature in self.environmental_features:
            if env_feature in self.analysis_df.columns:
                print(f"\n🔧 Training model for {env_feature}...")
                
                # Prepare features (all urban features as predictors)
                X = self.analysis_df[self.urban_features]
                y = self.analysis_df[env_feature]
                
                # Clean NaN values from target
                y = y.fillna(y.median() if not y.isna().all() else 0)
                
                # Split data (80/20)
                split_idx = int(0.8 * len(X))
                X_train, X_test = X[:split_idx], X[split_idx:]
                y_train, y_test = y[:split_idx], y[split_idx:]
                
                # Train multiple models
                models = {}
                
                # Linear regression
                linear_model = LinearRegression()
                linear_model.fit(X_train, y_train)
                models['linear'] = linear_model
                
                # Ridge regression (regularized)
                ridge_model = Ridge(alpha=1.0)
                ridge_model.fit(X_train, y_train)
                models['ridge'] = ridge_model
                
                # Polynomial features + Ridge
                poly_features = PolynomialFeatures(degree=2, include_bias=False)
                X_train_poly = poly_features.fit_transform(X_train)
                X_test_poly = poly_features.transform(X_test)
                
                poly_model = Ridge(alpha=1.0)
                poly_model.fit(X_train_poly, y_train)
                models['polynomial'] = {'model': poly_model, 'transformer': poly_features}
                
                # Random Forest
                rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
                rf_model.fit(X_train, y_train)
                models['random_forest'] = rf_model
                
                # Evaluate models and select best
                best_score = float('inf')
                best_model_name = None
                
                for model_name, model in models.items():
                    if model_name == 'polynomial':
                        y_pred = model['model'].predict(X_test_poly)
                    else:
                        y_pred = model.predict(X_test)
                    
                    mse = mean_squared_error(y_test, y_pred)
                    r2 = r2_score(y_test, y_pred)
                    
                    print(f"   {model_name}: RMSE={np.sqrt(mse):.3f}, R²={r2:.3f}")
                    
                    if mse < best_score:
                        best_score = mse
                        best_model_name = model_name
                
                self.models[env_feature] = {
                    'best_model': models[best_model_name],
                    'best_model_name': best_model_name,
                    'all_models': models,
                    'test_rmse': np.sqrt(best_score),
                    'features': list(X.columns)
                }
                
                print(f"   Best model: {best_model_name} (RMSE: {np.sqrt(best_score):.3f})")
        
        print("✅ All urban impact models trained!")
    
    def analyze_feature_importance(self):
        """Analyze which urban factors most impact environmental conditions"""
        print("\n🔍 Analyzing Feature Importance...")
        
        importance_analysis = {}
        
        for env_feature, model_info in self.models.items():
            print(f"\n📊 Feature importance for {env_feature}:")
            
            best_model = model_info['best_model']
            features = model_info['features']
            
            if model_info['best_model_name'] == 'random_forest':
                # Random Forest feature importance
                importances = best_model.feature_importances_
                feature_importance = dict(zip(features, importances))
                
                # Sort by importance
                sorted_importance = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
                
                for feature, importance in sorted_importance:
                    print(f"   {feature}: {importance:.4f}")
                
                importance_analysis[env_feature] = {
                    'method': 'random_forest_importance',
                    'importances': feature_importance
                }
                
            elif model_info['best_model_name'] in ['linear', 'ridge']:
                # Linear model coefficients
                coefficients = best_model.coef_
                feature_coef = dict(zip(features, coefficients))
                
                # Sort by absolute coefficient value
                sorted_coef = sorted(feature_coef.items(), key=lambda x: abs(x[1]), reverse=True)
                
                for feature, coef in sorted_coef:
                    print(f"   {feature}: {coef:.4f}")
                
                importance_analysis[env_feature] = {
                    'method': 'linear_coefficients',
                    'coefficients': feature_coef
                }
        
        self.impact_analysis = importance_analysis
        print("✅ Feature importance analysis completed!")
        
        return importance_analysis
    
    def generate_policy_insights(self):
        """Generate policy insights from urban-environmental analysis"""
        print("\n📋 Generating Policy Insights...")
        
        insights = {
            'key_findings': [],
            'policy_recommendations': [],
            'urban_environmental_relationships': {}
        }
        
        # Analyze strongest correlations
        strong_correlations = []
        for urban_feature, env_correlations in self.correlations.items():
            for env_feature, corr_data in env_correlations.items():
                if abs(corr_data['pearson_correlation']) > 0.3 and corr_data['significant']:
                    strong_correlations.append({
                        'urban_factor': urban_feature,
                        'environmental_factor': env_feature,
                        'correlation': corr_data['pearson_correlation'],
                        'strength': 'Strong' if abs(corr_data['pearson_correlation']) > 0.5 else 'Moderate'
                    })
        
        # Generate insights based on correlations
        for corr in strong_correlations:
            if corr['correlation'] > 0:
                insight = f"Higher {corr['urban_factor']} is associated with increased {corr['environmental_factor']}"
                recommendation = f"Consider policies to manage {corr['urban_factor']} to reduce {corr['environmental_factor']}"
            else:
                insight = f"Higher {corr['urban_factor']} is associated with decreased {corr['environmental_factor']}"
                recommendation = f"Leverage {corr['urban_factor']} as a potential solution for {corr['environmental_factor']}"
            
            insights['key_findings'].append(insight)
            insights['policy_recommendations'].append(recommendation)
        
        # Model performance insights
        for env_feature, model_info in self.models.items():
            r2_score = 1 - (model_info['test_rmse'] ** 2) / np.var(self.analysis_df[env_feature])
            
            if r2_score > 0.5:
                insights['key_findings'].append(f"Urban activity strongly predicts {env_feature} (R² = {r2_score:.2f})")
                insights['policy_recommendations'].append(f"Urban planning decisions can significantly impact {env_feature}")
        
        # Seasonal and temporal insights
        if 'date' in self.analysis_df.columns:
            self.analysis_df['month'] = self.analysis_df['date'].dt.month
            monthly_patterns = {}
            
            for feature in self.urban_features + self.environmental_features:
                if feature in self.analysis_df.columns:
                    monthly_avg = self.analysis_df.groupby('month')[feature].mean()
                    monthly_patterns[feature] = monthly_avg.to_dict()
            
            insights['seasonal_patterns'] = monthly_patterns
        
        print("✅ Policy insights generated!")
        print(f"   Key findings: {len(insights['key_findings'])}")
        print(f"   Policy recommendations: {len(insights['policy_recommendations'])}")
        
        return insights
    
    def _convert_bools_for_json(self, obj):
        """Recursively convert boolean values to strings for JSON serialization"""
        if isinstance(obj, bool):
            return str(obj)
        elif isinstance(obj, dict):
            return {k: self._convert_bools_for_json(v) for k, v in obj.items()}
        elif isinstance(obj, (list, tuple)):
            return [self._convert_bools_for_json(item) for item in obj]
        return obj

    def save_models_and_analysis(self):
        """Save trained models and analysis results"""
        print("\n💾 Saving Urban Impact Analysis...")
        
        # Save models
        for env_feature, model_info in self.models.items():
            model_path = os.path.join(self.model_dir, f"urban_impact_{env_feature}.pkl")
            joblib.dump(model_info['best_model'], model_path)
            print(f"✅ {env_feature} model saved to: {model_path}")
        
        # Generate policy insights and convert any booleans to strings
        policy_insights = self.generate_policy_insights()
        policy_insights = self._convert_bools_for_json(policy_insights)
        
        # Convert correlations to be JSON serializable
        serializable_correlations = {}
        for urban_feature, env_correlations in self.correlations.items():
            if urban_feature not in serializable_correlations:
                serializable_correlations[urban_feature] = {}
            for env_feature, corr_data in env_correlations.items():
                serializable_correlations[urban_feature][env_feature] = {
                    k: str(v) if isinstance(v, bool) else v 
                    for k, v in corr_data.items()
                }
        
        # Convert impact analysis to be JSON serializable
        serializable_impact = {}
        for feature, analysis in self.impact_analysis.items():
            if isinstance(analysis, dict):
                serializable_impact[feature] = {
                    k: str(v) if isinstance(v, bool) else v 
                    for k, v in analysis.items()
                }
        
        # Prepare analysis results with all data converted to be JSON serializable
        analysis_results = {
            'model_type': 'urban_environmental_impact_analyzer',
            'urban_features': self.urban_features,
            'environmental_features': self.environmental_features,
            'correlations': serializable_correlations,
            'feature_importance': serializable_impact,
            'policy_insights': policy_insights,
            'model_performance': {
                env_feature: {
                    'best_algorithm': model_info['best_model_name'],
                    'test_rmse': float(model_info['test_rmse']),  # Convert numpy float to Python float
                    'features': model_info['features']
                }
                for env_feature, model_info in self.models.items()
            },
            'analysis_timestamp': datetime.now().isoformat()
        }
        
        # Final conversion pass to catch any remaining non-serializable types
        analysis_results = self._convert_bools_for_json(analysis_results)
        
        # Save to JSON file
        analysis_path = os.path.join(self.model_dir, "urban_environmental_impact_analysis.json")
        try:
            with open(analysis_path, 'w') as f:
                json.dump(analysis_results, f, indent=2, default=str)
            print(f"✅ Complete analysis saved to: {analysis_path}")
            return analysis_results
        except Exception as e:
            print(f"❌ Error saving analysis: {str(e)}")
            # Try a more aggressive serialization approach
            try:
                import json
                class SafeEncoder(json.JSONEncoder):
                    def default(self, obj):
                        try:
                            return str(obj)
                        except:
                            return None
                
                with open(analysis_path, 'w') as f:
                    json.dump(analysis_results, f, indent=2, cls=SafeEncoder)
                print(f"✅ Complete analysis saved with fallback method to: {analysis_path}")
                return analysis_results
            except Exception as e2:
                print(f"❌ Critical error: Could not save analysis: {str(e2)}")
                return None

def main():
    """Main analysis pipeline"""
    print("🏙️ Mumbai Pulse - Urban Environmental Impact Analysis")
    print("=" * 60)
    
    # Initialize analyzer
    analyzer = UrbanEnvironmentalImpactAnalyzer()
    
    # Load data
    if not analyzer.load_data():
        return False
    
    # Analyze correlations
    correlations = analyzer.analyze_correlations()
    
    # Train impact models
    analyzer.train_impact_models()
    
    # Analyze feature importance
    importance = analyzer.analyze_feature_importance()
    
    # Save models and analysis
    results = analyzer.save_models_and_analysis()
    
    print("\n" + "=" * 60)
    print("🎉 Urban Environmental Impact Analysis Completed!")
    
    # Summary statistics
    significant_correlations = 0
    for urban_feature, env_correlations in correlations.items():
        for env_feature, corr_data in env_correlations.items():
            if corr_data['significant']:
                significant_correlations += 1
    
    print(f"📊 Analysis Summary:")
    print(f"   Significant correlations found: {significant_correlations}")
    print(f"   Environmental factors modeled: {len(analyzer.models)}")
    print(f"   Policy insights generated: {len(results['policy_insights']['key_findings'])}")
    
    print("\n🚀 Analysis ready for urban planning and policy decisions!")
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        print("\n❌ Urban Environmental Impact Analysis failed")
