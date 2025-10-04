# API Endpoints Documentation

This document describes the expected API endpoints and response formats for the CityForge Mumbai Pulse frontend application.

## Base URL

```
Production: https://api.cityforge.io
Development: http://localhost:8000
```

## Authentication

Currently, the API does not require authentication. Future versions may implement API key authentication.

## Common Response Format

All API responses follow this structure:

```json
{
  "data": { ... },
  "timestamp": "2024-01-01T12:00:00Z",
  "status": "success",
  "message": "Data retrieved successfully"
}
```

## Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { ... }
  },
  "timestamp": "2024-01-01T12:00:00Z",
  "status": "error"
}
```

---

## 1. Air Quality Data

### Endpoint
```
GET /api/air
```

### Query Parameters
- `start` (optional): Start date in ISO format
- `end` (optional): End date in ISO format  
- `bbox` (optional): Bounding box coordinates
- `level` (optional): Detail level (summary, detailed)

### Response Schema

```json
{
  "current_aqi": 156,
  "aqi_category": "Unhealthy",
  "pm25_current": 89.5,
  "pm10_current": 145.2,
  "no2_current": 42.8,
  "so2_current": 15.3,
  "co_current": 1.2,
  "o3_current": 78.9,
  "dominant_pollutant": "PM2.5",
  "health_advisory": "Sensitive groups should avoid outdoor activities",
  "forecast_24h": {
    "aqi_trend": "improving",
    "expected_aqi": 142,
    "confidence": 0.85
  },
  "hotspots": [
    {
      "location": "Bandra East",
      "coordinates": [72.8777, 19.0596],
      "aqi": 178,
      "primary_source": "Traffic emissions"
    }
  ],
  "time_series": [
    {
      "timestamp": "2024-01-01T00:00:00Z",
      "aqi": 145,
      "pm25": 82.1
    }
  ],
  "modis_aod": {
    "current_value": 0.68,
    "description": "Moderate aerosol optical depth",
    "geotiff_url": "/data/modis_aod_mumbai_latest.tif"
  },
  "satellite_imagery": {
    "visible": "/data/mumbai_visible_latest.jpg",
    "infrared": "/data/mumbai_ir_latest.jpg",
    "last_updated": "2024-01-01T12:00:00Z"
  },
  "insights": [
    "PM2.5 levels are 3.5x higher than WHO guidelines",
    "Traffic emissions contribute to 45% of current pollution"
  ],
  "thresholds": {
    "good": 50,
    "moderate": 100,
    "unhealthy_sensitive": 150,
    "unhealthy": 200,
    "very_unhealthy": 300,
    "hazardous": 500
  }
}
```

---

## 2. Heat Index Data

### Endpoint
```
GET /api/heat
```

### Query Parameters
- `start` (optional): Start date in ISO format
- `end` (optional): End date in ISO format
- `include_forecast` (optional): Include 24h forecast

### Response Schema

```json
{
  "current_temperature": 34.2,
  "feels_like": 42.8,
  "heat_index": 45.1,
  "heat_category": "Extreme Caution",
  "humidity": 78,
  "uv_index": 9,
  "heat_wave_status": "Active",
  "forecast_24h": {
    "max_temperature": 36.5,
    "max_heat_index": 48.2,
    "trend": "increasing"
  },
  "hotspots": [
    {
      "location": "Dharavi",
      "coordinates": [72.8570, 19.0423],
      "temperature": 38.5,
      "heat_index": 52.1,
      "risk_level": "Extreme"
    }
  ],
  "time_series": [
    {
      "timestamp": "2024-01-01T00:00:00Z",
      "temperature": 28.5,
      "heat_index": 32.1
    }
  ],
  "modis_lst": {
    "day_temperature": 41.2,
    "night_temperature": 29.8,
    "description": "Land Surface Temperature from MODIS satellite",
    "geotiff_url": "/data/modis_lst_mumbai_latest.tif"
  },
  "nasa_power": {
    "solar_radiation": 6.8,
    "wind_speed": 3.2,
    "relative_humidity": 78,
    "data_source": "NASA POWER API"
  },
  "urban_heat_island": {
    "intensity": 4.8,
    "description": "Urban areas are 4.8°C warmer than rural surroundings",
    "peak_hours": "14:00-17:00"
  },
  "health_impacts": {
    "heat_stress_risk": "High",
    "vulnerable_population": 2.1,
    "recommended_actions": [
      "Stay hydrated",
      "Avoid outdoor activities 12-4 PM"
    ]
  },
  "thresholds": {
    "normal": 35,
    "caution": 40,
    "extreme_caution": 45,
    "danger": 50,
    "extreme_danger": 55
  }
}
```

---

## 3. Water & Flood Data

### Endpoint
```
GET /api/water
```

### Query Parameters
- `include_reservoirs` (optional): Include reservoir data
- `include_quality` (optional): Include water quality metrics

### Response Schema

```json
{
  "flood_risk_level": "Moderate",
  "current_rainfall": 12.5,
  "rainfall_24h": 45.8,
  "water_level_status": "Normal",
  "ndwi_average": 0.42,
  "flood_probability": 0.35,
  "monsoon_status": "Active",
  "drainage_capacity": 78,
  "flood_zones": [
    {
      "location": "Sion",
      "coordinates": [72.8619, 19.0434],
      "risk_level": "High",
      "water_depth_forecast": 0.8,
      "evacuation_status": "Alert"
    }
  ],
  "time_series": [
    {
      "timestamp": "2024-01-01T00:00:00Z",
      "rainfall": 0.0,
      "water_level": 2.1
    }
  ],
  "ndwi_analysis": {
    "current_value": 0.42,
    "description": "Normalized Difference Water Index from Landsat",
    "water_body_extent": 156.8,
    "change_from_baseline": "+12.5%",
    "geotiff_url": "/data/ndwi_mumbai_latest.tif"
  },
  "smap_soil_moisture": {
    "current_value": 0.68,
    "description": "Soil moisture from SMAP satellite",
    "saturation_level": "High",
    "infiltration_capacity": "Limited"
  },
  "reservoir_levels": [
    {
      "name": "Tansa",
      "current_level": 87.5,
      "capacity": 100,
      "status": "Good"
    }
  ],
  "drainage_systems": {
    "storm_drains": {
      "capacity_utilization": 78,
      "blocked_drains": 23,
      "maintenance_required": 45
    },
    "pumping_stations": {
      "operational": 18,
      "under_maintenance": 2,
      "efficiency": 85
    }
  },
  "water_quality": {
    "ph_level": 7.2,
    "turbidity": 4.8,
    "dissolved_oxygen": 6.5,
    "bacterial_count": "Within limits",
    "overall_grade": "B+"
  },
  "thresholds": {
    "low_risk": 0.2,
    "moderate_risk": 0.4,
    "high_risk": 0.6,
    "extreme_risk": 0.8
  }
}
```

---

## 4. Urban Development Data

### Endpoint
```
GET /api/urban
```

### Query Parameters
- `include_projects` (optional): Include development projects
- `include_economic` (optional): Include economic indicators

### Response Schema

```json
{
  "nighttime_lights_intensity": 85.6,
  "urban_activity_index": 0.78,
  "population_density_estimate": 29650,
  "economic_activity_score": 8.2,
  "infrastructure_development": 0.85,
  "energy_consumption_estimate": 145.8,
  "activity_zones": [
    {
      "location": "Bandra Kurla Complex",
      "coordinates": [72.8697, 19.0596],
      "activity_level": "Very High",
      "lights_intensity": 95.2,
      "zone_type": "Commercial"
    }
  ],
  "time_series": [
    {
      "timestamp": "2024-01-01T00:00:00Z",
      "lights_intensity": 45.2,
      "activity_index": 0.35
    }
  ],
  "viirs_data": {
    "current_radiance": 85.6,
    "description": "VIIRS Day/Night Band nighttime lights",
    "cloud_free_observations": 28,
    "data_quality": "High",
    "geotiff_url": "/data/viirs_mumbai_latest.tif"
  },
  "urban_expansion": {
    "built_up_area": 603.4,
    "change_from_2020": "+8.7%",
    "expansion_rate": "2.9% annually",
    "new_developments": 45
  },
  "transportation_activity": {
    "traffic_density": 0.82,
    "public_transport_usage": 0.75,
    "road_network_utilization": 0.88,
    "congestion_index": 0.71
  },
  "economic_indicators": {
    "gdp_contribution": 12.5,
    "employment_rate": 0.78,
    "business_establishments": 125000,
    "industrial_activity": 0.85
  },
  "infrastructure_metrics": {
    "electricity_access": 0.98,
    "water_supply_coverage": 0.89,
    "sewerage_coverage": 0.76,
    "road_density": 15.2
  },
  "development_projects": [
    {
      "name": "Mumbai Metro Line 3",
      "status": "Under Construction",
      "completion": "2024-12-31",
      "impact_score": 9.2
    }
  ],
  "thresholds": {
    "low_activity": 30,
    "moderate_activity": 50,
    "high_activity": 70,
    "very_high_activity": 85
  }
}
```

---

## 5. Resilience Indices

### Endpoint
```
GET /api/indices
```

### Query Parameters
- `include_benchmarking` (optional): Include city comparisons
- `include_recommendations` (optional): Include improvement suggestions

### Response Schema

```json
{
  "overall_resilience_score": 72.5,
  "resilience_grade": "B+",
  "last_updated": "2024-01-01T12:00:00Z",
  "trend": "improving",
  "change_from_last_month": "+3.2",
  "domain_scores": {
    "air_quality": {
      "score": 45.2,
      "grade": "D+",
      "weight": 0.25,
      "trend": "declining",
      "key_issues": ["High PM2.5", "Traffic emissions"]
    },
    "heat_resilience": {
      "score": 68.9,
      "grade": "C+",
      "weight": 0.25,
      "trend": "stable",
      "key_issues": ["Urban heat island", "Extreme temperatures"]
    },
    "water_management": {
      "score": 78.3,
      "grade": "B",
      "weight": 0.25,
      "trend": "improving",
      "key_issues": ["Flood risk", "Drainage capacity"]
    },
    "urban_development": {
      "score": 85.6,
      "grade": "A-",
      "weight": 0.25,
      "trend": "improving",
      "key_issues": ["Infrastructure gaps", "Population density"]
    }
  },
  "composite_indicators": {
    "environmental_health": 57.1,
    "infrastructure_resilience": 81.9,
    "social_vulnerability": 64.8,
    "economic_stability": 79.2
  },
  "time_series": [
    {
      "timestamp": "2024-01-01T00:00:00Z",
      "overall_score": 69.8
    }
  ],
  "risk_assessment": {
    "immediate_risks": [
      {
        "type": "Air Quality",
        "severity": "High",
        "probability": 0.85,
        "impact": "Health impacts, reduced visibility"
      }
    ],
    "emerging_risks": [
      {
        "type": "Flood Risk",
        "severity": "Moderate",
        "probability": 0.45,
        "impact": "Infrastructure damage, displacement"
      }
    ]
  },
  "recommendations": [
    {
      "domain": "Air Quality",
      "priority": "High",
      "action": "Implement vehicle emission controls",
      "timeline": "3 months",
      "expected_impact": "+8 points"
    }
  ],
  "benchmarking": {
    "similar_cities": [
      {
        "city": "Delhi",
        "score": 68.2,
        "comparison": "+4.3"
      }
    ],
    "global_average": 69.5,
    "regional_average": 71.8
  },
  "data_quality": {
    "completeness": 0.92,
    "accuracy": 0.88,
    "timeliness": 0.95,
    "overall_confidence": 0.91
  },
  "thresholds": {
    "excellent": 90,
    "good": 75,
    "fair": 60,
    "poor": 45,
    "critical": 30
  }
}
```

---

## 6. Health Check

### Endpoint
```
GET /health
```

### Response Schema

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "version": "1.0.0",
  "services": {
    "database": "healthy",
    "nasa_api": "healthy",
    "cache": "healthy"
  },
  "uptime": 86400
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_PARAMETERS` | Invalid query parameters provided |
| `DATA_NOT_FOUND` | Requested data not available |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `SERVICE_UNAVAILABLE` | External service (NASA API) unavailable |
| `INTERNAL_ERROR` | Server internal error |

## Rate Limiting

- **Development**: 1000 requests per hour
- **Production**: 10000 requests per hour
- Rate limit headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Data Freshness

| Endpoint | Update Frequency | Cache Duration |
|----------|------------------|----------------|
| `/api/air` | 15 minutes | 5 minutes |
| `/api/heat` | 30 minutes | 10 minutes |
| `/api/water` | 1 hour | 15 minutes |
| `/api/urban` | 24 hours | 4 hours |
| `/api/indices` | 6 hours | 1 hour |

## WebSocket Support (Future)

Real-time updates will be available via WebSocket connections:

```javascript
const ws = new WebSocket('wss://api.cityforge.io/ws');
ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  // Handle real-time updates
};
```

## SDK Support

Official SDKs available for:
- JavaScript/TypeScript
- Python
- Java
- Go

Example JavaScript usage:
```javascript
import { CityForgeAPI } from '@cityforge/sdk';

const api = new CityForgeAPI({
  baseURL: 'https://api.cityforge.io',
  apiKey: 'your-api-key'
});

const airData = await api.air.getCurrent();
```
