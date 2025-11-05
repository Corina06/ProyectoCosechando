export const environment = {
  production: true,
  // IMPORTANTE: Como backend y frontend están en el mismo servicio, usar ruta relativa
  // O usar la URL completa del servicio en Render
  apiUrl: '/api' // Ruta relativa - funciona si frontend y backend están en el mismo dominio
  // Si prefieres usar URL absoluta, descomenta la siguiente línea y comenta la de arriba:
  // apiUrl: 'https://tu-servicio.onrender.com/api'
};