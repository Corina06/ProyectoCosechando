#!/bin/bash

echo "Iniciando Cosechando..."
echo

echo "Instalando dependencias del frontend..."
npm install

echo
echo "Instalando dependencias del backend..."
cd backend
npm install
cd ..

echo
echo "Poblando base de datos con productos de ejemplo..."
cd backend
node seedProducts.js
cd ..

echo
echo "Iniciando servidores..."
echo "Frontend: http://localhost:4200"
echo "Backend: http://localhost:3000"
echo

# Iniciar backend en segundo plano
cd backend
npm start &
cd ..

# Esperar un poco y luego iniciar frontend
sleep 3
ng serve

echo
echo "Servidores iniciados."