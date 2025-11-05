# 🔧 CONFIGURACIÓN PARA RENDER - BUILD COMMAND

## ⚠️ PROBLEMA DETECTADO

El error `cd: backend: No such file or directory` indica que Render no está ejecutando el comando desde el directorio raíz del proyecto.

## ✅ SOLUCIÓN 1: Usar el script de build (RECOMENDADO)

### Build Command en Render:
```bash
chmod +x build.sh && ./build.sh
```

O simplemente:
```bash
bash build.sh
```

### Start Command en Render:
```bash
cd backend && npm start
```

---

## ✅ SOLUCIÓN 2: Usar npm script del package.json

### Build Command en Render:
```bash
npm run build
```

### Start Command en Render:
```bash
npm start
```

---

## ✅ SOLUCIÓN 3: Comando directo mejorado

### Build Command en Render:
```bash
if [ -d "backend" ] && [ -d "frontend" ]; then cd backend && npm install && cd ../frontend && npm install && npm run build:prod; else echo "Error: Directorios no encontrados" && exit 1; fi
```

### Start Command en Render:
```bash
cd backend && npm start
```

---

## 🔍 VERIFICAR CONFIGURACIÓN EN RENDER

1. Ve a Render Dashboard → Tu servicio
2. Click en **Settings**
3. Verifica que **Root Directory** esté **VACÍO** (no debe tener ningún valor)
4. Si Root Directory tiene un valor, **bórralo** y deja vacío
5. Guarda los cambios

---

## 📋 VARIABLES DE ENTORNO NECESARIAS

Asegúrate de tener estas variables configuradas:

- `MONGO_URI` - URL de MongoDB Atlas
- `NODE_ENV` - `production`
- `JWT_SECRET` - Secreto JWT (mínimo 32 caracteres)
- `PORT` - Render lo configura automáticamente (opcional)

---

## 🧪 VERIFICACIÓN

Después de configurar, los logs deberían mostrar:

```
📁 Directorio actual: /opt/render/project/src
📁 Listando directorios...
📦 Instalando dependencias del backend...
📦 Instalando dependencias del frontend...
🔨 Compilando frontend...
✅ Build completado exitosamente
```

