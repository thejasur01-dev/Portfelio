@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Voyla - saytni yig'ish

echo.
echo   ============================================
echo     VOYLA - SAYTNI YIG'ISH
echo   ============================================
echo.

call npm run build

echo.
echo   Tayyor. Endi "dist" papkasini Netlify oynasiga tashlang.
echo.
explorer "%~dp0dist"
pause
