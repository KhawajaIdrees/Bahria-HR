@echo off
cd /d "%~dp0"
echo Stopping whatever is using port 5000 (often an old dotnet API)...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr :5000 ^| findstr LISTENING') do (
  echo Ending PID %%a
  taskkill /PID %%a /F 2>nul
)
echo Done. Now run: cd backend ^&^& dotnet run --urls "http://localhost:5000"
pause
