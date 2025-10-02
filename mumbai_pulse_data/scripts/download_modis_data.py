#!/usr/bin/env python3
"""
Download MODIS AOD and LST data for Mumbai using earthaccess
Requires NASA Earthdata login credentials
"""

import os
import earthaccess
from datetime import datetime, timedelta
import sys

# Mumbai coordinates
MUMBAI_BOUNDS = (72.7, 18.8, 73.2, 19.3)  # (west, south, east, north)

# Path setup
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DATA_DIR = os.path.join(REPO_ROOT, "data", "raw_data")
MODIS_DIR = os.path.join(RAW_DATA_DIR, "modis")
AOD_DIR = os.path.join(MODIS_DIR, "aod", "2024")
LST_DIR = os.path.join(MODIS_DIR, "lst", "day")

# Create directories
os.makedirs(AOD_DIR, exist_ok=True)
os.makedirs(LST_DIR, exist_ok=True)

def authenticate_earthdata():
    """Authenticate with NASA Earthdata"""
    try:
        auth = earthaccess.login()
        if auth:
            print("✅ Successfully authenticated with NASA Earthdata")
            return True
        else:
            print("❌ Failed to authenticate with NASA Earthdata")
            print("Please run: earthaccess.login() and enter your credentials")
            return False
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return False

def download_modis_aod():
    """Download MODIS Aerosol Optical Depth data"""
    print("\n🛰️ Downloading MODIS AOD data for Mumbai...")
    
    # Date range - last 30 days
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    try:
        # Search for MODIS AOD data
        results = earthaccess.search_data(
            short_name='MOD04_L2',  # MODIS Terra AOD
            bounding_box=MUMBAI_BOUNDS,
            temporal=(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')),
            count=20  # Limit to recent files
        )
        
        print(f"Found {len(results)} MODIS AOD files")
        
        if results:
            # Download files
            downloaded_files = earthaccess.download(results, AOD_DIR)
            print(f"✅ Downloaded {len(downloaded_files)} MODIS AOD files to {AOD_DIR}")
            
            # Save file list
            with open(os.path.join(AOD_DIR, "downloaded_files.txt"), "w") as f:
                for file in downloaded_files:
                    f.write(f"{file}\n")
                    
            return downloaded_files
        else:
            print("⚠️ No MODIS AOD files found for the specified criteria")
            return []
            
    except Exception as e:
        print(f"❌ Error downloading MODIS AOD: {e}")
        return []

def download_modis_lst():
    """Download MODIS Land Surface Temperature data"""
    print("\n🌡️ Downloading MODIS LST data for Mumbai...")
    
    # Date range - last 30 days
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    try:
        # Search for MODIS LST data
        results = earthaccess.search_data(
            short_name='MOD11A1',  # MODIS Terra LST Daily
            bounding_box=MUMBAI_BOUNDS,
            temporal=(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')),
            count=20  # Limit to recent files
        )
        
        print(f"Found {len(results)} MODIS LST files")
        
        if results:
            # Download files
            downloaded_files = earthaccess.download(results, LST_DIR)
            print(f"✅ Downloaded {len(downloaded_files)} MODIS LST files to {LST_DIR}")
            
            # Save file list
            with open(os.path.join(LST_DIR, "downloaded_files.txt"), "w") as f:
                for file in downloaded_files:
                    f.write(f"{file}\n")
                    
            return downloaded_files
        else:
            print("⚠️ No MODIS LST files found for the specified criteria")
            return []
            
    except Exception as e:
        print(f"❌ Error downloading MODIS LST: {e}")
        return []

def main():
    """Main function to download MODIS data"""
    print("🚀 Starting MODIS data download for Mumbai...")
    print(f"Mumbai bounds: {MUMBAI_BOUNDS}")
    
    # Authenticate first
    if not authenticate_earthdata():
        print("\n❌ Cannot proceed without authentication")
        print("Please set up NASA Earthdata credentials:")
        print("1. Create account at: https://urs.earthdata.nasa.gov/")
        print("2. Run: earthaccess.login() in Python")
        print("3. Enter your username and password")
        sys.exit(1)
    
    # Download data
    aod_files = download_modis_aod()
    lst_files = download_modis_lst()
    
    # Summary
    print(f"\n📊 Download Summary:")
    print(f"   MODIS AOD files: {len(aod_files)}")
    print(f"   MODIS LST files: {len(lst_files)}")
    print(f"   Total files: {len(aod_files) + len(lst_files)}")
    
    if aod_files or lst_files:
        print("\n✅ MODIS data download completed successfully!")
        print(f"Files saved to: {MODIS_DIR}")
    else:
        print("\n⚠️ No files were downloaded. Check your internet connection and try again.")

if __name__ == "__main__":
    main()
