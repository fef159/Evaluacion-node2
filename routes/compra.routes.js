const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/compra.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.post('/', auth, role(['ALMACEN', 'ADMIN']), ctrl.createCompra);
router.get('/', auth, role(['ALMACEN', 'ADMIN']), ctrl.getAllCompras);
router.get('/:id', auth, role(['ALMACEN', 'ADMIN']), ctrl.getCompraById);

module.exports = router;
