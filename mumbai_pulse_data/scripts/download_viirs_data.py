#!/usr/bin/env python3
"""
Download VIIRS Nighttime Lights data for Mumbai using earthaccess
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
VIIRS_DIR = os.path.join(RAW_DATA_DIR, "viirs", "daily")

# Create directories
os.makedirs(VIIRS_DIR, exist_ok=True)

def authenticate_earthdata():
    """Authenticate with NASA Earthdata"""
    try:
        auth = earthaccess.login()
        if auth:
            print("✅ Successfully authenticated with NASA Earthdata")
            return True
        else:
            print("❌ Failed to authenticate with NASA Earthdata")
            return False
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return False

def download_viirs_nightlights():
    """Download VIIRS Nighttime Lights data"""
    print("\n🌙 Downloading VIIRS Nighttime Lights data for Mumbai...")
    
    # Date range - last 30 days
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    try:
        # Search for VIIRS data
        results = earthaccess.search_data(
            short_name='VNP46A2',  # VIIRS Daily Nighttime Lights
            bounding_box=MUMBAI_BOUNDS,
            temporal=(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')),
            count=30  # Last 30 days
        )
        
        print(f"Found {len(results)} VIIRS files")
        
        if results:
            # Download files
            downloaded_files = earthaccess.download(results, VIIRS_DIR)
            print(f"✅ Downloaded {len(downloaded_files)} VIIRS files to {VIIRS_DIR}")
            
            # Save file list
            with open(os.path.join(VIIRS_DIR, "downloaded_files.txt"), "w") as f:
                for file in downloaded_files:
                    f.write(f"{file}\n")
                    
            return downloaded_files
        else:
            print("⚠️ No VIIRS files found for the specified criteria")
            return []
            
    except Exception as e:
        print(f"❌ Error downloading VIIRS data: {e}")
        return []

def main():
    """Main function to download VIIRS data"""
    print("🚀 Starting VIIRS data download for Mumbai...")
    print(f"Mumbai bounds: {MUMBAI_BOUNDS}")
    
    # Authenticate first
    if not authenticate_earthdata():
        print("\n❌ Cannot proceed without authentication")
        sys.exit(1)
    
    # Download data
    viirs_files = download_viirs_nightlights()
    
    # Summary
    print(f"\n📊 Download Summary:")
    print(f"   VIIRS files: {len(viirs_files)}")
    
    if viirs_files:
        print("\n✅ VIIRS data download completed successfully!")
        print(f"Files saved to: {VIIRS_DIR}")
    else:
        print("\n⚠️ No files were downloaded.")

if __name__ == "__main__":
    main()
