@echo off

echo ======================================
echo STARTING PRIVACY PRESERVATION PROJECT
echo ======================================

start cmd /k "cd backend && node server.js"

timeout /t 2 > nul

start cmd /k "py crypto_api.py"

timeout /t 2 > nul

start cmd /k "cd frontend && npm run dev"

echo.
echo ======================================
echo ALL SERVICES STARTED
echo ======================================
echo Frontend  : http://localhost:5173
echo Backend   : http://localhost:5000
echo Crypto API: http://localhost:5001
echo ======================================

pause
