// Servidor simple para servir la aplicación Angular en producción
const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos desde la carpeta dist
const distPath = path.join(__dirname, 'dist', 'cosechando', 'browser');
app.use(express.static(distPath));

// Todas las rutas van al index.html (para Angular Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});






