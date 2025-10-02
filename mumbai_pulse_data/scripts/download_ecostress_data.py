#!/usr/bin/env python3
"""
Download ECOSTRESS thermal data from NASA LP DAAC
Reads URLs from ECOSTRESS.txt and downloads to proper folder structure
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
        # Try to use existing authentication
        auth = earthaccess.login()
        if auth:
            print("✅ NASA Earthdata authentication successful")
            return auth
        else:
            print("❌ NASA Earthdata authentication failed")
            print("💡 Please run 'python setup_earthdata_login.py' first")
            return None
    except Exception as e:
        print(f"❌ Could not authenticate with NASA Earthdata: {e}")
        print("💡 Please run 'python setup_earthdata_login.py' first")
        return None

def read_download_urls():
    """Read download URLs from the ECOSTRESS.txt file"""
    if not URL_FILE.exists():
        print(f"❌ URL file not found: {URL_FILE}")
        return []
    
    with open(URL_FILE, 'r') as f:
        lines = f.readlines()
    
    # Filter out empty lines and get only HTTPS URLs
    download_urls = []
    for line in lines:
        line = line.strip()
        if line.startswith('https://') and 'ECO_L2T_LSTE' in line:
            download_urls.append(line)
    
    print(f"📊 Found {len(download_urls)} ECOSTRESS files to download")
    return download_urls

def extract_filename_from_url(url):
    """Extract filename from the URL"""
    parsed = urlparse(url)
    filename = os.path.basename(parsed.path)
    return filename

def organize_by_date_and_tile(filename):
    """Organize files by date and tile for better structure"""
    # Extract date and tile from filename
    # Example: ECOv002_L2T_LSTE_40776_001_43QCA_20250914T113818_0713_01_LST.tif
    parts = filename.split('_')
    if len(parts) >= 7:
        date_part = parts[6]  # 20250914T113818
        tile_part = parts[5]  # 43QCA
        date_str = date_part[:8]  # 20250914
        
        # Create subdirectory structure: YYYY/MM/DD/tile
        year = date_str[:4]
        month = date_str[4:6]
        day = date_str[6:8]
        
        subdir = ECOSTRESS_DIR / year / month / day / tile_part
        subdir.mkdir(parents=True, exist_ok=True)
        return subdir
    
    # Fallback to main directory
    return ECOSTRESS_DIR

def download_file(url, filename):
    """Download a single file with progress indication"""
    # Organize into subdirectories
    target_dir = organize_by_date_and_tile(filename)
    filepath = target_dir / filename
    
    # Skip if file already exists
    if filepath.exists():
        print(f"⏭️  Skipping {filename} (already exists)")
        return True
    
    try:
        print(f"🛰️ Downloading {filename}...")
        
        # Use earthaccess session which handles authentication automatically
        session = earthaccess.get_requests_https_session()
        
        # Set headers
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = session.get(url, headers=headers, stream=True, timeout=180, allow_redirects=True)
        response.raise_for_status()
        
        # Get file size for progress
        total_size = int(response.headers.get('content-length', 0))
        
        with open(filepath, 'wb') as f:
            downloaded = 0
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
                    
                    # Show progress for larger files
                    if total_size > 0:
                        percent = (downloaded / total_size) * 100
                        print(f"\r   Progress: {percent:.1f}% ({downloaded:,}/{total_size:,} bytes)", end='')
        
        print(f"\n✅ Downloaded: {filename}")
        print(f"   📁 Saved to: {target_dir}")
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"\n❌ Failed to download {filename}: {e}")
        # Clean up partial file
        if filepath.exists():
            filepath.unlink()
        return False
    except Exception as e:
        print(f"\n❌ Unexpected error downloading {filename}: {e}")
        if filepath.exists():
            filepath.unlink()
        return False

def categorize_files(urls):
    """Categorize files by type for better organization"""
    categories = {
        'LST': [],      # Land Surface Temperature (main product)
        'LST_err': [],  # Temperature uncertainty
        'EmisWB': [],   # Emissivity
        'QC': [],       # Quality Control
        'cloud': [],    # Cloud mask
        'water': [],    # Water mask
        'other': []     # Other files
    }
    
    for url in urls:
        filename = extract_filename_from_url(url)
        
        if '_LST.tif' in filename:
            categories['LST'].append(url)
        elif '_LST_err.tif' in filename:
            categories['LST_err'].append(url)
        elif '_EmisWB.tif' in filename:
            categories['EmisWB'].append(url)
        elif '_QC.tif' in filename:
            categories['QC'].append(url)
        elif '_cloud.tif' in filename:
            categories['cloud'].append(url)
        elif '_water.tif' in filename:
            categories['water'].append(url)
        else:
            categories['other'].append(url)
    
    return categories

def main():
    """Main download process"""
    print("🛰️ ECOSTRESS Thermal Data Downloader")
    print("=" * 60)
    
    # Setup
    setup_directories()
    
    # Setup authentication
    auth = setup_earthdata_auth()
    if not auth:
        print("❌ Cannot proceed without NASA Earthdata authentication")
        return
    
    # Read URLs
    urls = read_download_urls()
    if not urls:
        print("❌ No download URLs found in ECOSTRESS.txt file")
        return
    
    # Categorize files
    categories = categorize_files(urls)
    
    print(f"\n📊 File Categories:")
    for category, file_list in categories.items():
        if file_list:
            print(f"   {category}: {len(file_list)} files")
    
    # Download files
    successful = 0
    failed = 0
    
    print(f"\n🚀 Starting download of {len(urls)} ECOSTRESS files...")
    
    for i, url in enumerate(urls, 1):
        filename = extract_filename_from_url(url)
        print(f"\n[{i}/{len(urls)}] Processing {filename}")
        
        if download_file(url, filename):
            successful += 1
        else:
            failed += 1
        
        # Small delay between downloads to be respectful
        time.sleep(1)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Download Summary:")
    print(f"   ✅ Successful: {successful}")
    print(f"   ❌ Failed: {failed}")
    print(f"   📁 Files organized in: {ECOSTRESS_DIR}")
    
    if successful > 0:
        print("\n🎉 ECOSTRESS thermal data download completed!")
        print("🔥 You now have ultra-high resolution thermal data from the ISS!")
        print("💡 Next step: Run thermal processing scripts to analyze heat patterns")
        
        # Show file organization
        print(f"\n📂 File Organization:")
        print(f"   📁 {ECOSTRESS_DIR}/")
        print(f"      └── YYYY/MM/DD/TILE/")
        print(f"          ├── *_LST.tif (Land Surface Temperature)")
        print(f"          ├── *_LST_err.tif (Temperature Uncertainty)")
        print(f"          ├── *_EmisWB.tif (Emissivity)")
        print(f"          ├── *_QC.tif (Quality Control)")
        print(f"          ├── *_cloud.tif (Cloud Mask)")
        print(f"          └── *_water.tif (Water Mask)")
        
    else:
        print("\n⚠️ No files were downloaded successfully")
        print("💡 Check your internet connection and NASA Earthdata authentication")

if __name__ == "__main__":
    main()
