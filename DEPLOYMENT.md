# Guía de Despliegue - Cosechando

## Requisitos Previos
- Node.js (versión 18 o superior)
- MongoDB (local o MongoDB Atlas)
- Angular CLI (`npm install -g @angular/cli`)

## Instalación Local

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd ProyectoCosechando
```

### 2. Instalar dependencias del frontend
```bash
npm install
```

### 3. Instalar dependencias del backend
```bash
cd backend
npm install
cd ..
```

### 4. Configurar variables de entorno
Editar `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/cosechando
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
PORT=3000
```

### 5. Inicializar base de datos con productos de ejemplo
```bash
cd backend
node seedProducts.js
cd ..
```

### 6. Ejecutar en modo desarrollo
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
ng serve
```

La aplicación estará disponible en:
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

## Despliegue en Producción

### Opciones de Hosting Gratuito

#### 1. Frontend (Angular)
- **Netlify** (Recomendado)
- **Vercel**
- **GitHub Pages**
- **Firebase Hosting**

#### 2. Backend (Node.js + Express)
- **Railway** (Recomendado)
- **Render**
- **Heroku** (plan gratuito limitado)
- **Cyclic**

#### 3. Base de Datos
- **MongoDB Atlas** (500MB gratis)

### Pasos para Despliegue

#### A. Preparar el Frontend para Producción
```bash
ng build --configuration production
```

#### B. Configurar Backend para Producción
1. Actualizar `backend/.env` con URLs de producción
2. Configurar CORS para permitir tu dominio de frontend

#### C. Desplegar en Railway (Backend)
1. Crear cuenta en railway.app
2. Conectar repositorio de GitHub
3. Configurar variables de entorno
4. Desplegar automáticamente

#### D. Desplegar en Netlify (Frontend)
1. Crear cuenta en netlify.com
2. Conectar repositorio de GitHub
3. Configurar build: `ng build --configuration production`
4. Configurar directorio de publicación: `dist/cosechando`

### Variables de Entorno para Producción

#### Backend (.env)
```
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/cosechando
JWT_SECRET=tu_jwt_secret_super_seguro
PORT=3000
NODE_ENV=production
```

#### Frontend (environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-backend.railway.app/api'
};
```

## Configuración de Dominio Personalizado

### Para acceso desde cualquier dispositivo:
1. Configurar dominio personalizado en Netlify/Vercel
2. Configurar SSL automático
3. Configurar PWA para instalación en móviles

## Monitoreo y Mantenimiento
- Configurar logs en el backend
- Monitorear uso de base de datos
- Configurar backups automáticos
- Implementar analytics (Google Analytics)

## Comandos Útiles
```bash
# Desarrollo
npm run dev          # Ejecutar frontend y backend simultáneamente
npm run seed         # Poblar base de datos con datos de ejemplo

# Producción
npm run build        # Construir frontend para producción
npm start           # Iniciar servidor de producción
```

## Solución de Problemas Comunes
1. **Error de CORS**: Verificar configuración en backend/server.js
2. **Base de datos no conecta**: Verificar MONGO_URI en .env
3. **Imágenes no cargan**: Verificar URLs de imágenes en productos
4. **Token expirado**: Implementar refresh token o aumentar tiempo de expiración