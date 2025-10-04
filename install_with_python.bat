@echo off
echo ========================================================
echo Installing Dependencies for CityForge Mumbai Pulse
echo Using Python 3.13 directly
echo ========================================================
echo.

echo Installing Flask web framework...
"C:\Users\SUMIT PATEL\AppData\Local\Programs\Python\Python313\python.exe" -m pip install Flask==2.3.3

echo Installing Flask-CORS...
"C:\Users\SUMIT PATEL\AppData\Local\Programs\Python\Python313\python.exe" -m pip install Flask-CORS==4.0.0

echo Installing pandas...
"C:\Users\SUMIT PATEL\AppData\Local\Programs\Python\Python313\python.exe" -m pip install pandas==2.0.3

echo Installing numpy...
"C:\Users\SUMIT PATEL\AppData\Local\Programs\Python\Python313\python.exe" -m pip install numpy==1.24.3

echo Installing scikit-learn...
"C:\Users\SUMIT PATEL\AppData\Local\Programs\Python\Python313\python.exe" -m pip install scikit-learn==1.3.0

echo Installing xgboost...
"C:\Users\SUMIT PATEL\AppData\Local\Programs\Python\Python313\python.exe" -m pip install xgboost==1.7.6

echo Installing requests...
"C:\Users\SUMIT PATEL\AppData\Local\Programs\Python\Python313\python.exe" -m pip install requests==2.31.0

echo Installing additional utilities...
"C:\Users\SUMIT PATEL\AppData\Local\Programs\Python\Python313\python.exe" -m pip install python-dateutil==2.8.2
"C:\Users\SUMIT PATEL\AppData\Local\Programs\Python\Python313\python.exe" -m pip install Werkzeug==2.3.7

echo.
echo ========================================================
echo ✅ All dependencies installed successfully!
echo ========================================================
echo.
echo Now starting the backend server...
echo.

cd /d "%~dp0"
"C:\Users\SUMIT PATEL\AppData\Local\Programs\Python\Python313\python.exe" start_backend.py

pause
