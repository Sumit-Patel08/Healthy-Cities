@echo off
echo ========================================================
echo 🔧 FIXING NASA Data Issues (-999 Temperature Problem)
echo ========================================================
echo.

echo 🛑 Stopping existing backend processes...
taskkill /f /im python.exe 2>nul

echo.
echo 🔧 Applied fixes:
echo   ✅ NASA missing data cleaning (-999 values)
echo   ✅ Realistic Mumbai temperature/humidity values
echo   ✅ Proper data validation and error handling
echo   ✅ Enhanced model feature preparation
echo.

echo 🚀 Starting backend with cleaned NASA data...
echo.

python start_backend.py

echo.
echo ========================================================
echo 🎯 Backend should now show realistic values:
echo   Temperature: ~28.5°C (not -999°C)
echo   Humidity: ~75%% (not -999%%)
echo   AQI: ~45 (realistic for Mumbai)
echo ========================================================

pause
