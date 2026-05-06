const Usuario = require('./usuario.model');
const Medicamento = require('./medicamento.model');
const Venta = require('./venta.model');
const Compra = require('./compra.model');
const CompraDetalle = require('./compraDetalle.model');
const Laboratorio = require('./laboratorio.model');

// Asociaciones de ventas
Usuario.hasMany(Venta, { foreignKey: 'usuarioId' });
Venta.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Medicamento.hasMany(Venta, { foreignKey: 'medicamentoId' });
Venta.belongsTo(Medicamento, { foreignKey: 'medicamentoId' });

// Asociaciones de compras
Laboratorio.hasMany(Compra, { foreignKey: 'laboratorioId' });
Compra.belongsTo(Laboratorio, { foreignKey: 'laboratorioId' });

Compra.hasMany(CompraDetalle, { foreignKey: 'compraId' });
CompraDetalle.belongsTo(Compra, { foreignKey: 'compraId' });

Medicamento.hasMany(CompraDetalle, { foreignKey: 'medicamentoId' });
CompraDetalle.belongsTo(Medicamento, { foreignKey: 'medicamentoId' });

module.exports = { Usuario, Medicamento, Venta, Compra, CompraDetalle, Laboratorio };