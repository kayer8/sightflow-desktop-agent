@echo off
setlocal

cd /d "%~dp0"

if not exist "node_modules\" (
  echo Installing dependencies...
  npm install
  if errorlevel 1 (
    echo.
    echo Failed to install dependencies.
    pause
    exit /b 1
  )
)

echo Starting SightFlow Desktop Agent...
npm run dev

echo.
echo App exited.
pause
