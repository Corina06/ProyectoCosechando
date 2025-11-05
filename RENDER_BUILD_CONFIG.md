# 🔧 CONFIGURACIÓN PARA RENDER - BUILD COMMAND

## ⚠️ ERROR CRÍTICO: Root Directory

**IMPORTANTE:** El Root Directory en Render **DEBE ESTAR VACÍO**. No configure `/backend` ni ningún otro valor.

### Cómo corregir:
1. Render Dashboard → Tu servicio → Settings
2. Busca "Root Directory"
3. **BÓRRALO COMPLETAMENTE** (debe estar vacío)
4. Guarda los cambios

---

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
npm start
```

O:
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
npm start
```

---

## 🔍 VERIFICAR CONFIGURACIÓN EN RENDER

1. Ve a Render Dashboard → Tu servicio
2. Click en **Settings**
3. Verifica que **Root Directory** esté **COMPLETAMENTE VACÍO** (sin ningún valor)
4. Si Root Directory tiene un valor (como `/backend` o `/backend `), **bórralo completamente**
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

## ⚠️ ERROR COMÚN

Si ves este error:
```
Service Root Directory "/opt/render/project/src/backend " is missing.
```

**Solución:** Ve a Settings → Root Directory → Bórralo completamente → Guarda

