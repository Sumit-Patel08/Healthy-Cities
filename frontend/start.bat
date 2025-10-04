@echo off
echo.
echo ========================================
echo  CityForge - Mumbai Pulse Frontend
echo  Urban Resilience Powered by NASA Data
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not available
    echo Please ensure npm is installed with Node.js
    pause
    exit /b 1
)

echo Node.js and npm are available
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    echo This may take a few minutes...
    echo.
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
    echo.
) else (
    echo Dependencies already installed
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo Creating environment configuration...
    copy ".env.example" ".env" >nul
    echo Environment file created from template
    echo You can edit .env to customize your configuration
    echo.
)

echo Starting development server...
echo.
echo The application will open in your browser at:
echo http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
npm run dev

pause
