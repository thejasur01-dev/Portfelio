@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Voyla - sayt

echo.
echo   ============================================
echo     VOYLA - SAYTNI KO'RISH
echo   ============================================
echo.
echo   Quyida chiqqan manzilni brauzerda oching
echo   (odatda http://localhost:5173).
echo   To'xtatish uchun: shu oynani yoping
echo.

if not exist "node_modules" (
  echo   Birinchi ishga tushirish - kutubxonalar o'rnatilmoqda...
  echo.
  call npm install
)

call npm run dev
pause
