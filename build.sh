#!/bin/bash
# Script de build para Render
# Este script asegura que el build se ejecute desde el directorio correcto

set -e  # Salir si hay algún error

echo "📁 Directorio actual: $(pwd)"
echo "📁 Listando directorios..."
ls -la

# Verificar que estamos en el directorio raíz del proyecto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
  echo "❌ Error: No se encontraron los directorios backend o frontend"
  echo "   Asegúrate de que el Root Directory en Render esté configurado correctamente"
  exit 1
fi

echo ""
echo "📦 Instalando dependencias del backend..."
cd backend
npm install
cd ..

echo ""
echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install

echo ""
echo "🔨 Compilando frontend..."
npm run build:prod

echo ""
echo "✅ Build completado exitosamente"
echo "📁 Verificando que el frontend esté compilado..."
if [ -d "dist/cosechando/browser" ]; then
  echo "✅ Frontend compilado encontrado en: dist/cosechando/browser"
else
  echo "⚠️ Advertencia: No se encontró el frontend compilado"
fi


