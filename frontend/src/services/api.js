import axios from 'axios'

// Mock data imports
import airMockData from '../mocks/airData.json'
import heatMockData from '../mocks/heatData.json'
import waterMockData from '../mocks/waterData.json'
import urbanMockData from '../mocks/urbanData.json'
import indicesMockData from '../mocks/indicesData.json'

// Helper function to determine if we should use mock data
const shouldUseMockData = () => {
  return import.meta.env.VITE_USE_MOCK_DATA === 'true'
}

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  retry: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000;
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    }
    
    console.log(`Making API request to: ${config.baseURL}${config.url}`)
    console.log(`Mock data mode: ${shouldUseMockData()}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.message)
    return Promise.reject(error)
  }
)

// Helper function to make API call with fallback to mock data
const makeApiCall = async (endpoint, mockData, params = {}) => {
  try {
    if (shouldUseMockData()) {
      console.log(`Using mock data for ${endpoint}`)
      await new Promise(resolve => setTimeout(resolve, 500))
      return { data: { data: mockData, status: 'success' } }
    }

    console.log(`🚀 Attempting real API call to: ${endpoint}`)
    const response = await api.get(endpoint, { params })
    
    if (!response.data) {
      throw new Error('No data received from API')
    }
    
    console.log(`✅ API call successful for ${endpoint}:`, response.data)
    
    // Transform the response to match expected format
    return {
      data: {
        data: response.data,
        status: 'success',
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error(`❌ API call failed for ${endpoint}:`, error)
    console.error(`Error details:`, error.response?.data || error.message)
    console.warn(`🔄 Falling back to mock data for ${endpoint}`)
    // Fallback to mock data if API fails
    return { data: mockData }
  }
}

// API Functions
export const getAirData = async (params = {}) => {
  const response = await makeApiCall('/api/air', airMockData, params)
  if (!response?.data?.data) {
    throw new Error('Invalid data format received from air API')
  }
  return response.data.data
}

export const getHeatData = async (params = {}) => {
  const response = await makeApiCall('/api/heat', heatMockData, params)
  if (!response?.data?.data) {
    throw new Error('Invalid data format received from heat API')
  }
  return response.data.data
}

export const getWaterData = async (params = {}) => {
  const response = await makeApiCall('/api/water', waterMockData, params)
  return {
    ...response.data,
    timestamp: new Date().toISOString(),
  }
}

export const getUrbanData = async (params = {}) => {
  const response = await makeApiCall('/api/urban', urbanMockData, params)
  return {
    ...response.data,
    timestamp: new Date().toISOString(),
  }
}

export const getIndicesData = async (params = {}) => {
  const response = await makeApiCall('/api/indices', indicesMockData, params)
  return {
    ...response.data,
    timestamp: new Date().toISOString(),
  }
}

// Health check function
export const healthCheck = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    return { status: 'error', message: 'API unavailable' }
  }
}

export default api
