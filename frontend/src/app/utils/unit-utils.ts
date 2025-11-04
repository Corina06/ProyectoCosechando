/**
 * Utilidades para manejo de unidades de medida
 */

export class UnitUtils {
  
  private static readonly units: { [key: string]: string } = {
    'unidad': 'unidad',
    'libra': 'libra',
    'kilo': 'kilogramo',
    'gramo': 'gramo',
    'onza': 'onza',
    'docena': 'docena',
    'paquete': 'paquete',
    'bolsa': 'bolsa',
    'caja': 'caja',
    'litro': 'litro',
    'galon': 'galón'
  };

  private static readonly abbreviations: { [key: string]: string } = {
    'unidad': 'u',
    'libra': 'lb',
    'kilo': 'kg',
    'gramo': 'g',
    'onza': 'oz',
    'docena': 'doc',
    'paquete': 'paq',
    'bolsa': 'bolsa',
    'caja': 'caja',
    'litro': 'L',
    'galon': 'gal'
  };

  /**
   * Obtiene el nombre completo de una unidad
   * @param unit - Código de la unidad
   * @returns Nombre completo de la unidad
   */
  static getUnitName(unit: string): string {
    return this.units[unit] || unit || 'unidad';
  }

  /**
   * Obtiene la abreviación de una unidad
   * @param unit - Código de la unidad
   * @returns Abreviación de la unidad
   */
  static getUnitAbbreviation(unit: string): string {
    return this.abbreviations[unit] || unit || 'u';
  }

  /**
   * Formatea una cantidad con su unidad
   * @param quantity - Cantidad numérica
   * @param unit - Código de la unidad
   * @param useAbbreviation - Si usar abreviación o nombre completo
   * @returns Texto formateado con cantidad y unidad
   */
  static formatQuantityWithUnit(quantity: number, unit: string, useAbbreviation: boolean = true): string {
    const unitText = useAbbreviation ? this.getUnitAbbreviation(unit) : this.getUnitName(unit);
    return `${quantity} ${unitText}`;
  }

  /**
   * Obtiene todas las unidades disponibles para formularios
   * @returns Array de objetos con value y label para select
   */
  static getAvailableUnits(): { value: string; label: string }[] {
    return [
      { value: 'unidad', label: 'Unidad (c/u)' },
      { value: 'libra', label: 'Libra (lb)' },
      { value: 'kilo', label: 'Kilogramo (kg)' },
      { value: 'gramo', label: 'Gramo (g)' },
      { value: 'onza', label: 'Onza (oz)' },
      { value: 'docena', label: 'Docena (12 unidades)' },
      { value: 'paquete', label: 'Paquete' },
      { value: 'bolsa', label: 'Bolsa' },
      { value: 'caja', label: 'Caja' },
      { value: 'litro', label: 'Litro (L)' },
      { value: 'galon', label: 'Galón' }
    ];
  }
}