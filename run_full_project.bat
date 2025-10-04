@echo off
echo ========================================================
echo    CityForge Mumbai Pulse - Full Project Startup
echo    Real NASA Satellite Data Environmental Monitoring
echo ========================================================
echo.

echo 🚀 Starting Backend Server...
echo.
start "Backend Server" cmd /k "cd /d %~dp0 && python start_backend.py"

echo ⏳ Waiting for backend to initialize...
timeout /t 10 /nobreak > nul

echo 🌐 Starting Frontend Development Server...
echo.
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo ✅ Both servers are starting up!
echo.
echo 🔗 Frontend: http://localhost:3000
echo 🔗 Backend API: http://localhost:5000/api
echo.
echo 📊 Available Features:
echo   • Real-time NASA satellite data
echo   • 5 trained ML models for predictions
echo   • Air quality monitoring (MODIS/OMI)
echo   • Heat island analysis (NASA POWER)
echo   • Water resources tracking (SMAP)
echo   • Urban development monitoring (VIIRS)
echo   • Environmental anomaly detection
echo.
echo 🛰️  Data Sources:
echo   • MODIS - Aerosol Optical Depth
echo   • NASA POWER - Meteorological Data  
echo   • VIIRS - Nighttime Lights
echo   • SMAP - Soil Moisture
echo   • OMI - NO2 Column Density
echo.
echo Press any key to open the application in browser...
pause > nul

start http://localhost:3000

echo.
echo ========================================================
echo 🎯 CityForge Mumbai Pulse is now running!
echo    Close this window to stop monitoring servers.
echo ========================================================
