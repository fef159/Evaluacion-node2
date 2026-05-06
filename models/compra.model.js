const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Compra = sequelize.define('Compra', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  laboratorioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  estado: {
    type: DataTypes.ENUM('completada', 'cancelada'),
    defaultValue: 'completada'
  }
}, {
  tableName: 'Compra',
  timestamps: false
});

module.exports = Compra;
