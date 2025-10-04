@echo off
echo Installing Python packages using full Python path...
echo.

REM Use the full path to Python that we know works
"C:\Users\SUMIT PATEL\AppData\Local\Programs\Python\Python313\python.exe" -m pip install Flask Flask-CORS pandas numpy scikit-learn xgboost requests python-dateutil Werkzeug

echo.
echo Installation complete! Starting backend...
echo.

"C:\Users\SUMIT PATEL\AppData\Local\Programs\Python\Python313\python.exe" start_backend.py

pause
