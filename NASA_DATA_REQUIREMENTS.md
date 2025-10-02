# 🛰️ Mumbai Pulse – NASA Data for Urban Resilience
## NASA Space Apps Challenge 2025 - Hackathon Project Plan

---

## 🎯 **Challenge: Mumbai's Environmental Crisis**

Mumbai faces **interlinked environmental risks** affecting 20+ million residents:
- **Air Pollution**: PM2.5, NO₂ from traffic & industry causing respiratory diseases
- **Extreme Heat**: Urban heat islands reaching 45°C, increasing mortality
- **Water & Flood Risks**: Contaminated water bodies + monsoon flooding
- **Data Gap**: Siloed monitoring, no integrated early warning system

## 🚀 **Our Solution: Mumbai Pulse Dashboard**

**Unified web platform** combining NASA satellite data + local ground truth for:
- **Citizens**: Real-time health alerts & safety maps
- **Policymakers**: Hotspot detection & intervention planning  
- **Impact**: Scalable solution for any megacity globally

---

## 🛰️ **High-Impact NASA Datasets (Hackathon Scope)**

### **🌬️ Air Pollution**
- **MODIS AOD** (MOD04_L2): PM2.5 proxy, 10km resolution, daily
- **Aura OMI NO₂** (OMNO2d): Traffic emissions, 0.25° resolution, daily
- **Source**: NASA Earthdata (requires free account)

### **🌡️ Extreme Heat**
- **MODIS LST** (MOD11A1): Urban heat islands, 1km resolution, daily
- **NASA POWER**: Weather data (temp, humidity), API access, no login
- **Source**: NASA Worldview + POWER API

### **💧 Water & Floods**
- **Landsat NDWI**: Water quality proxy, 30m resolution, 16-day
- **SMAP Soil Moisture**: Flood risk, 36km resolution, daily
- **Source**: USGS EarthExplorer + NASA NSIDC

### **🏙️ Urban Activity**
- **VIIRS Night Lights**: Urban patterns, 500m resolution, daily
- **Source**: NASA LAADS DAAC

---

## 🔄 **Hackathon Workflow (End-to-End)**

### **Step 1: Data Collection (Day 1)**
```python
# Mumbai coordinates: 19.0760°N, 72.8777°E
# Bounding box: 18.8°N-19.3°N, 72.7°E-73.2°E

# Priority order for hackathon:
1. NASA POWER API (30 mins) - Weather data
2. MODIS LST from NASA Worldview (2 hours) - Heat maps  
3. MODIS AOD from NASA Earthdata (2 hours) - Air quality
4. Landsat from USGS (3 hours) - Water quality
```

### **Step 2: Data Processing (Day 2)**
- **Clip to Mumbai**: Use bounding box to extract city data
- **Harmonize**: Resample all data to 1km grid
- **Calculate Indices**: NDWI (water), Heat Index, AQI estimates
- **Quality Filter**: Remove cloudy/poor quality pixels

### **Step 3: AI Model (Day 2-3)**
- **Simple Approach**: Linear regression for PM2.5 from AOD
- **Advanced**: CNN + Temporal layers for multi-domain prediction
- **Validation**: Compare with CPCB air quality stations

### **Step 4: Web Dashboard (Day 3-4)**
- **Backend**: FastAPI with real-time data endpoints
- **Frontend**: React + Mapbox for interactive maps
- **Features**: Live alerts, hotspot detection, time series charts

### **Step 5: Validation & Impact (Day 4-5)**
- **Ground Truth**: CPCB monitors, IMD weather, municipal reports
- **Demo**: Show real Mumbai environmental conditions
- **Scalability**: Demonstrate framework works for any city

---

## 🔄 **Detailed Data Collection Guide**

### **Step 1: Set Up NASA Earthdata Account**
1. **Create Account**: Go to https://urs.earthdata.nasa.gov/users/new
2. **Fill Details**: Username, email, password, organization
3. **Verify Email**: Check inbox and click verification link
4. **Login**: Use credentials to access NASA data portals

### **Step 2: Install Required Tools**
```bash
# Install Python libraries for NASA data access
pip install earthaccess requests rasterio xarray netcdf4 h5py
pip install geopandas folium matplotlib seaborn plotly

# For command line tools (optional)
# wget or curl (usually pre-installed on Linux/Mac)
```

### **Step 3: Data Collection Methods by Dataset**

#### **🌬️ MODIS Data Collection (AOD & LST)**

**Method 1: Using NASA Worldview (Visual Selection)**
1. **Go to**: https://worldview.earthdata.nasa.gov/
2. **Set Location**: Search "Mumbai, India" or use coordinates (19.0760°N, 72.8777°E)
3. **Select Layers**:
   - For AOD: Add "Aerosol Optical Depth" layer
   - For LST: Add "Land Surface Temperature (Day/Night)" layer
4. **Set Date Range**: Choose your desired time period
5. **Download**: Click "Download" → "Create Image Subset" → Select format (GeoTIFF recommended)

**Method 2: Using NASA Earthdata Search**
1. **Go to**: https://search.earthdata.nasa.gov/
2. **Search Parameters**:
   - **Keywords**: "MOD04_L2" (for AOD) or "MOD11A1" (for LST)
   - **Spatial**: Draw bounding box around Mumbai (18.8°N-19.3°N, 72.7°E-73.2°E)
   - **Temporal**: Select date range (recommend last 2 years)
3. **Filter Results**: Choose cloud coverage < 20%
4. **Download**: Select files and download (requires Earthdata login)

**Method 3: Using Python earthaccess Library**
```python
import earthaccess

# Authenticate
earthaccess.login()

# Search for MODIS AOD data
aod_results = earthaccess.search_data(
    short_name='MOD04_L2',
    bounding_box=(72.7, 18.8, 73.2, 19.3),  # Mumbai bounds
    temporal=('2022-01-01', '2024-10-01'),
    count=100  # Limit results
)

# Download data
earthaccess.download(aod_results, './data/raw/modis/aod/')
```

#### **🌡️ NASA POWER Data Collection (Meteorological)**

**Direct API Access (No Authentication Required)**
```python
import requests
import json
from datetime import datetime, timedelta

def download_nasa_power_data():
    # Mumbai coordinates
    lat, lon = 19.0760, 72.8777
    
    # Date range (last 2 years)
    end_date = datetime.now().strftime('%Y%m%d')
    start_date = (datetime.now() - timedelta(days=730)).strftime('%Y%m%d')
    
    # Parameters: Temperature, Humidity, Wind Speed, Precipitation
    parameters = "T2M,T2M_MAX,T2M_MIN,RH2M,WS10M,PRECTOTCORR"
    
    url = f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters={parameters}&community=RE&longitude={lon}&latitude={lat}&start={start_date}&end={end_date}&format=JSON"
    
    response = requests.get(url)
    data = response.json()
    
    # Save to file
    with open('./data/raw/nasa_power/mumbai_weather.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    return data

# Usage
weather_data = download_nasa_power_data()
```

**Web Interface Method**
1. **Go to**: https://power.larc.nasa.gov/data-access-viewer/
2. **Select Location**: Click on Mumbai or enter coordinates (19.0760, 72.8777)
3. **Choose Parameters**: 
   - Temperature (T2M, T2M_MAX, T2M_MIN)
   - Humidity (RH2M)
   - Wind Speed (WS10M)
   - Precipitation (PRECTOTCORR)
4. **Set Date Range**: Last 2 years for historical data
5. **Download Format**: Choose JSON or CSV
6. **Submit Request**: Download will start automatically

#### **🛰️ Landsat Data Collection (Water Quality)**

**Using USGS EarthExplorer**
1. **Go to**: https://earthexplorer.usgs.gov/
2. **Create Account**: Register with USGS (free)
3. **Search Criteria**:
   - **Coordinates**: 19.0760, 72.8777 (Mumbai center)
   - **Date Range**: Last 2 years
   - **Cloud Cover**: < 20%
4. **Select Dataset**: Landsat 8-9 OLI/TIRS C2 L2
5. **Filter Results**: Choose scenes covering Mumbai
6. **Download**: Select and download (requires USGS login)

#### **🌙 VIIRS Nighttime Lights Collection**

**Using NASA LAADS DAAC**
1. **Go to**: https://ladsweb.modaps.eosdis.nasa.gov/
2. **Login**: Use NASA Earthdata credentials
3. **Search Parameters**:
   - **Product**: VNP46A2 (Daily Nighttime Lights)
   - **Area**: Mumbai coordinates
   - **Time**: Last 1 year
4. **Download**: Select files and download

#### **🌊 SMAP Soil Moisture Collection**

**Using NASA NSIDC**
1. **Go to**: https://nsidc.org/data/spl3smp/
2. **Data Access**: Click "Download Data"
3. **Login**: Use NASA Earthdata credentials
4. **Select Area**: Mumbai region
5. **Download**: Choose HDF5 format

### **Step 4: Data Validation Checklist**

Before using any downloaded data, verify:
- [ ] **File Integrity**: Check file sizes and formats
- [ ] **Spatial Coverage**: Ensure Mumbai area is covered
- [ ] **Temporal Range**: Verify date ranges are correct
- [ ] **Quality Flags**: Check NASA quality indicators
- [ ] **Coordinate System**: Ensure proper projection (WGS84/EPSG:4326)

---

## 📅 **Data Collection Timeline**

### **Historical Data (Training)**
- **Time Range**: January 2020 - Present
- **Purpose**: Model training and validation
- **Priority**: Last 2 years for recent patterns

### **Real-time Data (Operations)**
- **Update Frequency**: Daily for most datasets
- **Latency**: 1-3 days for processed products
- **Storage**: Local cache + cloud backup

---

## 📁 **Simple Data Folder Structure (Hackathon Repo)**

```
/data
├── /air                    # Air pollution data
│   ├── modis_aod.tif      # MODIS Aerosol Optical Depth
│   ├── omi_no2.nc         # Aura OMI NO₂ data
│   └── processed_aqi.csv  # Calculated Air Quality Index
├── /heat                   # Heat & temperature data
│   ├── modis_lst.tif      # MODIS Land Surface Temperature
│   ├── nasa_power.json    # NASA POWER weather data
│   └── heat_index.csv     # Calculated heat stress index
├── /water                  # Water quality & flood data
│   ├── landsat_ndwi.tif   # Landsat water quality index
│   ├── smap_soil.nc       # SMAP soil moisture
│   └── flood_risk.csv     # Flood risk assessment
└── /urban                  # Urban activity data
    ├── viirs_lights.tif   # VIIRS nighttime lights
    └── urban_patterns.csv # Urban activity analysis
```

## 🎯 **Expected Impact**

### **For Citizens**
- **Live Health Alerts**: "Air quality poor in Bandra - avoid outdoor exercise"
- **Safety Maps**: Real-time heat risk zones and cooling centers
- **Water Safety**: Beach/lake contamination warnings

### **For Policymakers** 
- **Hotspot Detection**: Identify pollution/heat sources for targeted action
- **Planning Support**: Data-driven urban development decisions
- **Emergency Response**: Early warning system for extreme events

### **For Judges**
- **Real NASA Data**: Authentic satellite observations, not simulations
- **Scalable Solution**: Framework applicable to any megacity globally
- **Technical Innovation**: Multi-domain AI model with physics constraints
- **Social Impact**: Direct benefit to 20+ million Mumbai residents

## 🚀 **Complete Directory Setup Commands**

### **Windows PowerShell (Copy & Paste This)**
```powershell
# First, go to existing mumbai_pulse_data directory
cd mumbai_pulse_data

# Create main directories
New-Item -ItemType Directory -Name "data"
New-Item -ItemType Directory -Name "scripts" 
New-Item -ItemType Directory -Name "docs"

# Create data subdirectories
cd data
New-Item -ItemType Directory -Name "air"
New-Item -ItemType Directory -Name "heat"
New-Item -ItemType Directory -Name "water"
New-Item -ItemType Directory -Name "urban"
New-Item -ItemType Directory -Name "raw_data"
New-Item -ItemType Directory -Name "processed_data"

# Air pollution folders
cd air
New-Item -ItemType Directory -Name "modis_aod"
New-Item -ItemType Directory -Name "omi_no2"
New-Item -ItemType Directory -Name "processed_aqi"

# Heat folders
cd ..\heat
New-Item -ItemType Directory -Name "modis_lst"
New-Item -ItemType Directory -Name "nasa_power"
New-Item -ItemType Directory -Name "heat_index"

# Water folders
cd ..\water
New-Item -ItemType Directory -Name "landsat_ndwi"
New-Item -ItemType Directory -Name "smap_soil"
New-Item -ItemType Directory -Name "flood_risk"

# Urban folders
cd ..\urban
New-Item -ItemType Directory -Name "viirs_lights"
New-Item -ItemType Directory -Name "urban_patterns"

# Raw data folders
cd ..\raw_data
New-Item -ItemType Directory -Name "modis"
New-Item -ItemType Directory -Name "landsat"
New-Item -ItemType Directory -Name "nasa_power"
New-Item -ItemType Directory -Name "viirs"
New-Item -ItemType Directory -Name "smap"
New-Item -ItemType Directory -Name "omi"

# MODIS subfolders
cd modis
New-Item -ItemType Directory -Name "aod"
New-Item -ItemType Directory -Name "lst"
cd aod
New-Item -ItemType Directory -Name "2023"
New-Item -ItemType Directory -Name "2024"
cd ..\lst
New-Item -ItemType Directory -Name "day"
New-Item -ItemType Directory -Name "night"

# Landsat subfolders
cd ..\..\landsat
New-Item -ItemType Directory -Name "surface_reflectance"
New-Item -ItemType Directory -Name "thermal"
cd surface_reflectance
New-Item -ItemType Directory -Name "2023"
New-Item -ItemType Directory -Name "2024"

# NASA POWER subfolders
cd ..\..\nasa_power
New-Item -ItemType Directory -Name "daily"
New-Item -ItemType Directory -Name "hourly"

# VIIRS subfolders
cd ..\viirs
New-Item -ItemType Directory -Name "daily"
New-Item -ItemType Directory -Name "monthly"

# SMAP subfolders
cd ..\smap
New-Item -ItemType Directory -Name "daily"
New-Item -ItemType Directory -Name "monthly"

# OMI subfolders
cd ..\omi
New-Item -ItemType Directory -Name "no2"
New-Item -ItemType Directory -Name "so2"

# Processed data folders
cd ..\..\processed_data
New-Item -ItemType Directory -Name "clipped_mumbai"
New-Item -ItemType Directory -Name "resampled"
New-Item -ItemType Directory -Name "indices"

# Scripts folders
cd ..\..\scripts
New-Item -ItemType Directory -Name "download_data"
New-Item -ItemType Directory -Name "process_data"
New-Item -ItemType Directory -Name "visualize_data"

# Docs folders
cd ..\docs
New-Item -ItemType Directory -Name "data_sources"
New-Item -ItemType Directory -Name "processing_logs"

# Go back to main directory
cd ..
```

### **Alternative: Simple PowerShell One-Liners**
```powershell
# If the above is too long, use these simple commands:
cd mumbai_pulse_data
"data","scripts","docs" | ForEach-Object { New-Item -ItemType Directory -Name $_ }
cd data
"air","heat","water","urban","raw_data","processed_data" | ForEach-Object { New-Item -ItemType Directory -Name $_ }
cd air
"modis_aod","omi_no2","processed_aqi" | ForEach-Object { New-Item -ItemType Directory -Name $_ }
cd ..\heat
"modis_lst","nasa_power","heat_index" | ForEach-Object { New-Item -ItemType Directory -Name $_ }
cd ..\water
"landsat_ndwi","smap_soil","flood_risk" | ForEach-Object { New-Item -ItemType Directory -Name $_ }
cd ..\urban
"viirs_lights","urban_patterns" | ForEach-Object { New-Item -ItemType Directory -Name $_ }
cd ..
```

### **Linux/Mac (Terminal) - Single Command**
```bash
mkdir -p mumbai_pulse_data/{data/{air/{modis_aod,omi_no2,processed_aqi},heat/{modis_lst,nasa_power,heat_index},water/{landsat_ndwi,smap_soil,flood_risk},urban/{viirs_lights,urban_patterns},raw_data/{modis/{aod/{2023,2024},lst/{day,night}},landsat/{surface_reflectance/{2023,2024},thermal},nasa_power/{daily,hourly},viirs/{daily,monthly},smap/{daily,monthly},omi/{no2,so2}},processed_data/{clipped_mumbai,resampled,indices}},scripts/{download_data,process_data,visualize_data},docs/{data_sources,processing_logs}}
```

### **Quick Setup (Minimal)**
```bash
# If you want just the essential structure
mkdir -p mumbai_pulse_data/data/{air,heat,water,urban,raw_data,processed_data}
mkdir -p mumbai_pulse_data/{scripts,docs}

# Install required packages
pip install earthaccess requests rasterio xarray folium plotly fastapi streamlit
```

---

## 💻 **Quick Start Code Examples**

### **NASA POWER API (Start Here)**
```python
import requests
import json

def get_mumbai_weather():
    url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    params = {
        'parameters': 'T2M,RH2M,WS10M,PRECTOTCORR',
        'community': 'RE',
        'longitude': 72.8777,
        'latitude': 19.0760,
        'start': '20230101',
        'end': '20241001',
        'format': 'JSON'
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    # Save to data folder
    with open('data/heat/nasa_power.json', 'w') as f:
        json.dump(data, f)
    
    return data
```

### **MODIS Data Processing**
```python
import rasterio
import numpy as np

def process_modis_lst(file_path):
    """Process MODIS Land Surface Temperature"""
    with rasterio.open(file_path) as src:
        lst_data = src.read(1)  # Read first band
        
        # Convert to Celsius (MODIS LST is in Kelvin * 50)
        lst_celsius = (lst_data * 0.02) - 273.15
        
        # Clip to Mumbai bounds
        mumbai_bounds = (72.7, 18.8, 73.2, 19.3)  # W, S, E, N
        
        return lst_celsius

def calculate_heat_index(temperature, humidity):
    """Calculate heat index for health warnings"""
    # Simplified heat index calculation
    hi = temperature + 0.5 * humidity
    
    if hi > 40:
        return "Extreme Risk"
    elif hi > 35:
        return "High Risk"
    else:
        return "Moderate Risk"
```

---

## 📋 **Hackathon Data Collection Checklist**

### **Day 1: Essential Data (Start Here)**
- [ ] **NASA POWER Weather** (30 mins) - Use API, no login needed
- [ ] **Create NASA Earthdata account** (15 mins) - For satellite data
- [ ] **MODIS LST Heat Maps** (2 hours) - From NASA Worldview
- [ ] **MODIS AOD Air Quality** (2 hours) - From NASA Earthdata

### **Day 2: Enhanced Data (If Time Permits)**
- [ ] **Landsat Water Quality** (3 hours) - From USGS EarthExplorer  
- [ ] **VIIRS Urban Lights** (2 hours) - From NASA LAADS DAAC

### **Validation Data (Optional)**
- [ ] **CPCB Air Quality Stations** - For ground truth comparison
- [ ] **Mumbai City Boundaries** - From OpenStreetMap

## 🎯 **Success Criteria**

**Minimum Viable Product (Day 1)**:
- [ ] Temperature maps showing Mumbai heat islands
- [ ] Air quality estimates from satellite data
- [ ] Basic web dashboard with real NASA data

**Enhanced Version (Day 2+)**:
- [ ] Multi-domain environmental analysis
- [ ] Cross-correlation between heat and air quality
- [ ] Water quality assessment from Landsat

**Competition Winner (Day 3+)**:
- [ ] Real-time alerts and hotspot detection
- [ ] Policy recommendations with impact simulation
- [ ] Scalable framework for other cities

---

**Ready to start building Mumbai Pulse? Begin with NASA POWER API - it's the easiest way to get real NASA data working in 30 minutes!** 🚀
