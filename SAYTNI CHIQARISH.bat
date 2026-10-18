@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Voyla - saytni internetga chiqarish

echo.
echo   ============================================
echo     VOYLA - SAYTNI INTERNETGA CHIQARISH
echo   ============================================
echo.
echo   O'zgarishlar GitHub'ga yuboriladi.
echo   Vercel saytni bir-ikki daqiqada o'zi yangilaydi.
echo.

git add -A
git commit -m "Sayt yangilandi"
git push

echo.
echo   Tayyor. Sayt:  https://voylauz.vercel.app
echo.
pause
