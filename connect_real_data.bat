@echo off
echo 🔗 Connecting CityForge Frontend to Real NASA Data Models
echo.

cd /d "%~dp0"

echo Updating frontend configuration to use real backend...
cd frontend

echo # API Configuration > .env
echo VITE_API_BASE_URL=http://localhost:8000 >> .env
echo VITE_USE_MOCK_DATA=false >> .env
echo. >> .env
echo # Mapbox Configuration (replace with your own token) >> .env
echo VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNrZjFjMjJjMzBjZmQyeW1xYzJhMjJjMjEifQ.demo_token >> .env
echo. >> .env
echo # App Configuration >> .env
echo VITE_APP_TITLE=CityForge - Mumbai Pulse >> .env
echo VITE_APP_DESCRIPTION=Urban Resilience Powered by NASA Data >> .env

echo.
echo ✅ Frontend configured to use REAL NASA data!
echo.
echo 🚀 Next steps:
echo 1. Run: cd backend ^&^& start_backend.bat
echo 2. Run: cd frontend ^&^& npm run dev
echo 3. Open: http://localhost:3001
echo.
echo Your 5 NASA models will now provide real-time data to the frontend!

pause
