# Configuración Rápida para Render

## Pasos para Desplegar

### 1. Backend (API)

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Configuración:
   ```
   Name: cosechando-backend
   Environment: Node
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   ```
5. Variables de entorno:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = tu conexión de MongoDB Atlas
   - `FRONTEND_URL` = (configurar después del frontend)
6. Guarda y espera el despliegue
7. Copia la URL del backend

### 2. Frontend

1. "New +" → "Web Service"
2. Mismo repositorio
3. Configuración:
   ```
   Name: cosechando-frontend
   Environment: Node
   Build Command: cd frontend && npm install && npm run build:prod
   Start Command: cd frontend && npm run serve:prod
   ```
4. Variables de entorno:
   - `NODE_ENV` = `production`
5. Guarda y espera el despliegue
6. Copia la URL del frontend

### 3. Actualizar URLs

1. Edita `frontend/src/environments/environment.prod.ts` con la URL de tu backend
2. Actualiza `FRONTEND_URL` en el backend con la URL de tu frontend
3. Haz commit y push (Render redeplegará automáticamente)

### 4. MongoDB Atlas

1. Crea cluster en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Configura acceso de red: `0.0.0.0/0` (permite todas las IPs)
3. Crea usuario y obtén la cadena de conexión
4. Úsala como `MONGO_URI` en el backend

## Archivos Creados

- `render.yaml` - Configuración para despliegue automático (opcional)
- `DEPLOY.md` - Guía detallada de despliegue
- `frontend/server.js` - Servidor para servir el frontend en producción
- Actualizado `backend/server.js` - CORS configurado para producción
- Actualizado `frontend/package.json` - Scripts de producción agregados

## Notas

- Los servicios gratuitos se "duermen" después de 15 min de inactividad
- La primera petición puede tardar ~30 segundos
- Verifica que MongoDB Atlas permita conexiones desde cualquier IP

