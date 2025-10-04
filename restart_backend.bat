@echo off
echo ========================================================
echo Restarting CityForge Mumbai Pulse Backend
echo With Real NASA Data Integration Fixes
echo ========================================================
echo.

echo Stopping any existing backend processes...
taskkill /f /im python.exe 2>nul

echo.
echo Starting backend with real NASA data...
echo.

python start_backend.py

pause
