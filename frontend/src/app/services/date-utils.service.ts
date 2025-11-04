import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {

  constructor() { }

  /**
   * Convierte una fecha de formato yyyy-mm-dd a dd/mm/aaaa
   * @param dateString Fecha en formato yyyy-mm-dd
   * @returns Fecha en formato dd/mm/aaaa
   */
  formatToDisplayDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  /**
   * Convierte una fecha de formato dd/mm/aaaa a yyyy-mm-dd para inputs HTML
   * @param displayDate Fecha en formato dd/mm/aaaa
   * @returns Fecha en formato yyyy-mm-dd
   */
  formatToInputDate(displayDate: string): string {
    if (!displayDate) return '';
    
    const parts = displayDate.split('/');
    if (parts.length !== 3) return displayDate;
    
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    
    return `${year}-${month}-${day}`;
  }

  /**
   * Obtiene la fecha actual en formato dd/mm/aaaa
   * @returns Fecha actual en formato dd/mm/aaaa
   */
  getCurrentDate(): string {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  /**
   * Obtiene la fecha actual en formato yyyy-mm-dd para inputs HTML
   * @returns Fecha actual en formato yyyy-mm-dd
   */
  getCurrentInputDate(): string {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    
    return `${year}-${month}-${day}`;
  }

  /**
   * Valida si una fecha en formato dd/mm/aaaa es válida
   * @param dateString Fecha en formato dd/mm/aaaa
   * @returns true si la fecha es válida
   */
  isValidDate(dateString: string): boolean {
    if (!dateString) return false;
    
    const parts = dateString.split('/');
    if (parts.length !== 3) return false;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
      return false;
    }
    
    const date = new Date(year, month - 1, day);
    return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
  }
}