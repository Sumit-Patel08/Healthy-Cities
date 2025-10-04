@echo off
echo 🚀 Starting CityForge - Mumbai Pulse Backend
echo 📡 Connecting to your 5 NASA data models...
echo.

cd /d "%~dp0"

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo 🛰️  Loading NASA satellite data models:
echo    - Model 1: Environment (Air Quality)
echo    - Model 2: Risk (Heat Management) 
echo    - Model 3: Timeseries (Water Management)
echo    - Model 4: Anomaly Detection (Resilience Indices)
echo    - Model 5: Urban Impact (Urban Activity)
echo.

echo 🌐 Starting FastAPI server on http://localhost:8000
echo 📊 API Documentation will be available at: http://localhost:8000/docs
echo.

python main.py

pause
