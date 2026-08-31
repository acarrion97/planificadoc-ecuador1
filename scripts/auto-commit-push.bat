@echo off
REM ============================================
REM Auto Commit y Push - Lunes a Viernes 18:00
REM ============================================

cd /d "C:\Users\Lukas\Documents\GitHub\planificadoc-ecuador1"

REM Verificar si hay cambios
git status --porcelain >nul 2>&1
if %errorlevel% neq 0 (
    echo [%date% %time%] Error al verificar estado de git
    exit /b 1
)

REM Obtener cambios en formato compacto
for /f "tokens=*" %%i in ('git status --porcelain') do set CHANGES=%%i

if not defined CHANGES (
    echo [%date% %time%] No hay cambios para commitear
    exit /b 0
)

REM Agregar todos los cambios
git add -A

REM Obtener fecha y hora para el mensaje
for /f "tokens=2 delims==" %%i in ('wmic os get localdatetime /value 2^>nul') do set datetime=%%i
set FECHA=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%
set HORA=%datetime:~8,2%:%datetime:~10,2%

REM Commit con mensaje descriptivo
git commit -m "auto-commit: cambios del %FECHA% a las %HORA%"

REM Push al remote
git push

echo [%date% %time%] Commit y push realizados exitosamente
