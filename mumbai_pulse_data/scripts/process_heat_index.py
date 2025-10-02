#!/usr/bin/env python3
"""
Calculate Heat Index from NASA POWER temperature and humidity data
This can be fully automated since NASA POWER data is already available
"""

import os
import pandas as pd
import numpy as np
import json
from datetime import datetime

# Path setup
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEAT_DIR = os.path.join(REPO_ROOT, "data", "heat")
NASA_POWER_FILE = os.path.join(HEAT_DIR, "nasa_power.csv")
HEAT_INDEX_DIR = os.path.join(HEAT_DIR, "heat_index")

# Create output directory
os.makedirs(HEAT_INDEX_DIR, exist_ok=True)

def calculate_heat_index(temp_f, humidity):
    """
    Calculate Heat Index using the National Weather Service formula
    temp_f: Temperature in Fahrenheit
    humidity: Relative humidity in %
    """
    # Heat Index formula (Rothfusz equation)
    c1 = -42.379
    c2 = 2.04901523
    c3 = 10.14333127
    c4 = -0.22475541
    c5 = -6.83783e-3
    c6 = -5.481717e-2
    c7 = 1.22874e-3
    c8 = 8.5282e-4
    c9 = -1.99e-6
    
    # Simple formula for low heat index
    simple_hi = 0.5 * (temp_f + 61.0 + ((temp_f - 68.0) * 1.2) + (humidity * 0.094))
    
    # Use simple formula if conditions are met
    if simple_hi < 80:
        return simple_hi
    
    # Full Rothfusz equation for higher temperatures
    hi = (c1 + (c2 * temp_f) + (c3 * humidity) + (c4 * temp_f * humidity) + 
          (c5 * temp_f**2) + (c6 * humidity**2) + (c7 * temp_f**2 * humidity) + 
          (c8 * temp_f * humidity**2) + (c9 * temp_f**2 * humidity**2))
    
    return hi

def categorize_heat_risk(heat_index_f):
    """Categorize heat risk based on heat index"""
    if heat_index_f < 80:
        return "Low Risk", "green"
    elif heat_index_f < 90:
        return "Caution", "yellow"
    elif heat_index_f < 105:
        return "Extreme Caution", "orange"
    elif heat_index_f < 130:
        return "Danger", "red"
    else:
        return "Extreme Danger", "darkred"

def process_heat_index():
    """Process NASA POWER data to calculate heat index"""
    print("🌡️ Processing Heat Index from NASA POWER data...")
    
    # Check if NASA POWER data exists
    if not os.path.exists(NASA_POWER_FILE):
        print(f"❌ NASA POWER data not found at: {NASA_POWER_FILE}")
        print("Please run download_nasa_power.py first")
        return False
    
    try:
        # Load NASA POWER data
        df = pd.read_csv(NASA_POWER_FILE)
        print(f"✅ Loaded {len(df)} days of NASA POWER data")
        
        # Convert temperature from Celsius to Fahrenheit
        df['temp_f'] = (df['T2M'] * 9/5) + 32
        
        # Calculate heat index
        df['heat_index_f'] = df.apply(
            lambda row: calculate_heat_index(row['temp_f'], row['RH2M']), 
            axis=1
        )
        
        # Convert back to Celsius
        df['heat_index_c'] = (df['heat_index_f'] - 32) * 5/9
        
        # Add risk categories
        risk_data = df['heat_index_f'].apply(categorize_heat_risk)
        df['heat_risk_level'] = [r[0] for r in risk_data]
        df['heat_risk_color'] = [r[1] for r in risk_data]
        
        # Create output dataframe
        heat_df = df[['date', 'T2M', 'RH2M', 'heat_index_c', 'heat_index_f', 
                     'heat_risk_level', 'heat_risk_color']].copy()
        
        # Save processed heat index data
        heat_csv = os.path.join(HEAT_INDEX_DIR, "mumbai_heat_index.csv")
        heat_df.to_csv(heat_csv, index=False)
        print(f"✅ Saved heat index data to: {heat_csv}")
        
        # Create summary statistics
        summary = {
            "total_days": len(heat_df),
            "date_range": {
                "start": heat_df['date'].min(),
                "end": heat_df['date'].max()
            },
            "heat_index_stats": {
                "min_c": float(heat_df['heat_index_c'].min()),
                "max_c": float(heat_df['heat_index_c'].max()),
                "mean_c": float(heat_df['heat_index_c'].mean()),
                "min_f": float(heat_df['heat_index_f'].min()),
                "max_f": float(heat_df['heat_index_f'].max()),
                "mean_f": float(heat_df['heat_index_f'].mean())
            },
            "risk_distribution": heat_df['heat_risk_level'].value_counts().to_dict(),
            "extreme_heat_days": len(heat_df[heat_df['heat_index_f'] > 105]),
            "generated_at": datetime.now().isoformat()
        }
        
        # Save summary
        summary_file = os.path.join(HEAT_INDEX_DIR, "heat_index_summary.json")
        with open(summary_file, 'w') as f:
            json.dump(summary, f, indent=2)
        print(f"✅ Saved summary to: {summary_file}")
        
        # Print key statistics
        print(f"\n📊 Heat Index Summary:")
        print(f"   Date range: {summary['date_range']['start']} to {summary['date_range']['end']}")
        print(f"   Average heat index: {summary['heat_index_stats']['mean_c']:.1f}°C ({summary['heat_index_stats']['mean_f']:.1f}°F)")
        print(f"   Maximum heat index: {summary['heat_index_stats']['max_c']:.1f}°C ({summary['heat_index_stats']['max_f']:.1f}°F)")
        print(f"   Extreme heat days (>105°F): {summary['extreme_heat_days']}")
        print(f"   Risk distribution: {summary['risk_distribution']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error processing heat index: {e}")
        return False

def main():
    """Main function"""
    print("🚀 Starting Heat Index calculation for Mumbai...")
    
    success = process_heat_index()
    
    if success:
        print("\n✅ Heat Index processing completed successfully!")
        print(f"Files saved to: {HEAT_INDEX_DIR}")
    else:
        print("\n❌ Heat Index processing failed.")

if __name__ == "__main__":
    main()
