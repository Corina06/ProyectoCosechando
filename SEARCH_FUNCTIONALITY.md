# Funcionalidad de Búsqueda - Cosechando

## Descripción
Se ha implementado una funcionalidad completa de búsqueda que permite a los usuarios encontrar productos por nombre, descripción o categoría.

## Componentes Implementados

### 1. SearchService (`src/app/services/search.service.ts`)
- Servicio centralizado para manejar el estado de búsqueda
- Utiliza BehaviorSubject para comunicación reactiva entre componentes
- Métodos principales:
  - `setSearchTerm(term: string)`: Establece el término de búsqueda
  - `getSearchTerm()`: Obtiene el término actual
  - `clearSearch()`: Limpia la búsqueda

### 2. NavComponent Actualizado
- Input de búsqueda conectado con ngModel
- Búsqueda en tiempo real mientras el usuario escribe
- Búsqueda al presionar Enter o hacer clic en el botón
- Botón para limpiar búsqueda (aparece cuando hay texto)
- Navegación automática a la página de productos

### 3. ProductoComponent Actualizado
- Filtrado de productos por término de búsqueda
- Búsqueda en nombre, descripción y categoría
- Información de resultados de búsqueda
- Mensaje cuando no hay resultados
- Paginación que se adapta a los resultados filtrados

## Características de la Búsqueda

### Búsqueda por Acción
- Los resultados se muestran solo cuando el usuario hace clic en la lupa o presiona Enter
- No hay búsqueda automática mientras se escribe

### Búsqueda Inteligente
- Busca en múltiples campos: nombre, descripción, categoría
- No distingue entre mayúsculas y minúsculas
- Funciona con búsquedas parciales

### Integración con Filtros
- La búsqueda funciona junto con los filtros de categoría
- Se puede buscar dentro de una categoría específica
- Los filtros se mantienen al realizar búsquedas

### Experiencia de Usuario
- Indicador visual del término de búsqueda actual
- Contador de resultados encontrados
- Campo de búsqueda limpio sin botones adicionales
- Mensaje informativo cuando no hay resultados
- Paginación adaptativa

## Estilos CSS
- Estilos responsivos para diferentes tamaños de pantalla
- Botones con efectos hover
- Indicadores visuales claros
- Diseño consistente con el tema de la aplicación

## Uso
1. El usuario escribe en el campo de búsqueda en la navegación
2. Hace clic en la lupa o presiona Enter para ejecutar la búsqueda
3. Los resultados se muestran con información del término buscado
4. Si no está en la página de productos, se navega automáticamente
5. Puede combinar búsqueda con filtros de categoría
6. Puede limpiar la búsqueda borrando el texto manualmente o con el botón "Limpiar búsqueda" en los resultados