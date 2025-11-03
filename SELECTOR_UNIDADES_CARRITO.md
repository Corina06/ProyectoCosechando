# Selector de Unidades en el Carrito

## Nueva Funcionalidad Implementada

Se ha agregado la capacidad de cambiar las unidades de medida directamente en el carrito de compras. Ahora los usuarios pueden:

- Seleccionar diferentes unidades para cada producto en el carrito
- Ver el precio actualizado según la unidad seleccionada
- Mantener la selección de unidad durante todo el proceso de compra

## Ejemplo de Uso

### Antes:
- Producto: Tomate
- Cantidad: 4
- Unidad: Fija (la del producto original)

### Después:
- Producto: Tomate
- Cantidad: 4
- Unidad: **Seleccionable** (unidad, kg, lb, etc.)
- El usuario puede cambiar de "4 unidades" a "4 kg" o "4 lb"

## Archivos Modificados

### 1. Modelo CartItem (`src/app/models/cart-item.model.ts`)
```typescript
export interface CartItem {
    product: Product;
    quantity: number;
    selectedUnit?: string; // NUEVO: Unidad seleccionada por el usuario
}
```

### 2. Servicio del Carrito (`src/app/services/cart.service.ts`)
- **Nuevo método**: `updateCartItem()` - Actualiza un item del carrito
- **Modificado**: `addToCart()` - Inicializa `selectedUnit` con la unidad del producto

### 3. Componente del Carrito (`src/app/pages/cliente/carrito/`)
- **Nuevos métodos**:
  - `getAvailableUnits()` - Retorna lista de unidades disponibles
  - `onUnitChange()` - Maneja el cambio de unidad
  - `getSelectedUnit()` - Obtiene la unidad seleccionada

- **HTML actualizado**:
  - Selector dropdown para cambiar unidades
  - Diseño mejorado con controles organizados verticalmente
  - Resumen visual de cantidad + unidad

### 4. Componente Checkout (`src/app/pages/cliente/checkout/`)
- **Actualizado**: Muestra la unidad seleccionada en el resumen de la orden

### 5. Estilos CSS (`src/app/pages/cliente/carrito/carrito.component.css`)
- Estilos para el selector de unidades
- Diseño responsive para móviles
- Mejor organización visual de los controles

## Unidades Disponibles

| Código | Nombre Completo | Abreviación | Uso Típico |
|--------|----------------|-------------|------------|
| unidad | Unidad | u | Frutas individuales, verduras |
| kilo | Kilogramo | kg | Productos por peso |
| libra | Libra | lb | Carnes, pescados |
| gramo | Gramo | g | Especias, condimentos |
| onza | Onza | oz | Productos pequeños |
| docena | Docena | doc | Huevos, panes |
| paquete | Paquete | paq | Productos empaquetados |
| bolsa | Bolsa | bolsa | Productos en bolsa |
| caja | Caja | caja | Productos en caja |
| litro | Litro | L | Líquidos |
| galon | Galón | gal | Líquidos grandes |

## Flujo de Usuario

1. **Agregar al carrito**: El producto se agrega con su unidad original
2. **En el carrito**: El usuario puede cambiar la unidad usando el dropdown
3. **Cambio de unidad**: Se actualiza automáticamente el resumen visual
4. **Checkout**: Se muestra la unidad seleccionada en el resumen final
5. **Persistencia**: La selección se guarda en localStorage

## Características Técnicas

### Persistencia
- Las unidades seleccionadas se guardan en localStorage
- Se mantienen entre sesiones del navegador
- Se restauran al recargar la página

### Validación
- La unidad seleccionada se valida contra las opciones disponibles
- Si no hay unidad seleccionada, usa la unidad original del producto
- Fallback a "unidad" si no hay datos

### Responsive Design
- Selector optimizado para móviles
- Controles organizados verticalmente
- Tamaños de fuente adaptables

## Beneficios

1. **Flexibilidad**: Los usuarios pueden comprar en la unidad que prefieran
2. **Claridad**: Información más precisa sobre lo que están comprando
3. **Usabilidad**: Interfaz intuitiva y fácil de usar
4. **Consistencia**: La unidad seleccionada se mantiene en todo el proceso

## Próximas Mejoras Sugeridas

1. **Conversión de precios**: Ajustar precios automáticamente según la unidad
2. **Restricciones por producto**: Limitar unidades según el tipo de producto
3. **Unidades personalizadas**: Permitir que comerciantes definan sus propias unidades
4. **Validación de stock**: Verificar disponibilidad según la unidad seleccionada