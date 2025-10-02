# 🏗️ Mumbai Pulse - Technical Architecture
## NASA Space Apps Challenge 2025

---

## 🎯 **System Overview**

**Mumbai Pulse** is a revolutionary Urban Resilience AI System that creates a real-time digital twin of Mumbai, integrating NASA Earth Observation data with local sensors and citizen inputs to predict, prevent, and respond to environmental crises.

---

## 🏛️ **High-Level Architecture**

```mermaid
graph TB
    subgraph "Data Sources"
        A[NASA EO Data<br/>MODIS, Sentinel, ECOSTRESS]
        B[Local Sensors<br/>CPCB, Municipal]
        C[Citizen Reports<br/>Mobile App, Social]
        D[External APIs<br/>Weather, Traffic]
    end
    
    subgraph "Data Pipeline"
        E[Data Ingestion<br/>Apache Kafka]
        F[Data Processing<br/>Apache Spark]
        G[Feature Store<br/>Redis + PostGIS]
    end
    
    subgraph "AI Core"
        H[Multi-Task Model<br/>CNN-Transformer-GNN]
        I[Physics Engine<br/>Atmospheric Dispersion]
        J[Uncertainty Engine<br/>Bayesian Deep Learning]
    end
    
    subgraph "Intelligence Layer"
        K[Risk Predictor<br/>72h Forecasting]
        L[Policy Simulator<br/>What-If Analysis]
        M[Citizen Engagement<br/>Gamification Engine]
    end
    
    subgraph "User Interfaces"
        N[Municipal Dashboard<br/>React + D3.js]
        O[Citizen Mobile App<br/>React Native]
        P[Public Web Portal<br/>Next.js]
        Q[Emergency Interface<br/>Real-time Alerts]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    E --> F
    F --> G
    G --> H
    G --> I
    G --> J
    H --> K
    I --> K
    J --> K
    K --> L
    K --> M
    L --> N
    M --> O
    K --> P
    K --> Q
```

---

## 🧠 **AI Model Architecture**

### **Multi-Task Spatio-Temporal Network**

```python
class MumbaiPulseModel(nn.Module):
    """
    Unified multi-task model for urban resilience prediction
    
    Tasks:
    1. Air Quality Regression (PM2.5, NO2, AQI)
    2. Water Quality Classification (Safe/Contaminated)
    3. Waste Detection Segmentation (Dump locations)
    4. Heat Risk Prediction (Heat index, vulnerable areas)
    """
    
    def __init__(self):
        # Spatial Feature Extractor
        self.spatial_encoder = SpatialCNN()
        
        # Temporal Feature Extractor  
        self.temporal_encoder = TransformerEncoder()
        
        # Graph Neural Network for city topology
        self.graph_network = GraphAttentionNetwork()
        
        # Physics-Informed Layer
        self.physics_layer = AtmosphericDispersionLayer()
        
        # Task-Specific Heads
        self.air_quality_head = RegressionHead(output_dim=3)
        self.water_quality_head = ClassificationHead(output_dim=2)
        self.waste_detection_head = SegmentationHead()
        self.heat_risk_head = RegressionHead(output_dim=1)
        
        # Uncertainty Quantification
        self.uncertainty_head = UncertaintyHead()
```

### **Key Technical Innovations**

#### **1. Spatio-Temporal CNN-Transformer Hybrid**
```python
class SpatioTemporalEncoder(nn.Module):
    """
    Combines CNN for spatial features with Transformer for temporal dependencies
    """
    def __init__(self):
        # 3D CNN for spatio-temporal features
        self.conv3d = nn.Conv3d(in_channels=15, out_channels=64, kernel_size=(3,3,3))
        
        # Transformer for long-range temporal dependencies
        self.transformer = nn.TransformerEncoder(
            nn.TransformerEncoderLayer(d_model=512, nhead=8),
            num_layers=6
        )
        
        # Attention mechanism for feature fusion
        self.attention = MultiHeadAttention(embed_dim=512, num_heads=8)
```

#### **2. Graph Neural Network for City Topology**
```python
class MumbaiGraphNetwork(nn.Module):
    """
    Models Mumbai as a graph where:
    - Nodes: City wards, monitoring stations, key locations
    - Edges: Roads, wind patterns, water flow, administrative boundaries
    """
    def __init__(self):
        self.node_features = 128  # Ward characteristics, population, infrastructure
        self.edge_features = 64   # Distance, connectivity, flow patterns
        
        # Graph Attention Networks for different relationships
        self.spatial_gat = GATConv(self.node_features, 64, heads=4)
        self.temporal_gat = GATConv(64, 32, heads=4)
        self.administrative_gat = GATConv(32, 16, heads=2)
```

#### **3. Physics-Informed Deep Learning**
```python
class PhysicsInformedLayer(nn.Module):
    """
    Incorporates atmospheric physics for air pollution dispersion
    """
    def __init__(self):
        # Gaussian plume dispersion model parameters
        self.wind_speed_layer = nn.Linear(64, 32)
        self.stability_class_layer = nn.Linear(64, 32)
        self.emission_source_layer = nn.Linear(64, 32)
        
    def forward(self, features, meteorology):
        # Apply Gaussian plume equation as a differentiable layer
        wind_speed = self.wind_speed_layer(meteorology)
        stability = self.stability_class_layer(meteorology)
        
        # Physics-constrained prediction
        dispersion_pattern = self.gaussian_plume_dispersion(
            features, wind_speed, stability
        )
        return dispersion_pattern
```

---

## 📊 **Data Pipeline Architecture**

### **Real-Time Data Ingestion**

```python
# Apache Kafka Configuration for Real-time Data Streaming
KAFKA_CONFIG = {
    'bootstrap_servers': ['localhost:9092'],
    'topics': {
        'nasa_eo_data': 'mumbai_nasa_eo',
        'local_sensors': 'mumbai_sensors',
        'citizen_reports': 'mumbai_citizens',
        'weather_data': 'mumbai_weather'
    }
}

class DataIngestionPipeline:
    """
    Real-time data ingestion from multiple sources
    """
    def __init__(self):
        self.nasa_connector = NASAEarthDataConnector()
        self.cpcb_connector = CPCBAPIConnector()
        self.citizen_connector = CitizenReportConnector()
        self.weather_connector = WeatherAPIConnector()
        
    async def ingest_nasa_data(self):
        """Fetch latest NASA EO data"""
        modis_data = await self.nasa_connector.get_modis_data()
        sentinel_data = await self.nasa_connector.get_sentinel_data()
        ecostress_data = await self.nasa_connector.get_ecostress_data()
        
        return self.preprocess_satellite_data(modis_data, sentinel_data, ecostress_data)
```

### **Feature Engineering Pipeline**

```python
class FeatureEngineer:
    """
    Advanced feature engineering for urban resilience modeling
    """
    
    def create_environmental_indices(self, satellite_data):
        """Calculate environmental indices from satellite data"""
        # Normalized Difference Vegetation Index
        ndvi = (satellite_data['nir'] - satellite_data['red']) / \
               (satellite_data['nir'] + satellite_data['red'])
        
        # Normalized Difference Water Index
        ndwi = (satellite_data['green'] - satellite_data['nir']) / \
               (satellite_data['green'] + satellite_data['nir'])
        
        # Urban Heat Island Index
        uhii = satellite_data['lst'] - satellite_data['lst'].mean()
        
        # Built-up Index
        ndbi = (satellite_data['swir'] - satellite_data['nir']) / \
               (satellite_data['swir'] + satellite_data['nir'])
        
        return {
            'ndvi': ndvi, 'ndwi': ndwi, 'uhii': uhii, 'ndbi': ndbi
        }
    
    def create_temporal_features(self, time_series_data):
        """Create temporal features for time series analysis"""
        features = {}
        
        # Seasonal decomposition
        features['trend'] = self.extract_trend(time_series_data)
        features['seasonal'] = self.extract_seasonal(time_series_data)
        features['residual'] = self.extract_residual(time_series_data)
        
        # Lag features
        for lag in [1, 3, 7, 30]:  # 1 day, 3 days, 1 week, 1 month
            features[f'lag_{lag}'] = time_series_data.shift(lag)
        
        # Rolling statistics
        for window in [3, 7, 30]:
            features[f'rolling_mean_{window}'] = time_series_data.rolling(window).mean()
            features[f'rolling_std_{window}'] = time_series_data.rolling(window).std()
        
        return features
```

---

## 🌐 **Application Architecture**

### **Backend Services (FastAPI + Microservices)**

```python
# Main FastAPI Application
from fastapi import FastAPI, WebSocket, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mumbai Pulse API", version="1.0.0")

# Microservices
@app.get("/api/v1/air-quality/{ward_id}")
async def get_air_quality(ward_id: str):
    """Get real-time air quality for specific ward"""
    prediction = await ai_model.predict_air_quality(ward_id)
    return {
        "ward_id": ward_id,
        "aqi": prediction.aqi,
        "pm25": prediction.pm25,
        "no2": prediction.no2,
        "risk_level": prediction.risk_level,
        "recommendations": prediction.recommendations
    }

@app.get("/api/v1/heat-risk/{lat}/{lon}")
async def get_heat_risk(lat: float, lon: float):
    """Get heat risk for specific location"""
    risk_score = await ai_model.predict_heat_risk(lat, lon)
    return {
        "location": {"lat": lat, "lon": lon},
        "heat_index": risk_score.heat_index,
        "risk_level": risk_score.risk_level,
        "nearest_cooling_center": risk_score.nearest_shelter
    }

@app.websocket("/ws/real-time-updates")
async def websocket_endpoint(websocket: WebSocket):
    """Real-time updates via WebSocket"""
    await websocket.accept()
    while True:
        # Send real-time environmental updates
        updates = await get_real_time_updates()
        await websocket.send_json(updates)
        await asyncio.sleep(30)  # Update every 30 seconds
```

### **Frontend Architecture (React + TypeScript)**

```typescript
// Main Dashboard Component
interface EnvironmentalData {
  airQuality: AirQualityData;
  waterQuality: WaterQualityData;
  heatRisk: HeatRiskData;
  wasteAlerts: WasteAlert[];
}

const MumbaiPulseDashboard: React.FC = () => {
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData>();
  const [selectedWard, setSelectedWard] = useState<string>('');
  
  // Real-time data subscription
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/real-time-updates');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setEnvironmentalData(data);
    };
    
    return () => ws.close();
  }, []);

  return (
    <div className="mumbai-pulse-dashboard">
      <Header />
      <div className="dashboard-grid">
        <AirQualityPanel data={environmentalData?.airQuality} />
        <HeatRiskPanel data={environmentalData?.heatRisk} />
        <WaterQualityPanel data={environmentalData?.waterQuality} />
        <WasteManagementPanel data={environmentalData?.wasteAlerts} />
      </div>
      <InteractiveMap 
        onWardSelect={setSelectedWard}
        environmentalData={environmentalData}
      />
    </div>
  );
};
```

### **Mobile App Architecture (React Native)**

```typescript
// Citizen Reporting Interface
const CitizenReportScreen: React.FC = () => {
  const [photo, setPhoto] = useState<string>('');
  const [location, setLocation] = useState<Location>();
  const [reportType, setReportType] = useState<ReportType>('');

  const submitReport = async () => {
    const report = {
      photo,
      location,
      type: reportType,
      timestamp: new Date(),
      userId: await getUserId()
    };
    
    // AI-powered photo analysis
    const analysis = await analyzePhoto(photo);
    report.aiAnalysis = analysis;
    
    await submitCitizenReport(report);
    
    // Gamification: Award points
    await awardPoints(report.userId, calculatePoints(report));
  };

  return (
    <View style={styles.container}>
      <CameraComponent onPhotoTaken={setPhoto} />
      <LocationPicker onLocationSelect={setLocation} />
      <ReportTypeSelector onTypeSelect={setReportType} />
      <SubmitButton onPress={submitReport} />
    </View>
  );
};
```

---

## 🔧 **Technology Stack**

### **Backend Technologies**
- **API Framework**: FastAPI (Python) - High performance, automatic API documentation
- **AI/ML**: PyTorch, Transformers, PyTorch Geometric (for GNNs)
- **Data Processing**: Apache Spark, Pandas, NumPy, Rasterio
- **Database**: PostgreSQL + PostGIS (spatial data), Redis (caching)
- **Message Queue**: Apache Kafka (real-time data streaming)
- **Containerization**: Docker + Kubernetes
- **Cloud**: AWS/Azure (scalable deployment)

### **Frontend Technologies**
- **Web Dashboard**: React + TypeScript, D3.js (visualizations)
- **Mobile App**: React Native (cross-platform)
- **Maps**: Mapbox GL JS (interactive maps)
- **UI Framework**: Material-UI, Tailwind CSS
- **State Management**: Redux Toolkit
- **Real-time**: WebSocket, Socket.io

### **Data & AI Technologies**
- **Satellite Data**: GDAL, Rasterio, Xarray
- **Machine Learning**: Scikit-learn, XGBoost, LightGBM
- **Deep Learning**: PyTorch, PyTorch Lightning
- **Computer Vision**: OpenCV, Pillow
- **NLP**: Transformers, spaCy (for citizen report analysis)
- **Geospatial**: GeoPandas, Shapely, Folium

---

## 🚀 **Deployment Architecture**

### **Microservices Deployment**

```yaml
# docker-compose.yml
version: '3.8'
services:
  api-gateway:
    build: ./api-gateway
    ports:
      - "8000:8000"
    depends_on:
      - ai-service
      - data-service
      
  ai-service:
    build: ./ai-service
    environment:
      - MODEL_PATH=/models/mumbai_pulse_model.pth
    volumes:
      - ./models:/models
    
  data-service:
    build: ./data-service
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/mumbai_pulse
    depends_on:
      - postgres
      - redis
      
  postgres:
    image: postgis/postgis:13-3.1
    environment:
      - POSTGRES_DB=mumbai_pulse
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
      
  redis:
    image: redis:6-alpine
    
  kafka:
    image: confluentinc/cp-kafka:latest
    environment:
      - KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
      - KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092
```

### **Scalability Considerations**
- **Horizontal Scaling**: Kubernetes auto-scaling based on CPU/memory usage
- **Load Balancing**: NGINX for API load balancing
- **Caching Strategy**: Redis for frequently accessed predictions
- **CDN**: CloudFlare for static assets and global distribution
- **Database Sharding**: Partition data by geographical regions

---

## 📈 **Performance Optimization**

### **Model Optimization**
- **Model Quantization**: Reduce model size by 75% using INT8 quantization
- **Knowledge Distillation**: Create lightweight student models for mobile deployment
- **Batch Inference**: Process multiple predictions simultaneously
- **Model Caching**: Cache predictions for frequently queried locations

### **Data Pipeline Optimization**
- **Parallel Processing**: Use Apache Spark for distributed data processing
- **Data Compression**: Use Parquet format for efficient storage
- **Incremental Updates**: Only process new/changed data
- **Smart Caching**: Cache processed features to avoid recomputation

---

## 🔒 **Security & Privacy**

### **Data Security**
- **Encryption**: AES-256 encryption for data at rest and in transit
- **API Security**: JWT tokens, rate limiting, input validation
- **Database Security**: Row-level security, encrypted connections
- **Audit Logging**: Comprehensive logging of all system activities

### **Privacy Protection**
- **Data Anonymization**: Remove personally identifiable information
- **Consent Management**: Clear opt-in/opt-out mechanisms
- **Data Retention**: Automatic deletion of old personal data
- **GDPR Compliance**: Right to be forgotten, data portability

---

## 🎯 **Next Steps: Implementation Roadmap**

### **Phase 1: Foundation (Days 1-2)**
1. Set up development environment and project structure
2. Implement basic data ingestion pipeline
3. Create core AI model architecture
4. Set up database and basic API endpoints

### **Phase 2: Core Development (Days 3-4)**
1. Train multi-task AI model with Mumbai data
2. Implement real-time prediction system
3. Build interactive dashboard with maps
4. Create citizen reporting mobile interface

### **Phase 3: Integration & Polish (Days 5-6)**
1. Integrate all components and test end-to-end
2. Implement gamification and citizen engagement
3. Add policy simulation capabilities
4. Optimize performance and add monitoring

**Ready to build the future of urban resilience? Let's start coding! 🚀**
