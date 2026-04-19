@echo off
title Faculty Induction - dev servers
cd /d "%~dp0"

echo.
echo === Starting BACKEND on http://localhost:5000 ===
start "FacultyInduction-API" cmd /k "cd /d "%~dp0backend" && dotnet run --urls "http://localhost:5000""

timeout /t 4 /nobreak >nul

echo === Starting FRONTEND (Vite) ===
start "FacultyInduction-UI" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Two windows opened: API + Vite.
echo Open the LOCAL URL Vite prints (often http://localhost:5173).
echo Admin login: admin@faculty.com  /  Admin@123  then go to /admin
echo.
pause
