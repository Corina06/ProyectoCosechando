@echo off
echo Iniciando Cosechando...
echo.

echo Instalando dependencias del frontend...
call npm install

echo.
echo Instalando dependencias del backend...
cd backend
call npm install
cd ..

echo.
echo Poblando base de datos con productos de ejemplo...
cd backend
call node seedProducts.js
cd ..

echo.
echo Iniciando servidores...
echo Frontend: http://localhost:4200
echo Backend: http://localhost:3000
echo.

start cmd /k "cd backend && npm start"
timeout /t 3 /nobreak > nul
start cmd /k "ng serve"

echo.
echo Servidores iniciados. Presiona cualquier tecla para salir...
pause > nul