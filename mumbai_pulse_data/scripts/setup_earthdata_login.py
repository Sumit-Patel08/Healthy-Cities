#!/usr/bin/env python3
"""
Setup NASA Earthdata login credentials
Run this script to authenticate with NASA Earthdata
"""

import earthaccess

def setup_earthdata_login():
    """Setup NASA Earthdata authentication"""
    print("🚀 Setting up NASA Earthdata login...")
    print("\nIf you don't have an account yet:")
    print("1. Go to: https://urs.earthdata.nasa.gov/users/new")
    print("2. Create a free account")
    print("3. Come back and run this script\n")
    
    try:
        # This will prompt for username and password
        auth = earthaccess.login()
        
        if auth:
            print("✅ Successfully authenticated with NASA Earthdata!")
            print("Your credentials are now saved for future use.")
            print("\nYou can now run the data download scripts:")
            print("  python download_modis_data.py")
            print("  python download_smap_data.py") 
            print("  python download_viirs_data.py")
            print("  python download_all_nasa_data.py")
            return True
        else:
            print("❌ Authentication failed!")
            print("Please check your username and password.")
            return False
            
    except Exception as e:
        print(f"❌ Error during authentication: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure you have an internet connection")
        print("2. Verify your NASA Earthdata credentials")
        print("3. Try running: pip install earthaccess")
        return False

if __name__ == "__main__":
    setup_earthdata_login()
