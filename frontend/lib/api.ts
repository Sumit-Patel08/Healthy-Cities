/**
 * API client for CityForge Mumbai Pulse Backend
 * Connects to real NASA satellite data through our backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || `HTTP ${response.status}`,
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Dashboard overview with real NASA data
  async getDashboardOverview() {
    return this.request('/dashboard/overview');
  }

  // Air quality data from MODIS and OMI satellites
  async getAirQuality(days: number = 7) {
    return this.request(`/air-quality?days=${days}`);
  }

  // Heat island data from NASA POWER
  async getHeatIsland(days: number = 7) {
    return this.request(`/heat-island?days=${days}`);
  }

  // Water resources data from SMAP
  async getWaterResources(days: number = 7) {
    return this.request(`/water-resources?days=${days}`);
  }

  // Urban development data from VIIRS
  async getUrbanDevelopment(days: number = 30) {
    return this.request(`/urban-development?days=${days}`);
  }

  // Anomaly detection results
  async getAnomalies(days: number = 30) {
    return this.request(`/anomalies?days=${days}`);
  }

  // Environmental forecasts
  async getForecasts(horizon: number = 7) {
    return this.request(`/forecasts?horizon=${horizon}`);
  }

  // Environmental indices
  async getIndices() {
    return this.request('/indices');
  }

  // Real-time data update status
  async getRealTimeUpdate() {
    return this.request('/real-time-update');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types for TypeScript
export interface DashboardOverview {
  timestamp: string;
  location: string;
  current_conditions: {
    aqi: number;
    temperature: number;
    humidity: number;
    heat_index: number;
    flood_risk: number;
    air_quality_status: string;
    heat_risk_level: string;
  };
  environmental_health_score: number;
  risk_assessment: {
    aqi_risk: { level: number; description: string };
    flood_risk: { level: number; description: string };
    heat_risk: { level: number; description: string };
  };
  forecasts: any;
  anomalies: any;
  urban_impact: any;
  data_quality: string;
}

export interface AirQualityData {
  current_aqi: number;
  aqi_category: string;
  pm25_estimated: number;
  no2_levels: number;
  aod_550nm: number;
  historical_data: Array<{
    date: string;
    aqi: number;
    pm25: number;
    no2: number;
    aod: number;
  }>;
  forecast: {
    dates: string[];
    values: number[];
  };
  health_recommendations: {
    level: string;
    message: string;
    color: string;
  };
  data_source: string;
}

export interface HeatIslandData {
  current_temperature: number;
  heat_index: number;
  heat_risk_level: string;
  max_temperature: number;
  min_temperature: number;
  humidity: number;
  historical_data: Array<{
    date: string;
    temperature: number;
    heat_index: number;
    humidity: number;
    max_temp: number;
    min_temp: number;
  }>;
  risk_predictions: any;
  urban_heat_analysis: any;
  data_source: string;
}

export interface WaterResourcesData {
  soil_moisture: number;
  precipitation: number;
  ndwi: number;
  flood_risk_score: number;
  flood_risk_category: string;
  is_monsoon_season: boolean;
  historical_data: Array<{
    date: string;
    soil_moisture: number;
    precipitation: number;
    ndwi: number;
    flood_risk: number;
  }>;
  flood_forecast: {
    dates: string[];
    values: number[];
  };
  water_stress_index: number;
  data_source: string;
}

export interface UrbanDevelopmentData {
  economic_activity_index: number;
  radiance_levels: number;
  activity_level: string;
  urban_environmental_load: number;
  historical_trends: Array<{
    date: string;
    radiance: number;
    economic_activity: number;
    urban_load: number;
  }>;
  urban_impact_analysis: any;
  environmental_correlations: any;
  growth_patterns: {
    trend: string;
    growth_rate: number;
    average_radiance: number;
    average_urban_load: number;
  };
  data_source: string;
}

export interface EnvironmentalIndices {
  current_indices: {
    environmental_stress_index: number;
    air_quality_composite: number;
    water_stress_index: number;
    urban_environmental_load: number;
    overall_health_score: number;
  };
  historical_trends: Array<{
    date: string;
    environmental_stress_index: number;
    air_quality_composite: number;
    water_stress_index: number;
    urban_environmental_load: number;
  }>;
  index_explanations: Record<string, string>;
  risk_thresholds: Record<string, { min: number; max: number; color: string }>;
  last_updated: string;
}

// Utility functions
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getRiskColor = (level: number): string => {
  if (level <= 2) return 'green';
  if (level <= 3) return 'yellow';
  if (level <= 4) return 'orange';
  return 'red';
};

export const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return 'green';
  if (aqi <= 100) return 'yellow';
  if (aqi <= 150) return 'orange';
  if (aqi <= 200) return 'red';
  if (aqi <= 300) return 'purple';
  return 'maroon';
};

export const getAQICategory = (aqi: number): string => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

export default apiClient;
