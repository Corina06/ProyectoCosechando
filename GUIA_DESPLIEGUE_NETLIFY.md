# 🚀 GUÍA DE DESPLIEGUE EN NETLIFY

## ¿Por qué Netlify?
- ✅ **GRATIS** para proyectos estudiantiles
- ✅ **Súper fácil** de usar
- ✅ **Dominio personalizado** (ej: cosechando-ana.netlify.app)
- ✅ **SSL automático** (HTTPS)
- ✅ **Actualizaciones automáticas** desde GitHub

## PASO A PASO

### 1. **PREPARAR EL PROYECTO**

Primero, necesitas compilar tu proyecto Angular:

```bash
# En la terminal, dentro de tu proyecto
ng build --configuration production
```

Esto creará una carpeta `dist/` con los archivos compilados.

### 2. **CREAR CUENTA EN NETLIFY**

1. Ve a [netlify.com](https://netlify.com)
2. Haz clic en "Sign up"
3. Regístrate con GitHub, GitLab o email

### 3. **SUBIR TU PROYECTO**

**Opción A: Arrastrar y soltar (Más fácil)**
1. En Netlify, haz clic en "Deploy manually"
2. Arrastra la carpeta `dist/tu-proyecto-angular` a la zona de drop
3. ¡Listo! Te dará una URL como: `https://amazing-site-123456.netlify.app`

**Opción B: Conectar con GitHub (Recomendado)**
1. Sube tu código a GitHub
2. En Netlify: "New site from Git"
3. Conecta tu repositorio
4. Configuración:
   - Build command: `ng build --configuration production`
   - Publish directory: `dist/tu-proyecto-angular`

### 4. **CONFIGURAR DOMINIO PERSONALIZADO**

1. En tu sitio de Netlify, ve a "Domain settings"
2. Cambia el nombre: `cosechando-ana.netlify.app`
3. ¡Tu profesor podrá acceder con esa URL!

### 5. **CONFIGURAR PARA ANGULAR**

Crea un archivo `_redirects` en la carpeta `src/` con:
```
/*    /index.html   200
```

Y agrega esto a tu `angular.json`:
```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  "src/_redirects"
]
```

## RESULTADO FINAL

Tu profesor podrá acceder a:
- **URL**: `https://cosechando-ana.netlify.app`
- **Funciona 24/7**
- **Carga rápida**
- **Responsive en móviles**

## COSTO: **GRATIS** 🎉