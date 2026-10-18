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
echo   Tayyor. Odatda bu kerak emas - "SAYTNI CHIQARISH.bat" dan
echo   foydalaning, Vercel saytni o'zi yangilaydi.
echo   Qo'lda joylamoqchi bo'lsangiz: "dist" papkasini tashlang.
echo.
explorer "%~dp0dist"
pause
