# 🔍 DIAGNÓSTICO COMPLETO BACKEND-FRONTEND

## ✅ CONFIGURACIÓN VERIFICADA

### 🔧 BACKEND (Node.js + Express)

**Archivo:** `backend/server.js`

#### 1. CORS Configurado ✅
```javascript
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
```
- ✅ Permite peticiones desde `http://localhost:4200` (Angular)
- ✅ Headers y métodos configurados correctamente

#### 2. Express JSON ✅
```javascript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
```
- ✅ Antes de las rutas (orden correcto)

#### 3. Rutas Configuradas ✅
```javascript
app.use('/api/products', productRoutes);
```
- ✅ Ruta `/api/products` montada correctamente

#### 4. Conexión MongoDB ✅
```javascript
mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true
})
```
- ✅ Timeouts configurados
- ✅ No detiene el servidor si falla la conexión

#### 5. Endpoint Health Check ✅
```javascript
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    server: 'running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});
```

### 🎨 FRONTEND (Angular)

**Archivo:** `frontend/src/environments/environment.ts`
```typescript
apiUrl: 'http://localhost:3000/api'
```
- ✅ URL correcta del backend

**Archivo:** `frontend/src/app/services/product.service.ts`
```typescript
private API_URI = environment.apiUrl;  // 'http://localhost:3000/api'
getProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.API_URI}/products`);
  // URL final: http://localhost:3000/api/products ✅
}
```
- ✅ Usa `environment.apiUrl` correctamente
- ✅ Construye la URL correctamente

**Archivo:** `frontend/src/app/pages/cliente/producto/producto.component.ts`
```typescript
loadProducts(): void {
  this.productService.getProducts().subscribe({
    next: (data: Product[]) => {
      this.products = data || [];
      console.log('Productos cargados:', this.products.length);
    },
    error: (error: any) => {
      console.error('Error al cargar productos:', error);
      if (error.status === 0) {
        console.error('No se pudo conectar con el servidor');
      }
    }
  });
}
```
- ✅ Manejo de errores implementado
- ✅ Logs para diagnóstico

## 🔄 FLUJO DE COMUNICACIÓN

```
┌─────────────────┐
│   Angular App   │
│ localhost:4200  │
└────────┬────────┘
         │
         │ GET /api/products
         │ Origin: http://localhost:4200
         ▼
┌─────────────────┐
│  Express Server │
│ localhost:3000  │
└────────┬────────┘
         │
         │ CORS verifica origin ✅
         │ express.json() parsea request ✅
         ▼
┌─────────────────┐
│  routes/product │
│  router.get('/')│
└────────┬────────┘
         │
         │ Product.find()
         ▼
┌─────────────────┐
│     MongoDB     │
│   (products)    │
└─────────────────┘
         │
         │ [array de productos]
         ▼
┌─────────────────┐
│  Express Server │
│  res.json(...)  │
└────────┬────────┘
         │
         │ JSON response
         ▼
┌─────────────────┐
│   Angular App   │
│  subscribe(...) │
└─────────────────┘
```

## 📊 ENDPOINTS DISPONIBLES

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | API is running |
| GET | `/health` | Estado del servidor y BD |
| GET | `/api/products` | Lista todos los productos |
| GET | `/api/products/:id` | Obtiene un producto por ID |
| POST | `/api/products` | Crea un nuevo producto |
| PUT | `/api/products/:id` | Actualiza un producto |
| DELETE | `/api/products/:id` | Elimina un producto |

## 🚀 CÓMO INICIAR

### Backend
```bash
cd backend
node diagnostico.js
# O
node server.js
```

### Frontend
```bash
cd frontend
npm start
```

## 🔍 VERIFICACIÓN

### 1. Verificar Backend
```powershell
# Health check
Invoke-RestMethod http://localhost:3000/health

# Productos
Invoke-RestMethod http://localhost:3000/api/products
```

### 2. Verificar Frontend
1. Abrir `http://localhost:4200`
2. Abrir consola del navegador (F12)
3. Ir a la página de productos
4. Verificar en consola:
   - `Productos cargados: X`
   - O mensajes de error si hay problemas

## ⚠️ PROBLEMAS COMUNES

### Backend no responde
- ✅ Verificar que MongoDB esté corriendo (local) o URL correcta (Atlas)
- ✅ Verificar que el puerto 3000 esté libre
- ✅ Revisar mensajes en la consola del backend

### Frontend no muestra productos
- ✅ Verificar que el backend esté corriendo
- ✅ Abrir consola del navegador (F12) para ver errores
- ✅ Verificar errores de CORS
- ✅ Verificar que la URL sea `http://localhost:3000/api`

### Error de CORS
- ✅ Verificar que `http://localhost:4200` esté en la lista de origins permitidos
- ✅ Verificar que el header `Origin` se esté enviando

## 📝 LOGS ÚTILES

### Backend
- `✅ Conectado exitosamente a MongoDB`
- `🚀 Server running on 3000`
- `📥 PETICIÓN RECIBIDA: GET /api/products`

### Frontend (Consola del navegador)
- `Productos cargados: X`
- `Error al cargar productos: ...`
- `No se pudo conectar con el servidor`

