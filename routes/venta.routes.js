const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/venta.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

// Solo VENDEDOR o ADMIN
router.post('/', auth, role(['VENDEDOR', 'ADMIN']), ctrl.vender);

// ADMIN puede ver todas las ventas
router.get('/', auth, role(['ADMIN']), ctrl.getAllVentas);

// Usuario autenticado puede ver sus ventas
router.get('/mis-ventas', auth, ctrl.getMisVentas);

// Cancelar venta (usuario o admin)
router.put('/:id/cancelar', auth, ctrl.cancelarVenta);

module.exports = router;