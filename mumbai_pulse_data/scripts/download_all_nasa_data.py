#!/usr/bin/env python3
"""
Master script to download all available NASA data for Mumbai
Runs all individual download scripts in sequence
"""

import os
import sys
import subprocess
from datetime import datetime

# Path setup
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def run_script(script_name):
    """Run a Python script and return success status"""
    script_path = os.path.join(SCRIPT_DIR, script_name)
    
    if not os.path.exists(script_path):
        print(f"❌ Script not found: {script_name}")
        return False
    
    print(f"\n{'='*60}")
    print(f"🚀 Running {script_name}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run([sys.executable, script_path], 
                              capture_output=False, 
                              text=True)
        
        if result.returncode == 0:
            print(f"✅ {script_name} completed successfully")
            return True
        else:
            print(f"❌ {script_name} failed with return code {result.returncode}")
            return False
            
    except Exception as e:
        print(f"❌ Error running {script_name}: {e}")
        return False

def main():
    """Main function to run all NASA data download scripts"""
    print("🌍 Mumbai Pulse - NASA Data Collection")
    print("=====================================")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # List of scripts to run in order
    scripts = [
        # Raw NASA data downloads
        "download_nasa_power.py",    # Already working - weather data
        "download_modis_data.py",    # MODIS AOD and LST
        "download_smap_data.py",     # SMAP soil moisture
        "download_viirs_data.py",    # VIIRS nighttime lights
        
        # Derived product processing
        "process_heat_index.py",     # Heat index from NASA POWER
        "process_aqi_estimation.py", # AQI estimation from MODIS AOD
        "process_flood_risk.py",     # Flood risk from SMAP + patterns
        "process_urban_patterns.py", # Urban analysis from VIIRS
    ]
    
    results = {}
    
    # Run each script
    for script in scripts:
        success = run_script(script)
        results[script] = success
    
    # Final summary
    print(f"\n{'='*60}")
    print("📊 FINAL SUMMARY")
    print(f"{'='*60}")
    
    successful = 0
    failed = 0
    
    for script, success in results.items():
        status = "✅ SUCCESS" if success else "❌ FAILED"
        if success:
            successful += 1
        else:
            failed += 1
    
    print(f"Total scripts: {len(scripts)}")
    print(f"Successful: {successful}")
    print(f"Failed: {failed}")
    
    # Categorize results
    raw_data_scripts = ["download_nasa_power.py", "download_modis_data.py", "download_smap_data.py", "download_viirs_data.py"]
    processing_scripts = ["process_heat_index.py", "process_aqi_estimation.py", "process_flood_risk.py", "process_urban_patterns.py"]
    
    raw_success = sum(1 for script in raw_data_scripts if results.get(script, False))
    processing_success = sum(1 for script in processing_scripts if results.get(script, False))
    
    print(f"\n📊 Detailed Results:")
    print(f"   Raw NASA Data: {raw_success}/{len(raw_data_scripts)} successful")
    print(f"   Derived Products: {processing_success}/{len(processing_scripts)} successful")
    
    if failed == 0:
        print("\n🎉 All NASA data collection and processing completed successfully!")
        print("✅ You now have all 11 data products for Mumbai Pulse!")
    else:
        print(f"\n⚠️ {failed} script(s) failed. Check the output above for details.")
        if raw_success > 0:
            print(f"✅ {raw_success} raw NASA datasets were successfully downloaded")
        if processing_success > 0:
            print(f"✅ {processing_success} derived products were successfully created")
    
    print(f"\nCompleted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("\n📁 Check your data folders:")
    print("   data/air/ - Air quality data")
    print("   data/heat/ - Temperature and heat data")
    print("   data/water/ - Water and flood data")
    print("   data/urban/ - Urban activity data")

if __name__ == "__main__":
    main()
