# 🚀 GUÍA DE DESPLIEGUE EN VERCEL

## ¿Por qué Vercel?
- ✅ **GRATIS** para proyectos personales
- ✅ **Optimizado para Angular**
- ✅ **Deploy automático** desde GitHub
- ✅ **Dominio personalizado**
- ✅ **Muy rápido**

## PASO A PASO

### 1. **PREPARAR EL PROYECTO**

Instala Vercel CLI:
```bash
npm install -g vercel
```

### 2. **CREAR CUENTA**

1. Ve a [vercel.com](https://vercel.com)
2. Regístrate con GitHub

### 3. **DESPLEGAR**

**Opción A: Desde la terminal**
```bash
# En tu proyecto
vercel

# Sigue las instrucciones:
# - Set up and deploy? Y
# - Which scope? (tu usuario)
# - Link to existing project? N
# - Project name: cosechando
# - In which directory is your code? ./
# - Override settings? N
```

**Opción B: Desde GitHub**
1. Sube tu código a GitHub
2. En Vercel: "Import Project"
3. Selecciona tu repositorio
4. ¡Deploy automático!

### 4. **CONFIGURACIÓN AUTOMÁTICA**

Vercel detecta Angular automáticamente:
- Build Command: `ng build`
- Output Directory: `dist/tu-proyecto`
- Install Command: `npm install`

### 5. **RESULTADO**

URL final: `https://cosechando.vercel.app`

## VENTAJAS ADICIONALES

- **Analytics gratis**
- **Performance monitoring**
- **Edge functions**
- **Actualizaciones automáticas**

## COSTO: **GRATIS** 🎉