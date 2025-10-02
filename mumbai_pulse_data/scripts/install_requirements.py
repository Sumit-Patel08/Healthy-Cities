#!/usr/bin/env python3
"""
Install all required packages for NASA data collection
"""

import subprocess
import sys

def install_package(package):
    """Install a Python package using pip"""
    try:
        print(f"Installing {package}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"✅ {package} installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install {package}: {e}")
        return False

def main():
    """Install all required packages"""
    print("🚀 Installing NASA data collection requirements...")
    
    # Required packages
    packages = [
        "earthaccess",      # NASA Earthdata access
        "requests",         # HTTP requests
        "pandas",           # Data manipulation
        "numpy",            # Numerical computing
        "rasterio",         # Geospatial raster data
        "xarray",           # N-dimensional arrays
        "netcdf4",          # NetCDF files
        "h5py",             # HDF5 files
        "geopandas",        # Geospatial data
        "folium",           # Interactive maps
        "matplotlib",       # Plotting
        "seaborn",          # Statistical visualization
        "plotly",           # Interactive plots
        "fastapi",          # Web API
        "streamlit",        # Web apps
    ]
    
    successful = 0
    failed = 0
    
    for package in packages:
        if install_package(package):
            successful += 1
        else:
            failed += 1
    
    print(f"\n📊 Installation Summary:")
    print(f"   Successful: {successful}")
    print(f"   Failed: {failed}")
    print(f"   Total: {len(packages)}")
    
    if failed == 0:
        print("\n✅ All packages installed successfully!")
        print("You can now run the NASA data collection scripts.")
    else:
        print(f"\n⚠️ {failed} package(s) failed to install.")
        print("Please check your internet connection and try again.")

if __name__ == "__main__":
    main()
