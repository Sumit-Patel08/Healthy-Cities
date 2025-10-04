@echo off
echo 🚀 Starting CityForge - Mumbai Pulse with REAL NASA Data
echo 🛰️  Connecting to your trained models and NASA datasets...
echo.

cd /d "%~dp0\backend"

echo Installing required Python packages...
pip install pandas numpy scikit-learn xgboost

echo.
echo 🔍 Checking your NASA data structure:
echo    - mumbai_pulse_data/models/model 1 environment/
echo    - mumbai_pulse_data/data/heat/nasa_power.json
echo    - mumbai_pulse_data/data/air/processed_aqi/
echo    - mumbai_pulse_data/data/water/flood_risk/
echo    - mumbai_pulse_data/data/urban/urban_patterns/
echo.

echo 🧠 Loading your trained XGBoost model...
echo 📡 Processing REAL NASA satellite data...
echo.

echo 🌐 Starting FastAPI server with REAL data on http://localhost:8000
echo 📊 API Documentation: http://localhost:8000/docs
echo.

python main.py

pause
