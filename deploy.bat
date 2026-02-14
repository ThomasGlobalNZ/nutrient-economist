@echo off
REM SmartKete - Deploy to GitHub Pages
REM This script commits changes and deploys the app

echo ========================================
echo SmartKete Deployment Script
echo ========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo Please install Git first: winget install --id Git.Git
    pause
    exit /b 1
)

echo [1/5] Checking for changes...
git status

echo.
echo [2/5] Adding all changes...
git add .

echo.
echo [3/5] Committing changes...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Update recipes and app

git commit -m "%commit_msg%"

echo.
echo [4/5] Pushing to GitHub...
git push

echo.
echo [5/5] Building and deploying to GitHub Pages...
call npm run build
call npm run deploy

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo Your app will be live in a few minutes at:
echo https://YOUR-USERNAME.github.io/smartkete/
echo.
pause
