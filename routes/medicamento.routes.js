const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/medicamento.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.post('/', auth, role(['ADMIN']), ctrl.create);
router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.put('/:id', auth, role(['ADMIN']), ctrl.update);
router.delete('/:id', auth, role(['ADMIN']), ctrl.delete);

module.exports = router;