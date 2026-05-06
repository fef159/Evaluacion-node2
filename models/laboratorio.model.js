const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Laboratorio = sequelize.define('Laboratorio', {
  CodLab: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  razonSocial: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  contacto: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'laboratorio',
  timestamps: false,
  freezeTableName: true
});

module.exports = Laboratorio;
