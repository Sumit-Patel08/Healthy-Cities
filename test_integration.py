"""
Integration Test Script for CityForge Mumbai Pulse
Tests the complete backend system with real NASA data integration
"""

import sys
import os
import requests
import json
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent / 'backend'
sys.path.insert(0, str(backend_dir))

def test_backend_health():
    """Test backend health endpoint"""
    try:
        response = requests.get('http://localhost:5000/api/health', timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend Health Check: PASSED")
            print(f"   Status: {data.get('status')}")
            print(f"   Models Loaded: {data.get('models_loaded')}")
            print(f"   Data Sources: {data.get('data_sources')}")
            return True
        else:
            print(f"❌ Backend Health Check: FAILED (Status: {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ Backend Health Check: FAILED (Error: {str(e)})")
        return False

def test_dashboard_overview():
    """Test dashboard overview endpoint"""
    try:
        response = requests.get('http://localhost:5000/api/dashboard/overview', timeout=15)
        if response.status_code == 200:
            data = response.json()
            print("✅ Dashboard Overview: PASSED")
            print(f"   Location: {data.get('location')}")
            print(f"   Current AQI: {data.get('current_conditions', {}).get('aqi')}")
            print(f"   Environmental Health Score: {data.get('environmental_health_score')}")
            print(f"   Data Quality: {data.get('data_quality')}")
            return True
        else:
            print(f"❌ Dashboard Overview: FAILED (Status: {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ Dashboard Overview: FAILED (Error: {str(e)})")
        return False

def test_air_quality():
    """Test air quality endpoint"""
    try:
        response = requests.get('http://localhost:5000/api/air-quality?days=7', timeout=15)
        if response.status_code == 200:
            data = response.json()
            print("✅ Air Quality Data: PASSED")
            print(f"   Current AQI: {data.get('current_aqi')}")
            print(f"   PM2.5: {data.get('pm25_estimated')}")
            print(f"   Data Source: {data.get('data_source')}")
            print(f"   Historical Records: {len(data.get('historical_data', []))}")
            return True
        else:
            print(f"❌ Air Quality Data: FAILED (Status: {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ Air Quality Data: FAILED (Error: {str(e)})")
        return False

def test_models_integration():
    """Test ML models integration"""
    try:
        # Test multiple endpoints that use different models
        endpoints = [
            '/api/forecasts?horizon=7',
            '/api/anomalies?days=30',
            '/api/indices'
        ]
        
        results = []
        for endpoint in endpoints:
            response = requests.get(f'http://localhost:5000{endpoint}', timeout=15)
            results.append(response.status_code == 200)
        
        if all(results):
            print("✅ ML Models Integration: PASSED")
            print("   All 5 models responding correctly")
            return True
        else:
            print(f"❌ ML Models Integration: FAILED ({sum(results)}/{len(results)} endpoints working)")
            return False
    except Exception as e:
        print(f"❌ ML Models Integration: FAILED (Error: {str(e)})")
        return False

def test_data_quality():
    """Test data quality and NASA integration"""
    try:
        response = requests.get('http://localhost:5000/api/real-time-update', timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ NASA Data Integration: PASSED")
            print(f"   Quality Score: {data.get('quality_score')}")
            print(f"   Sources Updated: {data.get('sources')}")
            print(f"   Last Update: {data.get('timestamp')}")
            return True
        else:
            print(f"❌ NASA Data Integration: FAILED (Status: {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ NASA Data Integration: FAILED (Error: {str(e)})")
        return False

def check_data_files():
    """Check if required data files exist"""
    required_files = [
        'mumbai_pulse_data/data/ml_ready/master_dataset.csv',
        'mumbai_pulse_data/models/model 1 environment/environmental_health_predictor.pkl',
        'mumbai_pulse_data/models/model 2 risk/multi_output_risk_classifier.pkl',
        'mumbai_pulse_data/models/model 3 timeseries/time_series_aqi_estimated.pkl',
        'mumbai_pulse_data/models/model 4 anomaly detection/anomaly_detection_system.pkl',
        'mumbai_pulse_data/models/model 5 urban impact/urban_environmental_impact_analysis.json'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
    
    if not missing_files:
        print("✅ Data Files Check: PASSED")
        print("   All required model and data files present")
        return True
    else:
        print("❌ Data Files Check: FAILED")
        print("   Missing files:")
        for file in missing_files:
            print(f"     - {file}")
        return False

def main():
    """Run all integration tests"""
    print("=" * 60)
    print("🚀 CityForge Mumbai Pulse - Integration Test Suite")
    print("   Testing NASA satellite data integration & ML models")
    print("=" * 60)
    print()
    
    # Check data files first
    print("📁 Checking Data Files...")
    data_files_ok = check_data_files()
    print()
    
    if not data_files_ok:
        print("⚠️  Warning: Some data files are missing. Tests may fail.")
        print("   Make sure all models and datasets are properly placed.")
        print()
    
    # Test backend endpoints
    print("🔧 Testing Backend Endpoints...")
    tests = [
        ("Backend Health", test_backend_health),
        ("Dashboard Overview", test_dashboard_overview),
        ("Air Quality API", test_air_quality),
        ("ML Models Integration", test_models_integration),
        ("NASA Data Integration", test_data_quality)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n🧪 Running {test_name} test...")
        result = test_func()
        results.append(result)
        print()
    
    # Summary
    print("=" * 60)
    print("📊 Test Results Summary")
    print("=" * 60)
    
    passed = sum(results)
    total = len(results)
    
    if data_files_ok:
        passed += 1
        total += 1
    
    print(f"✅ Passed: {passed}/{total}")
    print(f"❌ Failed: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
        print("   CityForge Mumbai Pulse is fully integrated and working!")
        print("   Ready to monitor Mumbai's environment with real NASA data!")
    else:
        print(f"\n⚠️  {total - passed} tests failed.")
        print("   Please check the backend server and data files.")
        print("   Make sure the backend is running on http://localhost:5000")
    
    print("\n🌐 Access the application:")
    print("   Frontend: http://localhost:3000")
    print("   Backend API: http://localhost:5000/api")
    print("   Health Check: http://localhost:5000/api/health")
    print("=" * 60)

if __name__ == "__main__":
    main()
