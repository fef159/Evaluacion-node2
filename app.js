const express = require('express');
const sequelize = require('./config/db');
require('dotenv').config();

const app = express();
app.use(express.json());

// rutas
app.use('/api/ventas', require('./routes/venta.routes'));
app.use('/api/medicamentos', require('./routes/medicamento.routes'));
app.use('/api/compras', require('./routes/compra.routes'));
app.use('/api/auth', require('./routes/auth.routes'));

// Error handler global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a MySQL');

    return sequelize.sync();
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('🚀 Servidor corriendo en puerto ' + process.env.PORT);
    });
  })
  .catch(err => console.error('❌ Error al conectar:', err));