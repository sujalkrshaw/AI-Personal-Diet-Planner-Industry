@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules (echo Installing dependencies... & call npm install || exit /b 1)
call npm test || exit /b 1
call npm run check || exit /b 1
call npm run build || exit /b 1
call npm run dev
