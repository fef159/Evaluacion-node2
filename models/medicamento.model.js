const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Medicamento = sequelize.define('Medicamento', {
  CodMedicamento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descripcionMed: DataTypes.STRING,
  stock: DataTypes.INTEGER,
  precioVentaUni: DataTypes.DECIMAL
}, {
  tableName: 'Medicamento',
  timestamps: false
});

module.exports = Medicamento;