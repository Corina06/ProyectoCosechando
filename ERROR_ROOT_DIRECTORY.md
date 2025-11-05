# ⚠️ ERROR CRÍTICO: Root Directory configurado incorrectamente en Render

## 🚨 PROBLEMA DETECTADO

El error muestra:
```
Service Root Directory "/opt/render/project/src/backend " is missing.
builder.sh: line 51: cd: /opt/render/project/src/backend : No such file or directory
```

## 🔍 CAUSA

Render está configurado con un **Root Directory** que apunta a `/backend`, pero:
1. El proyecto tiene la estructura: `backend/` y `frontend/` en la raíz
2. El Root Directory debe estar **VACÍO** o apuntar a la raíz del proyecto
3. Hay un espacio extra en la configuración: `/backend ` (con espacio)

## ✅ SOLUCIÓN INMEDIATA

### Paso 1: Corregir Root Directory en Render

1. Ve a **Render Dashboard** → Tu servicio
2. Click en **Settings**
3. Busca la sección **"Root Directory"**
4. **BORRA TODO** el contenido del campo Root Directory (debe estar vacío)
5. Si dice `/backend` o `/backend ` (con espacio), **bórralo completamente**
6. Deja el campo **COMPLETAMENTE VACÍO**
7. Guarda los cambios

### Paso 2: Verificar Build Command

**Build Command debe ser:**
```bash
npm run build
```

O:
```bash
bash build.sh
```

### Paso 3: Verificar Start Command

**Start Command debe ser:**
```bash
npm start
```

O:
```bash
cd backend && npm start
```

## 📋 CONFIGURACIÓN CORRECTA COMPLETA

### En Render Dashboard → Settings:

**Root Directory:** (vacío - sin ningún valor)

**Build Command:**
```bash
npm run build
```

**Start Command:**
```bash
npm start
```

**Environment Variables:**
- `MONGO_URI` = `mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/cosechando?retryWrites=true&w=majority`
- `NODE_ENV` = `production`
- `JWT_SECRET` = `tu-secreto-jwt-super-seguro-minimo-32-caracteres`

## 🎯 ESTRUCTURA DEL PROYECTO

```
ProyectoCosechando/
├── backend/          ← Backend Node.js
│   ├── server.js
│   ├── package.json
│   └── ...
├── frontend/         ← Frontend Angular
│   ├── src/
│   ├── package.json
│   └── ...
├── package.json      ← Scripts raíz
├── build.sh          ← Script de build
└── ...
```

## ⚠️ IMPORTANTE

- **NO** configures Root Directory a `/backend`
- **NO** configures Root Directory a `/frontend`
- **DEBE** estar vacío para que Render use la raíz del repositorio
- El backend se ejecuta desde la raíz usando `npm start` que ejecuta `cd backend && npm start`

## ✅ DESPUÉS DE CORREGIR

Render debería:
1. Clonar el repositorio correctamente
2. Ejecutar el build desde la raíz
3. Instalar dependencias del backend y frontend
4. Compilar el frontend
5. Iniciar el backend correctamente





