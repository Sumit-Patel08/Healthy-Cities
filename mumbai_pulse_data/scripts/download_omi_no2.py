#!/usr/bin/env python3
"""
Download OMI NO₂ data from NASA GES DISC
Reads URLs from the subset file and downloads to proper folder structure
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
OMI_DIR = BASE_DIR / "data" / "raw_data" / "omi" / "no2"
SUBSET_FILE = BASE_DIR / "data" / "subset_OMNO2d_003_20251002_112021_.txt"

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

def setup_directories():
    """Create necessary directories"""
    OMI_DIR.mkdir(parents=True, exist_ok=True)
    print(f"📁 Created directory: {OMI_DIR}")

def read_download_links():
    """Read download URLs from the subset file"""
    if not SUBSET_FILE.exists():
        print(f"❌ Subset file not found: {SUBSET_FILE}")
        return []
    
    with open(SUBSET_FILE, 'r') as f:
        lines = f.readlines()
    
    # Filter out documentation links and get only data download URLs
    download_urls = []
    for line in lines:
        line = line.strip()
        if line.startswith('https://') and 'HTTP_services.cgi' in line:
            download_urls.append(line)
    
    print(f"📊 Found {len(download_urls)} OMI NO₂ files to download")
    return download_urls

def extract_filename_from_url(url):
    """Extract meaningful filename from the download URL"""
    # Parse the URL to get the LABEL parameter which contains the filename
    if 'LABEL=' in url:
        label_part = url.split('LABEL=')[1]
        filename = label_part.split('&')[0]  # Get everything before next parameter
        return filename
    else:
        # Fallback: use URL parsing
        parsed = urlparse(url)
        return os.path.basename(parsed.path) or f"omi_no2_{int(time.time())}.nc4"

def download_file(url, filename):
    """Download a single file with progress indication"""
    filepath = OMI_DIR / filename
    
    # Skip if file already exists
    if filepath.exists():
        print(f"⏭️  Skipping {filename} (already exists)")
        return True
    
    try:
        print(f"🛰️ Downloading {filename}...")
        
        # Use earthaccess session which handles authentication automatically
        session = earthaccess.get_requests_https_session()
        
        # Set headers to mimic browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = session.get(url, headers=headers, stream=True, timeout=120, allow_redirects=True)
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

def main():
    """Main download process"""
    print("🛰️ OMI NO₂ Data Downloader")
    print("=" * 50)
    
    # Setup
    setup_directories()
    
    # Setup authentication
    auth = setup_earthdata_auth()
    if not auth:
        print("❌ Cannot proceed without NASA Earthdata authentication")
        return
    
    # Read URLs
    urls = read_download_links()
    if not urls:
        print("❌ No download URLs found in subset file")
        return
    
    # Download files
    successful = 0
    failed = 0
    
    for i, url in enumerate(urls, 1):
        filename = extract_filename_from_url(url)
        print(f"\n[{i}/{len(urls)}] Processing {filename}")
        
        if download_file(url, filename):
            successful += 1
        else:
            failed += 1
        
        # Small delay between downloads to be respectful
        time.sleep(2)
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Download Summary:")
    print(f"   ✅ Successful: {successful}")
    print(f"   ❌ Failed: {failed}")
    print(f"   📁 Files saved to: {OMI_DIR}")
    
    if successful > 0:
        print("\n🎉 OMI NO₂ data download completed!")
        print("💡 Next step: Run 'python process_aqi_estimation.py' to use real OMI data")
    else:
        print("\n⚠️ No files were downloaded successfully")
        print("💡 Check your internet connection and NASA Earthdata authentication")

if __name__ == "__main__":
    main()
