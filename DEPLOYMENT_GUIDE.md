# 🚀 Guía de Despliegue - Cosechando

## 📋 Pasos para Subir tu Proyecto a Producción

### 1. 🌐 Configurar MongoDB Atlas (Base de Datos en la Nube)

1. **Crear cuenta**: Ve a https://www.mongodb.com/atlas
2. **Crear cluster**: Selecciona el plan gratuito (M0)
3. **Configurar usuario**:
   - Username: `cosechando_user`
   - Password: `genera_password_seguro`
4. **Configurar IP**: Agregar `0.0.0.0/0` (todas las IPs)
5. **Obtener URL**: Copia la cadena de conexión

### 2. 🔧 Configurar Variables de Entorno

Actualiza `backend/.env`:
```env
MONGO_URI=mongodb+srv://cosechando_user:tu_password@cluster0.xxxxx.mongodb.net/cosechando?retryWrites=true&w=majority
NODE_ENV=production
```

### 3. 📊 Migrar Datos a la Nube

```bash
cd backend
node migrateToCloud.js
```

### 4. 🌐 Desplegar Backend

**Opción A: Railway**
1. Ve a https://railway.app
2. Conecta tu repositorio GitHub
3. Configura variables de entorno
4. Despliega automáticamente

**Opción B: Render**
1. Ve a https://render.com
2. Crea un nuevo Web Service
3. Conecta tu repositorio
4. Configura variables de entorno

### 5. 🎨 Desplegar Frontend

**Opción A: Netlify**
1. Ve a https://netlify.com
2. Arrastra la carpeta `dist` después de `ng build`
3. Configura redirects para Angular

**Opción B: Vercel**
1. Ve a https://vercel.com
2. Conecta tu repositorio GitHub
3. Configura como proyecto Angular

### 6. 🔗 Actualizar URLs

En `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-backend.railway.app/api'
};
```

### 7. ✅ Verificar Funcionamiento

- [ ] Base de datos conectada
- [ ] Backend desplegado
- [ ] Frontend desplegado
- [ ] CORS configurado
- [ ] Registro/Login funcionando
- [ ] Panel de comerciante funcionando

## 🔧 Comandos Útiles

```bash
# Construir para producción
ng build --configuration=production

# Probar localmente con datos de producción
npm run start:prod

# Verificar conexión a MongoDB Atlas
node backend/testConnection.js
```

## 🆘 Solución de Problemas

### Error de CORS
- Verifica que las URLs estén correctas en `corsOptions`
- Asegúrate de que el frontend esté en la lista de orígenes permitidos

### Error de Base de Datos
- Verifica que la URL de MongoDB Atlas sea correcta
- Confirma que el usuario tenga permisos
- Revisa que las IPs estén configuradas correctamente

### Error 404 en Rutas
- Configura redirects en Netlify: `_redirects` file con `/* /index.html 200`
- En Vercel se configura automáticamente

## 📞 URLs de Ejemplo

- **Frontend**: https://cosechando.netlify.app
- **Backend**: https://cosechando-api.railway.app
- **Base de Datos**: MongoDB Atlas (privada)