// Configuración CORS simple y robusta
const corsConfig = (req, res, next) => {
  // Permitir orígenes específicos
  const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:4201'
  ];
  
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  // Headers CORS necesarios
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    console.log('🔄 Preflight request handled for:', req.path);
    res.status(200).end();
    return;
  }
  
  console.log(`📥 ${req.method} ${req.path} - Origin: ${origin}`);
  next();
};

module.exports = corsConfig;