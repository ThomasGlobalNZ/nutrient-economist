@echo off
REM SmartKete - Quick Push to GitHub
REM Use this when you just want to push recipe changes

echo ========================================
echo SmartKete - Quick Push
echo ========================================
echo.

git add .
git commit -m "Added new recipes"
git push

echo.
echo Done! Your recipes are now on GitHub.
pause
