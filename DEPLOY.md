# Guía de Despliegue en Render

Esta guía te ayudará a desplegar el proyecto Cosechando en Render.

## Prerrequisitos

1. Cuenta en [Render](https://render.com)
2. Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (para la base de datos)
3. Repositorio en GitHub conectado a Render

## Paso 1: Configurar MongoDB Atlas

1. Crea una cuenta en MongoDB Atlas
2. Crea un nuevo cluster (gratis)
3. Crea un usuario de base de datos
4. Configura el acceso de red (permite 0.0.0.0/0 para permitir conexiones desde Render)
5. Obtén la cadena de conexión (Connection String)
   - Ejemplo: `mongodb+srv://usuario:password@cluster.mongodb.net/cosechando?retryWrites=true&w=majority`

## Paso 2: Desplegar el Backend

1. Ve a tu dashboard de Render
2. Click en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura el servicio:
   - **Name**: `cosechando-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free
5. Configura las variables de entorno:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render lo configurará automáticamente, pero puedes ponerlo)
   - `MONGO_URI`: Tu cadena de conexión de MongoDB Atlas
   - `FRONTEND_URL`: La URL de tu frontend (la configurarás después)
6. Click en "Create Web Service"
7. Espera a que el despliegue termine
8. Copia la URL del backend (ej: `https://cosechando-backend.onrender.com`)

## Paso 3: Desplegar el Frontend

1. En el dashboard de Render, click en "New +" → "Web Service"
2. Conecta el mismo repositorio
3. Configura el servicio:
   - **Name**: `cosechando-frontend`
   - **Environment**: `Node`
   - **Build Command**: `cd frontend && npm install && npm run build:prod`
   - **Start Command**: `cd frontend && npm run serve:prod`
   - **Plan**: Free
4. Configura las variables de entorno:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
5. Click en "Create Web Service"
6. Espera a que el despliegue termine
7. Copia la URL del frontend (ej: `https://cosechando-frontend.onrender.com`)

## Paso 4: Actualizar Configuraciones

### Actualizar environment.prod.ts

Edita `frontend/src/environments/environment.prod.ts` y cambia la URL del API:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://cosechando-backend.onrender.com/api' // Reemplaza con tu URL
};
```

### Actualizar FRONTEND_URL en el Backend

1. Ve al dashboard del backend en Render
2. Ve a "Environment"
3. Actualiza `FRONTEND_URL` con la URL de tu frontend
4. Guarda los cambios (esto reiniciará el servicio)

### Actualizar CORS en el Backend (si es necesario)

El backend ya está configurado para aceptar múltiples orígenes. Si necesitas ajustar el CORS, edita `backend/server.js`.

## Paso 5: Recompilar y Redesplegar

Después de cambiar `environment.prod.ts`:

```bash
git add .
git commit -m "Actualizar URL de API para producción"
git push origin main
```

Render automáticamente redeplegará los servicios.

## Notas Importantes

- **Tiempo de inicio**: Los servicios gratuitos de Render se "duermen" después de 15 minutos de inactividad. La primera petición puede tardar ~30 segundos.
- **Base de datos**: Asegúrate de que MongoDB Atlas permita conexiones desde cualquier IP (0.0.0.0/0)
- **Variables de entorno**: Nunca subas archivos `.env` al repositorio. Usa las variables de entorno en Render.
- **Health Check**: El backend tiene un endpoint `/health` que Render puede usar para verificar el estado.

## Verificación

1. Backend: Visita `https://tu-backend.onrender.com/health` - debería responder con JSON
2. Frontend: Visita `https://tu-frontend.onrender.com` - debería cargar la aplicación
3. API: Prueba hacer una petición desde el frontend al backend

## Solución de Problemas

### Error de CORS
- Verifica que `FRONTEND_URL` esté configurado correctamente en el backend
- Revisa los logs del backend en Render

### Error de conexión a MongoDB
- Verifica que la cadena de conexión esté correcta
- Verifica que MongoDB Atlas permita conexiones desde cualquier IP
- Revisa los logs del backend para ver errores específicos

### Frontend no carga
- Verifica que el build se haya completado correctamente
- Revisa los logs del frontend
- Asegúrate de que el path `dist/cosechando/browser` exista después del build

