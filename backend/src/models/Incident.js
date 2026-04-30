const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');

const Incident = sequelize.define('Incident', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  component_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED'),
    defaultValue: 'OPEN'
  },
  severity: {
    type: DataTypes.ENUM('P0', 'P1', 'P2'),
    defaultValue: 'P2'
  },
  start_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  end_time: {
    type: DataTypes.DATE
  },
  mttr: {
    type: DataTypes.INTEGER
  }
});

module.exports = { Incident };