@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Voyla - admin panel

echo.
echo   ============================================
echo     VOYLA - ADMIN PANEL
echo   ============================================
echo.
echo   Brauzer o'zi ochiladi:  http://localhost:4455
echo   To'xtatish uchun:       shu oynani yoping
echo.

if not exist "node_modules" (
  echo   Birinchi ishga tushirish - kutubxonalar o'rnatilmoqda...
  echo   Bu bir necha daqiqa oladi, faqat bir marta.
  echo.
  call npm install
)

call npm run admin
echo.
echo   Admin panel to'xtadi.
pause
