# 🔧 SOLUCIÓN: Puerto ya en uso (EADDRINUSE)

## ⚠️ ERROR

```
Error: listen EADDRINUSE: address already in use :::3001
```

## 🔍 CAUSA

El puerto 3001 ya está siendo usado por otro proceso (probablemente otra instancia del servidor).

## ✅ SOLUCIÓN 1: Cerrar el proceso que está usando el puerto

### En Windows PowerShell:

1. **Encontrar el proceso:**
```powershell
netstat -ano | findstr :3001
```

2. **Verás algo como:**
```
TCP    0.0.0.0:3001           0.0.0.0:0              LISTENING       12345
```

3. **Cerrar el proceso (reemplaza 12345 con el PID que veas):**
```powershell
taskkill /PID 12345 /F
```

### Solución rápida (buscar y cerrar automáticamente):

```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
```

## ✅ SOLUCIÓN 2: Usar otro puerto

Crea un archivo `.env` en `backend/` con:
```
PORT=3002
```

O ejecuta con:
```powershell
$env:PORT=3002; npm start
```

## ✅ SOLUCIÓN 3: Cambiar puerto por defecto

Edita `backend/server.js` y cambia:
```javascript
const PORT = process.env.PORT || 3002;  // Cambiar de 3001 a 3002
```

## 📝 NOTA

El código del servidor ahora mostrará un mensaje útil cuando detecte este error, indicando cómo solucionarlo.






