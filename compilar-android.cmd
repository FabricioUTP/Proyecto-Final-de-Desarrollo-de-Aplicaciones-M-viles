@echo off
title KronoTask - Build Android
echo ============================================
echo  KronoTask - Compilacion Android
echo ============================================
echo.

REM --- 1. Variables de entorno (solo para esta ventana) ---
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%PATH%;%ANDROID_HOME%\platform-tools;%JAVA_HOME%\bin"
set "NODE_ENV=development"

REM Limpiar la unidad K: de intentos anteriores (ya no se usa)
subst K: /D >nul 2>&1

REM --- 2. Verificaciones ---
if not exist "%ANDROID_HOME%\platform-tools\adb.exe" (
    echo [ERROR] No se encontro adb en %ANDROID_HOME%\platform-tools
    pause & exit /b 1
)
if not exist "%JAVA_HOME%\bin\java.exe" (
    echo [ERROR] No se encontro Java en %JAVA_HOME%
    pause & exit /b 1
)

REM --- 3. El script funciona desde su propia carpeta (donde sea que este) ---
set "PROY=%~dp0"
cd /d "%PROY%"
echo Proyecto: %CD%

REM Detener si la ruta sigue siendo demasiado larga (el build fallara seguro)
echo %CD% | findstr /C:"Proyecto-Final-de-Desarrollo" >nul && (
    echo.
    echo ============================================================
    echo  [DETENIDO] La carpeta todavia tiene el nombre largo.
    echo.
    echo  El build NO puede funcionar hasta renombrarla:
    echo   1. Cierra VS Code, GitHub Desktop y la app de Claude.
    echo   2. En el Explorador, ve a Documentos - GitHub.
    echo   3. Clic en la carpeta del proyecto, tecla F2,
    echo      escribe: kronotask  y presiona Enter.
    echo   4. Entra a kronotask y vuelve a ejecutar este script.
    echo ============================================================
    echo.
    pause
    exit /b 1
)

REM --- 4. Verificar telefono conectado ---
echo.
echo Dispositivos detectados:
adb devices
echo.

REM --- 5. Detener daemons de Gradle viejos ---
if exist "android\gradlew.bat" (
    echo Deteniendo daemons de Gradle anteriores...
    pushd android
    call gradlew.bat --stop >nul 2>&1
    popd
)

REM --- 6. Limpiar caches de build generados con la ruta antigua ---
echo Limpiando caches de compilaciones anteriores...
if exist "android\.gradle" rd /s /q "android\.gradle" >nul 2>&1
if exist "android\build" rd /s /q "android\build" >nul 2>&1
if exist "android\app\build" rd /s /q "android\app\build" >nul 2>&1
if exist "android\app\.cxx" rd /s /q "android\app\.cxx" >nul 2>&1
for /d %%D in (node_modules\expo node_modules\expo-constants node_modules\expo-modules-core node_modules\react-native-gesture-handler node_modules\react-native-reanimated node_modules\react-native-safe-area-context node_modules\react-native-screens node_modules\react-native-worklets node_modules\@react-native-async-storage\async-storage) do (
    if exist "%%D\android\build" rd /s /q "%%D\android\build" >nul 2>&1
    if exist "%%D\android\.cxx" rd /s /q "%%D\android\.cxx" >nul 2>&1
)
echo [OK] Caches limpiadas.
echo.

REM --- 7. Compilar e instalar ---
echo Iniciando compilacion (la primera vez tarda 5-15 min)...
echo El log completo se guarda en build-log-k.txt
echo.
powershell -NoProfile -Command "npx expo run:android 2>&1 | Tee-Object -FilePath build-log-k.txt"

echo.
echo ============================================
echo  Proceso terminado. Revisa los mensajes de arriba.
echo ============================================
pause
