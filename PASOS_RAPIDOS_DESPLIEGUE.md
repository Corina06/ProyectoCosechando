# ⚡ PASOS RÁPIDOS PARA DESPLEGAR (RECOMENDADO)

## 🎯 OPCIÓN MÁS FÁCIL: NETLIFY

### PASO 1: COMPILAR TU PROYECTO
```bash
# En tu terminal, dentro del proyecto
ng build --configuration production
```

### PASO 2: CREAR ARCHIVO DE REDIRECCIÓN
Crea un archivo llamado `_redirects` en la carpeta `src/` con este contenido:
```
/*    /index.html   200
```

### PASO 3: AGREGAR EL ARCHIVO A ANGULAR
En `angular.json`, busca la sección `"assets"` y agrega:
```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  "src/_redirects"
]
```

### PASO 4: RECOMPILAR
```bash
ng build --configuration production
```

### PASO 5: SUBIR A NETLIFY
1. Ve a [netlify.com](https://netlify.com)
2. Regístrate gratis
3. Arrastra la carpeta `dist/tu-proyecto-angular` a la zona de "Deploy"
4. ¡Listo! Te dará una URL

### PASO 6: PERSONALIZAR URL
1. En tu sitio, ve a "Site settings"
2. "Change site name"
3. Ponle: `cosechando-ana` o similar
4. Tu URL será: `https://cosechando-ana.netlify.app`

## 🎉 RESULTADO FINAL

- **URL para tu profesor**: `https://cosechando-ana.netlify.app`
- **Tiempo total**: 10-15 minutos
- **Costo**: GRATIS
- **Funciona 24/7**

## 📱 BONUS: TAMBIÉN FUNCIONA EN MÓVILES

Tu profesor podrá ver tu proyecto desde:
- ✅ Computadora
- ✅ Tablet
- ✅ Celular
- ✅ Cualquier navegador

## 🔧 SI TIENES PROBLEMAS

**Error de rutas**: Asegúrate de crear el archivo `_redirects`
**No carga**: Verifica que subiste la carpeta correcta de `dist/`
**Imágenes no aparecen**: Revisa que las rutas de imágenes sean relativas

## 📧 PARA ENVIAR A TU PROFESOR

"Profesor, mi proyecto está disponible en: https://cosechando-ana.netlify.app

Es una aplicación web completa de comercio electrónico para productos agrícolas, con:
- Sistema de registro y login
- Catálogo de productos
- Carrito de compras
- Panel de comerciante
- Diseño responsive

Puede acceder desde cualquier dispositivo con internet."