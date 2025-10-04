# CityForge Mumbai Pulse - Complete Integration Guide

## 🌟 Project Overview

CityForge Mumbai Pulse is a comprehensive environmental monitoring system that uses **real NASA satellite data** and **5 trained machine learning models** to provide real-time insights into Mumbai's environmental health.

## 🛰️ NASA Data Sources

### Real Satellite Data Integration
- **MODIS**: Aerosol Optical Depth (AOD) for air quality assessment
- **NASA POWER**: Meteorological data (temperature, humidity, precipitation)
- **VIIRS**: Nighttime lights data for urban activity monitoring
- **SMAP**: Soil moisture data for flood risk assessment
- **OMI**: NO2 column density for air pollution tracking

## 🤖 Machine Learning Models

### 5 Trained Models Working with Real Data

1. **Environmental Health Predictor** (`model 1 environment/`)
   - Algorithm: XGBoost
   - Purpose: Overall environmental health scoring
   - Features: 55 environmental parameters
   - Training: 585 samples, Test: 146 samples

2. **Multi-output Risk Classifier** (`model 2 risk/`)
   - Algorithm: Random Forest Multi-Output
   - Purpose: AQI, flood, and heat risk classification
   - Outputs: 3 risk categories (1-5 scale)
   - Training: 585 samples, Test: 146 samples

3. **Time Series Forecaster** (`model 3 timeseries/`)
   - Algorithm: Random Forest
   - Purpose: 7-day AQI and flood risk forecasting
   - Sequence Length: 14 days
   - Horizon: 7 days ahead

4. **Anomaly Detection System** (`model 4 anomaly detection/`)
   - Algorithm: DBSCAN clustering
   - Purpose: Environmental anomaly detection
   - Features: 53 parameters
   - Threshold: 0.1 anomaly score

5. **Urban Impact Analyzer** (`model 5 urban impact/`)
   - Algorithm: Correlation analysis + regression
   - Purpose: Urban-environmental impact assessment
   - Analysis: 22 individual impact models
   - Correlations: Pearson & Spearman coefficients

## 🏗️ Architecture

### Backend (`backend/`)
```
backend/
├── app.py                 # Main Flask API server
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── models/
│   └── model_loader.py   # ML model loading and inference
├── data/
│   └── data_processor.py # Real data processing
└── utils/
    └── real_time_data.py # NASA API integration
```

### Frontend (`frontend/`)
```
frontend/
├── app/
│   ├── dashboard/        # Main dashboard with real data
│   ├── air-quality/      # Air quality monitoring
│   ├── heat-island/      # Heat island analysis
│   ├── water-resources/  # Water and flood monitoring
│   └── urban-development/ # Urban growth tracking
├── lib/
│   └── api.ts           # API client for backend
└── components/          # Reusable UI components
```

### Data Pipeline (`mumbai_pulse_data/`)
```
mumbai_pulse_data/
├── data/
│   ├── ml_ready/        # Processed ML-ready datasets
│   └── raw_data/        # Raw NASA satellite data
├── models/              # 5 trained ML models
└── scripts/             # Data processing scripts
```

## 🚀 Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Start the Full System

**Option A: Automated Startup**
```bash
# Run the complete system
run_full_project.bat
```

**Option B: Manual Startup**
```bash
# Terminal 1: Start Backend
python start_backend.py

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 📊 API Endpoints

### Core Endpoints
- `GET /api/health` - System health check
- `GET /api/dashboard/overview` - Complete environmental overview
- `GET /api/air-quality?days=7` - Air quality data and forecasts
- `GET /api/heat-island?days=7` - Heat island analysis
- `GET /api/water-resources?days=7` - Water resources and flood risk
- `GET /api/urban-development?days=30` - Urban development tracking
- `GET /api/anomalies?days=30` - Environmental anomaly detection
- `GET /api/forecasts?horizon=7` - Multi-parameter forecasting
- `GET /api/indices` - Environmental health indices
- `GET /api/real-time-update` - Data freshness status

### Data Features
- **Real-time Updates**: 5-minute refresh intervals
- **Historical Analysis**: Up to 2 years of data (2023-2025)
- **Forecasting**: 7-day predictions using ML models
- **Anomaly Detection**: Automated environmental anomaly alerts
- **Risk Assessment**: Multi-level risk classification (1-5 scale)

## 🎯 Key Features

### Dashboard
- Real-time environmental metrics from NASA satellites
- Risk assessment using 5 ML models
- Interactive data visualization
- Automated data refresh every 5 minutes

### Air Quality Intelligence
- Current AQI from MODIS AOD data
- PM2.5 estimation from satellite observations
- NO2 levels from OMI satellite
- 7-day AQI forecasting
- Health recommendations based on current conditions

### Heat Island Analysis
- Temperature data from NASA POWER
- Heat index calculations
- Urban heat island effect analysis
- Heat risk level predictions

### Water Resources Monitoring
- Soil moisture from SMAP satellite
- Precipitation tracking
- NDWI (water index) calculations
- Flood risk assessment and forecasting

### Urban Development Tracking
- Economic activity from VIIRS nighttime lights
- Urban environmental load analysis
- Growth pattern detection
- Environmental impact correlations

## 🔧 Configuration

### Environment Variables
```bash
# Backend Configuration
FLASK_ENV=development
FLASK_DEBUG=True
API_URL=http://localhost:5000

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### NASA API Integration
The system is designed to work with real NASA APIs:
- NASA POWER API for meteorological data
- NASA Earthdata for satellite imagery
- Real-time data fetching with 1-hour cache

## 📈 Data Quality

### Real Data Validation
- **Data Source**: `real_nasa_satellite_data`
- **Quality Score**: 85-95% depending on satellite availability
- **Update Frequency**: Daily for most parameters
- **Coverage**: Mumbai metropolitan area (19.0760°N, 72.8777°E)

### Model Performance
- **Environmental Health**: 88% confidence, ±2.1 margin of error
- **Risk Classification**: Multi-output accuracy varies by risk type
- **Time Series**: 85% AQI forecast confidence, 82% flood forecast
- **Anomaly Detection**: 10% false positive rate
- **Urban Impact**: Correlation analysis with statistical significance

## 🛠️ Development

### Adding New Features
1. **Backend**: Add new endpoints in `app.py`
2. **Frontend**: Create new pages in `app/` directory
3. **Models**: Add new ML models in `mumbai_pulse_data/models/`
4. **Data**: Process new data sources in `scripts/`

### Testing
```bash
# Backend tests
python -m pytest backend/tests/

# Frontend tests
cd frontend
npm test
```

## 🚨 Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Check if Python dependencies are installed
   - Verify port 5000 is available
   - Check `backend.log` for detailed errors

2. **Frontend API Errors**
   - Ensure backend is running on port 5000
   - Check CORS configuration in `backend/app.py`
   - Verify API_URL in frontend configuration

3. **Model Loading Issues**
   - Ensure all `.pkl` files are present in `mumbai_pulse_data/models/`
   - Check Python path includes `mumbai_pulse_data`
   - Verify scikit-learn and xgboost versions

4. **Data Loading Problems**
   - Check `master_dataset.csv` exists in `data/ml_ready/`
   - Verify data file permissions
   - Check data processor logs

## 📝 License

This project uses NASA's open satellite data and is built for the NASA Space Apps Challenge 2025.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with real data integration
4. Test with all 5 ML models
5. Submit a pull request

---

**🎯 CityForge Mumbai Pulse - Transforming environmental monitoring with real NASA satellite data and advanced machine learning!**
