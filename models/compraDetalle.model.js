const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CompraDetalle = sequelize.define('CompraDetalle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  compraId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  medicamentoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  precioTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'CompraDetalle',
  timestamps: false
});

module.exports = CompraDetalle;
