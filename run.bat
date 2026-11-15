@echo off
title ChromaDiaries - Letter Pad Generator Studio
echo ========================================================================
echo       ChromaDiaries - Author Selection Letter Pad & Poster Studio
echo ========================================================================
echo.
echo Starting local web server on http://localhost:8080 ...
echo Opening generator studio in your default browser...
echo.
cd /d "%~dp0"
start "" http://localhost:8080/index.html
python -m http.server 8080
pause
