# 🚀 GUÍA DE DESPLIEGUE EN FIREBASE HOSTING

## ¿Por qué Firebase?
- ✅ **GRATIS** hasta 10GB
- ✅ **Google Cloud** (muy rápido)
- ✅ **SSL automático**
- ✅ **CDN global**
- ✅ **Dominio personalizado**

## PASO A PASO

### 1. **INSTALAR FIREBASE CLI**

```bash
npm install -g firebase-tools
```

### 2. **CREAR PROYECTO EN FIREBASE**

1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. "Create a project"
3. Nombre: "cosechando-app"
4. Habilita Google Analytics (opcional)

### 3. **CONFIGURAR EN TU PROYECTO**

```bash
# Inicializar Firebase
firebase login
firebase init

# Selecciona:
# - Hosting
# - Use existing project: cosechando-app
# - Public directory: dist/tu-proyecto-angular
# - Single-page app: Yes
# - Overwrite index.html: No
```

### 4. **COMPILAR Y DESPLEGAR**

```bash
# Compilar Angular
ng build --configuration production

# Desplegar
firebase deploy
```

### 5. **RESULTADO**

URL: `https://cosechando-app.web.app`

## CONFIGURACIÓN AVANZADA

### Archivo `firebase.json`:
```json
{
  "hosting": {
    "public": "dist/tu-proyecto-angular",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Script en `package.json`:
```json
{
  "scripts": {
    "deploy": "ng build --configuration production && firebase deploy"
  }
}
```

Luego solo ejecuta:
```bash
npm run deploy
```

## VENTAJAS ADICIONALES

- **Analytics integrado**
- **Performance monitoring**
- **A/B testing**
- **Dominio personalizado gratis**

## COSTO: **GRATIS** hasta 10GB 🎉