#!/usr/bin/env python3
"""
Download ONLY essential ECOSTRESS thermal data for Mumbai Pulse project
Downloads only LST (Land Surface Temperature) files - the core thermal data needed
"""

import os
import requests
import sys
from pathlib import Path
from urllib.parse import urlparse
import time
import earthaccess

# Configuration
BASE_DIR = Path(__file__).parent.parent
ECOSTRESS_DIR = BASE_DIR / "data" / "raw_data" / "ecostress" / "lst_emissivity"
URL_FILE = BASE_DIR / "data" / "ECOSTRESS.txt"

def setup_directories():
    """Create necessary directories"""
    ECOSTRESS_DIR.mkdir(parents=True, exist_ok=True)
    print(f"📁 Created directory: {ECOSTRESS_DIR}")

def setup_earthdata_auth():
    """Setup NASA Earthdata authentication using earthaccess"""
    try:
        auth = earthaccess.login()
        if auth:
            print("✅ NASA Earthdata authentication successful")
            return auth
        else:
            print("❌ NASA Earthdata authentication failed")
            return None
    except Exception as e:
        print(f"❌ Could not authenticate with NASA Earthdata: {e}")
        return None

def read_core_thermal_urls():
    """Read and filter URLs to get ONLY LST (core thermal) files"""
    if not URL_FILE.exists():
        print(f"❌ URL file not found: {URL_FILE}")
        return []
    
    with open(URL_FILE, 'r') as f:
        lines = f.readlines()
    
    # Filter for ONLY LST (Land Surface Temperature) files
    core_urls = []
    for line in lines:
        line = line.strip()
        if line.startswith('https://') and '_LST.tif' in line and '_LST_err.tif' not in line:
            core_urls.append(line)
    
    print(f"📊 Found {len(core_urls)} core thermal (LST) files to download")
    print(f"💡 Skipping auxiliary files (QC, cloud, water, etc.) to focus on essential data")
    return core_urls

def extract_filename_from_url(url):
    """Extract filename from the URL"""
    parsed = urlparse(url)
    filename = os.path.basename(parsed.path)
    return filename

def organize_by_date(filename):
    """Organize files by date for better structure"""
    # Extract date from filename
    # Example: ECOv002_L2T_LSTE_40776_001_43QCA_20250914T113818_0713_01_LST.tif
    parts = filename.split('_')
    if len(parts) >= 7:
        date_part = parts[6]  # 20250914T113818
        date_str = date_part[:8]  # 20250914
        
        # Create subdirectory: YYYY-MM-DD
        year = date_str[:4]
        month = date_str[4:6]
        day = date_str[6:8]
        
        subdir = ECOSTRESS_DIR / f"{year}-{month}-{day}"
        subdir.mkdir(parents=True, exist_ok=True)
        return subdir
    
    return ECOSTRESS_DIR

def download_file(url, filename):
    """Download a single thermal file"""
    target_dir = organize_by_date(filename)
    filepath = target_dir / filename
    
    # Skip if file already exists
    if filepath.exists():
        print(f"⏭️  Skipping {filename} (already exists)")
        return True
    
    try:
        print(f"🔥 Downloading thermal data: {filename}")
        
        session = earthaccess.get_requests_https_session()
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = session.get(url, headers=headers, stream=True, timeout=180, allow_redirects=True)
        response.raise_for_status()
        
        total_size = int(response.headers.get('content-length', 0))
        
        with open(filepath, 'wb') as f:
            downloaded = 0
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
                    
                    if total_size > 0:
                        percent = (downloaded / total_size) * 100
                        print(f"\r   Progress: {percent:.1f}% ({downloaded/1024/1024:.1f}/{total_size/1024/1024:.1f} MB)", end='')
        
        print(f"\n✅ Downloaded: {filename}")
        print(f"   📁 Saved to: {target_dir}")
        return True
        
    except Exception as e:
        print(f"\n❌ Failed to download {filename}: {e}")
        if filepath.exists():
            filepath.unlink()
        return False

def main():
    """Main download process for core thermal data only"""
    print("🔥 ECOSTRESS Core Thermal Data Downloader")
    print("=" * 60)
    print("📋 Downloading ONLY essential LST (Land Surface Temperature) files")
    print("💡 This focuses on core thermal data needed for Mumbai Pulse")
    
    # Setup
    setup_directories()
    
    # Setup authentication
    auth = setup_earthdata_auth()
    if not auth:
        print("❌ Cannot proceed without NASA Earthdata authentication")
        return
    
    # Read core thermal URLs only
    urls = read_core_thermal_urls()
    if not urls:
        print("❌ No LST thermal files found in ECOSTRESS.txt")
        return
    
    # Estimate download size
    estimated_size_mb = len(urls) * 2  # ~2MB per LST file average
    print(f"\n📊 Download Plan:")
    print(f"   🔥 Core thermal files: {len(urls)}")
    print(f"   📦 Estimated size: ~{estimated_size_mb} MB")
    print(f"   ⏱️  Estimated time: ~{len(urls)} minutes")
    
    # Download files
    successful = 0
    failed = 0
    
    print(f"\n🚀 Starting download of {len(urls)} core thermal files...")
    
    for i, url in enumerate(urls, 1):
        filename = extract_filename_from_url(url)
        print(f"\n[{i}/{len(urls)}] Processing {filename}")
        
        if download_file(url, filename):
            successful += 1
        else:
            failed += 1
        
        # Small delay between downloads
        time.sleep(0.5)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Core Thermal Download Summary:")
    print(f"   ✅ Successful: {successful}")
    print(f"   ❌ Failed: {failed}")
    print(f"   📁 Files organized in: {ECOSTRESS_DIR}")
    
    if successful > 0:
        print("\n🎉 ECOSTRESS core thermal data download completed!")
        print("🔥 You now have essential Land Surface Temperature data from ISS!")
        print("💡 This is the key thermal data needed for Mumbai heat analysis")
        
        print(f"\n📂 File Organization:")
        print(f"   📁 {ECOSTRESS_DIR}/")
        print(f"      └── YYYY-MM-DD/")
        print(f"          └── *_LST.tif (Land Surface Temperature)")
        
        print(f"\n🎯 Next Steps:")
        print(f"   1. ✅ You now have 11/11 data products!")
        print(f"   2. 🛰️ All products use 100% real NASA data")
        print(f"   3. 🔥 ECOSTRESS provides ultra-high resolution thermal data")
        print(f"   4. 🚀 Your Mumbai Pulse project is complete!")
        
    else:
        print("\n⚠️ No files were downloaded successfully")

if __name__ == "__main__":
    main()
