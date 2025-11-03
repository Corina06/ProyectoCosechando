# 🚀 GUÍA DE DESPLIEGUE EN GITHUB PAGES

## ¿Por qué GitHub Pages?
- ✅ **GRATIS** con cuenta de GitHub
- ✅ **Integrado con GitHub**
- ✅ **Fácil de configurar**
- ✅ **URL limpia**: `usuario.github.io/proyecto`

## PASO A PASO

### 1. **INSTALAR ANGULAR CLI GHPAGES**

```bash
npm install -g angular-cli-ghpages
```

### 2. **SUBIR CÓDIGO A GITHUB**

1. Crea un repositorio en GitHub: `cosechando-app`
2. Sube tu código:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/cosechando-app.git
git push -u origin main
```

### 3. **CONFIGURAR ANGULAR PARA GITHUB PAGES**

En `angular.json`, modifica la configuración de build:

```json
"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
    "baseHref": "/cosechando-app/"
  }
}
```

### 4. **DESPLEGAR**

```bash
# Compilar y desplegar
ng build --configuration production --base-href="/cosechando-app/"
npx angular-cli-ghpages --dir=dist/tu-proyecto-angular
```

### 5. **CONFIGURAR GITHUB PAGES**

1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Source: "Deploy from a branch"
4. Branch: `gh-pages`
5. Folder: `/ (root)`

### 6. **RESULTADO**

URL: `https://tu-usuario.github.io/cosechando-app/`

## AUTOMATIZACIÓN CON GITHUB ACTIONS

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: ng build --configuration production --base-href="/cosechando-app/"
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist/tu-proyecto-angular
```

## COSTO: **GRATIS** 🎉