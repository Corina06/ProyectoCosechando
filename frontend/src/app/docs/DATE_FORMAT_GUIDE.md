# Guía de Formato de Fechas - dd/mm/aaaa

Este proyecto utiliza el formato de fecha **dd/mm/aaaa** de manera consistente en toda la aplicación.

## Servicios y Utilidades

### DateUtilsService

Servicio que proporciona métodos para manejar fechas:

```typescript
import { DateUtilsService } from '../services/date-utils.service';

constructor(private dateUtils: DateUtilsService) {}

// Convertir fecha de input HTML (yyyy-mm-dd) a formato de visualización (dd/mm/aaaa)
const fechaDisplay = this.dateUtils.formatToDisplayDate('2024-10-31'); // '31/10/2024'

// Convertir fecha de visualización (dd/mm/aaaa) a formato de input HTML (yyyy-mm-dd)
const fechaInput = this.dateUtils.formatToInputDate('31/10/2024'); // '2024-10-31'

// Obtener fecha actual en formato dd/mm/aaaa
const fechaActual = this.dateUtils.getCurrentDate(); // '31/10/2024'

// Obtener fecha actual para input HTML
const fechaInputActual = this.dateUtils.getCurrentInputDate(); // '2024-10-31'

// Validar fecha
const esValida = this.dateUtils.isValidDate('31/10/2024'); // true
```

### DateFormatPipe

Pipe para formatear fechas en templates:

```typescript
// En el componente
import { DateFormatPipe } from '../pipes/date-format.pipe';

@Component({
  imports: [DateFormatPipe]
})
```

```html
<!-- En el template -->
{{ fecha | dateFormat }} <!-- Muestra en formato dd/mm/aaaa -->
{{ fecha | dateFormat:'input' }} <!-- Convierte a formato yyyy-mm-dd para inputs -->
```

## Modelos

### Compra Model
```typescript
export interface Compra {
  fecha: string; // Formato dd/mm/aaaa
  // ... otros campos
}
```

### Order Model
```typescript
export interface Order {
  date: string; // Formato dd/mm/aaaa
  // ... otros campos
}
```

## Ejemplo de Uso en Componentes

### Para formularios con inputs de fecha:

```typescript
export class MiComponente {
  miFormulario = {
    fecha: '', // Para mostrar en formato dd/mm/aaaa
    fechaInput: '' // Para el input HTML (yyyy-mm-dd)
  };

  constructor(private dateUtils: DateUtilsService) {}

  ngOnInit() {
    // Inicializar con fecha actual
    this.miFormulario.fechaInput = this.dateUtils.getCurrentInputDate();
  }

  guardar() {
    // Convertir fecha del input a formato de visualización antes de guardar
    const fechaFormateada = this.dateUtils.formatToDisplayDate(this.miFormulario.fechaInput);
    
    const datos = {
      fecha: fechaFormateada, // Se guarda en formato dd/mm/aaaa
      // ... otros datos
    };
  }
}
```

```html
<!-- En el template -->
<input type="date" [(ngModel)]="miFormulario.fechaInput" />
```

### Para mostrar fechas:

```html
<!-- Directamente si ya está en formato dd/mm/aaaa -->
<td>{{ compra.fecha }}</td>

<!-- Con pipe si necesitas conversión -->
<td>{{ fecha | dateFormat }}</td>
```

## Configuración Global

La aplicación está configurada con localización en español:

```typescript
// app.config.ts
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    // ... otros providers
  ],
};
```

## Reglas Importantes

1. **Almacenamiento**: Todas las fechas se almacenan en formato `dd/mm/aaaa` como string
2. **Inputs HTML**: Los inputs de tipo `date` requieren formato `yyyy-mm-dd`
3. **Visualización**: Siempre mostrar fechas en formato `dd/mm/aaaa`
4. **Conversión**: Usar `DateUtilsService` para convertir entre formatos
5. **Validación**: Usar `DateUtilsService.isValidDate()` para validar fechas

## Migración de Código Existente

Si tienes código que usa `Date` objects:

```typescript
// Antes
fecha: new Date('2024-10-31')

// Después
fecha: '31/10/2024'
```

```html
<!-- Antes -->
{{ fecha | date: 'dd/MM/yyyy' }}

<!-- Después -->
{{ fecha }}
```