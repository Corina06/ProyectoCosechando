import { Pipe, PipeTransform } from '@angular/core';
import { DateUtilsService } from '../services/date-utils.service';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  constructor(private dateUtils: DateUtilsService) {}

  transform(value: string | Date, format: 'display' | 'input' = 'display'): string {
    if (!value) return '';
    
    let dateString: string;
    
    // Si es un objeto Date, convertirlo a string
    if (value instanceof Date) {
      const day = value.getDate().toString().padStart(2, '0');
      const month = (value.getMonth() + 1).toString().padStart(2, '0');
      const year = value.getFullYear();
      dateString = `${day}/${month}/${year}`;
    } else {
      dateString = value;
    }
    
    if (format === 'input') {
      return this.dateUtils.formatToInputDate(dateString);
    }
    
    return dateString; // Ya está en formato dd/mm/aaaa
  }
}