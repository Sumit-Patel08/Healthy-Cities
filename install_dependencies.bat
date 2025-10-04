@echo off
echo ========================================================
echo Installing Python Dependencies for CityForge Mumbai Pulse
echo ========================================================
echo.

echo Installing Flask and web framework dependencies...
python -m pip install Flask==2.3.3
python -m pip install Flask-CORS==4.0.0
python -m pip install Werkzeug==2.3.7

echo.
echo Installing data science libraries...
python -m pip install pandas==2.0.3
python -m pip install numpy==1.24.3

echo.
echo Installing machine learning libraries...
python -m pip install scikit-learn==1.3.0
python -m pip install xgboost==1.7.6

echo.
echo Installing utility libraries...
python -m pip install requests==2.31.0
python -m pip install python-dateutil==2.8.2
python -m pip install python-dotenv==1.0.0
python -m pip install gunicorn==21.2.0

echo.
echo ========================================================
echo ✅ Installation Complete!
echo ========================================================
echo.
echo Now you can start the backend with:
echo python start_backend.py
echo.
pause
