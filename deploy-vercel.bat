@echo off
REM Deployment script for TaskChain Mini to Vercel (Windows)

echo.
echo TaskChain Mini - Vercel Deployment Script
echo ==========================================
echo.

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo Installing Vercel CLI...
    npm install -g vercel
)

echo Vercel CLI ready
echo.

REM Navigate to client directory
echo Navigating to client directory...
cd client
if errorlevel 1 goto :error

echo.
echo Building client for production...
call npm run build
if errorlevel 1 goto :error

echo.
echo Deploying to Vercel...
call vercel --prod
if errorlevel 1 goto :error

echo.
echo Deployment complete!
echo Your live URL: https://taskchain-mini.vercel.app
goto :end

:error
echo Error occurred during deployment
exit /b 1

:end
