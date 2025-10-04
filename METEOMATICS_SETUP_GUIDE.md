# Meteomatics Weather API Integration Guide

## Overview
This guide will help you integrate the Meteomatics Weather API into your CityForge Mumbai Pulse project to get real-time temperature, air quality index (AQI), and other environmental data.

## Step 1: Get Meteomatics API Credentials

### For NASA Space Apps Challenge Participants:
1. **Claim the Global Offer**: Click the "Claim Offer" button on the Meteomatics challenge page
2. **Fill Contact Form**: Complete the contact form with your details
3. **Receive Credentials**: You'll receive your Meteomatics login credentials via email
4. **Free Access Period**: Valid for the duration of the 2025 NASA Space Apps Challenge (October 4-5)

### What You Get:
- ✅ Meteomatics Weather API access
- ✅ Technical support
- ✅ Complete documentation
- ✅ Real-time weather data
- ✅ Air quality measurements
- ✅ Environmental parameters

## Step 2: Configure Your Environment

### 2.1 Create Environment File
1. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```

2. Edit the `.env` file and add your Meteomatics credentials:
   ```env
   METEOMATICS_USERNAME=your-meteomatics-username
   METEOMATICS_PASSWORD=your-meteomatics-password
   ```

### 2.2 Install Dependencies
Install the required Python packages:
```bash
pip install -r backend/requirements.txt
```

## Step 3: Available API Endpoints

Once configured, your application will have these new endpoints:

### 🌤️ Current Weather
- **Endpoint**: `GET /api/weather/current`
- **Description**: Get current weather conditions for Mumbai
- **Data**: Temperature, humidity, wind speed, pressure, UV index

### 📊 Weather Forecast
- **Endpoint**: `GET /api/weather/forecast?hours=24`
- **Description**: Get weather forecast (up to 7 days)
- **Parameters**: `hours` (optional, default: 24, max: 168)

### 🌬️ Real-time Air Quality
- **Endpoint**: `GET /api/air-quality/realtime`
- **Description**: Get current AQI and pollutant levels
- **Data**: AQI, PM2.5, PM10, NO2, O3, SO2, CO

### 🔥 Heat Stress Analysis
- **Endpoint**: `GET /api/heat-stress`
- **Description**: Get heat stress risk assessment
- **Data**: Heat index, risk level, recommendations

### ⚠️ Health Alerts
- **Endpoint**: `GET /api/weather/health-alerts`
- **Description**: Get health alerts based on current conditions
- **Data**: Air quality alerts, heat stress warnings, UV exposure risks

## Step 4: Example API Responses

### Current Weather Response:
```json
{
  "success": true,
  "data": {
    "location": {
      "city": "Mumbai",
      "latitude": 19.0760,
      "longitude": 72.8777
    },
    "timestamp": "2024-10-04T14:30:00Z",
    "weather": {
      "temperature": 32.5,
      "humidity": 78,
      "wind_speed": 12.3,
      "pressure": 1013.2,
      "uv_index": 8
    },
    "air_quality": {
      "aqi": 156,
      "pm2_5": 65.2,
      "pm10": 89.1,
      "no2": 45.3
    },
    "health_indices": {
      "air_quality_risk": "Unhealthy for Sensitive Groups",
      "heat_stress_risk": "Moderate",
      "uv_risk": "Very High"
    }
  }
}
```

### Health Alerts Response:
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "type": "air_quality",
        "level": "high",
        "message": "Unhealthy air quality detected",
        "recommendations": [
          "Limit prolonged outdoor activities",
          "Sensitive individuals should stay indoors",
          "Consider wearing masks outdoors"
        ]
      }
    ],
    "alert_count": 1,
    "timestamp": "2024-10-04T14:30:00Z"
  }
}
```

## Step 5: Testing the Integration

### 5.1 Start the Backend Server
```bash
cd "D:\Nasa New\Healthy-Cities"
python start_backend.py
```

### 5.2 Test the Endpoints
Use curl, Postman, or your browser to test:

```bash
# Test current weather
curl http://localhost:5000/api/weather/current

# Test air quality
curl http://localhost:5000/api/air-quality/realtime

# Test health alerts
curl http://localhost:5000/api/weather/health-alerts
```

## Step 6: Frontend Integration

### Update your frontend to call these new endpoints:

```javascript
// Get current weather
const getCurrentWeather = async () => {
  try {
    const response = await fetch('/api/weather/current');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch weather:', error);
  }
};

// Get health alerts
const getHealthAlerts = async () => {
  try {
    const response = await fetch('/api/weather/health-alerts');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch alerts:', error);
  }
};
```

## Step 7: Data Parameters Available

### Weather Parameters:
- **Temperature**: Air temperature at 2m height (°C)
- **Humidity**: Relative humidity (%)
- **Wind Speed**: Wind speed at 10m height (m/s)
- **Wind Direction**: Wind direction (degrees)
- **Pressure**: Mean sea level pressure (hPa)
- **UV Index**: UV radiation index
- **Precipitation**: Hourly precipitation (mm)

### Air Quality Parameters:
- **AQI**: US Air Quality Index
- **PM2.5**: Fine particulate matter (μg/m³)
- **PM10**: Coarse particulate matter (μg/m³)
- **NO2**: Nitrogen dioxide (μg/m³)
- **O3**: Ozone (μg/m³)
- **SO2**: Sulfur dioxide (μg/m³)
- **CO**: Carbon monoxide (mg/m³)

### Environmental Parameters:
- **Heat Index**: Apparent temperature (°C)
- **Solar Radiation**: Global solar radiation (W/m²)
- **Soil Temperature**: Surface soil temperature (°C)
- **Soil Moisture**: Soil moisture content (m³/m³)
- **Evapotranspiration**: Water evaporation rate (mm)

## Step 8: Error Handling

The API includes comprehensive error handling:

- **503 Service Unavailable**: When Meteomatics credentials are not configured
- **500 Internal Server Error**: When API requests fail
- **Graceful Fallbacks**: Returns cached data or default values when possible

## Step 9: Caching and Performance

- **Built-in Caching**: 5-minute cache for API responses
- **Rate Limiting**: Respects Meteomatics API limits
- **Timeout Handling**: 30-second timeout for API requests
- **Async Processing**: Non-blocking API calls

## Troubleshooting

### Common Issues:

1. **"Weather service not available"**
   - Check that `METEOMATICS_USERNAME` and `METEOMATICS_PASSWORD` are set in `.env`
   - Verify credentials are correct

2. **"Failed to fetch weather data"**
   - Check internet connection
   - Verify Meteomatics API is accessible
   - Check API quota limits

3. **Import errors**
   - Ensure all dependencies are installed: `pip install -r backend/requirements.txt`
   - Check Python path configuration

### Support Resources:
- **Meteomatics Documentation**: Available with your API access
- **Technical Support**: Included with NASA Space Apps Challenge offer
- **API Status**: Check Meteomatics status page for service issues

## Next Steps

1. **Claim your Meteomatics API access** from the NASA Space Apps Challenge page
2. **Configure your credentials** in the `.env` file
3. **Test the integration** using the provided endpoints
4. **Update your frontend** to display real-time weather and air quality data
5. **Implement health alerts** in your user interface

Your CityForge Mumbai Pulse application now has access to real-time, accurate weather and environmental data from Meteomatics! 🚀
