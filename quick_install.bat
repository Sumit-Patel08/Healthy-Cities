@echo off
echo Installing Python dependencies from requirements.txt...
echo.

cd /d %~dp0backend
python -m pip install -r requirements.txt

echo.
echo ✅ Dependencies installed!
echo.
echo Starting backend server...
cd ..
python start_backend.py

pause
