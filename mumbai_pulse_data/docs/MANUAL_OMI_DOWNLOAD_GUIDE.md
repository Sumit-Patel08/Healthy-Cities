# 🛰️ Manual OMI NO₂ Download Guide

## Why Manual Download is Required

The OMI NO₂ URLs in your subset file are from NASA's **On-The-Fly (OTF) subsetting service** which requires browser-based authentication that can't be easily automated.

## 📋 **Step-by-Step Download Process**

### **Step 1: Open Browser and Login**
1. Open your web browser
2. Go to: https://urs.earthdata.nasa.gov/
3. Login with your NASA Earthdata credentials:
   - **Username**: `aryanbuha`
   - **Password**: (your password)

### **Step 2: Download Files Using Your URLs**

Open each URL from your `subset_OMNO2d_003_20251002_112021_.txt` file in your browser:

**Example URLs to download:**
```
https://acdisc.gesdisc.eosdis.nasa.gov/daac-bin/OTF/HTTP_services.cgi?FILENAME=%2Fdata%2FAura_OMI_Level3%2FOMNO2d.003%2F2025%2FOMI-Aura_L3-OMNO2d_2025m0901_v003-2025m0902t172848.he5&SHORTNAME=OMNO2d&DATASET_VERSION=003&SERVICE=L34RS_OMI&FORMAT=bmM0Lw&VARIABLES=ColumnAmountNO2TropCloudScreened&LABEL=OMI-Aura_L3-OMNO2d_2025m0901_v003-2025m0902t172848.he5.SUB.nc4&VERSION=1.02&BBOX=18.8%2C72.7%2C19.3%2C73.2

https://acdisc.gesdisc.eosdis.nasa.gov/daac-bin/OTF/HTTP_services.cgi?FILENAME=%2Fdata%2FAura_OMI_Level3%2FOMNO2d.003%2F2025%2FOMI-Aura_L3-OMNO2d_2025m0902_v003-2025m0904t113900.he5&SHORTNAME=OMNO2d&DATASET_VERSION=003&SERVICE=L34RS_OMI&FORMAT=bmM0Lw&VARIABLES=ColumnAmountNO2TropCloudScreened&LABEL=OMI-Aura_L3-OMNO2d_2025m0902_v003-2025m0904t113900.he5.SUB.nc4&VERSION=1.02&BBOX=18.8%2C72.7%2C19.3%2C73.2
```

### **Step 3: Save Files to Correct Location**

**Important**: Save all downloaded `.nc4` files to:
```
D:\Nasa\mumbai_pulse_data\data\raw_data\omi\no2\
```

**File naming**: The files will download with names like:
- `OMI-Aura_L3-OMNO2d_2025m0901_v003-2025m0902t172848.he5.SUB.nc4`
- `OMI-Aura_L3-OMNO2d_2025m0902_v003-2025m0904t113900.he5.SUB.nc4`

Keep these exact names - don't rename them.

### **Step 4: Verify Downloads**

After downloading all 30 files, check the folder:
```bash
dir "D:\Nasa\mumbai_pulse_data\data\raw_data\omi\no2\"
```

You should see 30 `.nc4` files.

## 🚀 **After Manual Download - Automatic Processing**

Once you've downloaded the OMI files manually, run:

```bash
cd D:\Nasa\mumbai_pulse_data\scripts
python process_aqi_estimation.py
```

**The script will automatically:**
1. ✅ Detect the real OMI NO₂ files
2. ✅ Process them with real MODIS AOD data  
3. ✅ Generate **100% real AQI estimates** for Mumbai
4. ✅ Replace the demo AQI data with authentic NASA satellite-based calculations

## 📊 **Expected Results**

**Before manual download:**
- AQI data source: `simulated_for_demo`

**After manual download:**
- AQI data source: `real_nasa_satellite_data`
- Enhanced accuracy using both MODIS aerosols + OMI nitrogen dioxide

## 💡 **Pro Tips**

1. **Download in batches**: Don't try to download all 30 at once
2. **Check file sizes**: Each file should be 50-200 KB
3. **Verify completion**: Make sure all 30 files downloaded successfully
4. **Keep original names**: Don't rename the `.nc4` files

## ✅ **Success Indicator**

When you rerun `process_aqi_estimation.py`, you should see:
```
✅ Found 30 OMI NO₂ files
✅ Found 21 MODIS AOD files  
🛰️ Processing real NASA satellite data for AQI estimation...
✅ Enhanced AQI calculation completed using multi-sensor fusion
```

This confirms you now have **100% real NASA satellite-based air quality data**! 🛰️
