const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');
const { Incident } = require('./Incident');

const Rca = sequelize.define('Rca', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  incident_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Incident,
      key: 'id'
    }
  },
  root_cause: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fix: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  prevention: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

Incident.hasOne(Rca, { foreignKey: 'incident_id' });
Rca.belongsTo(Incident, { foreignKey: 'incident_id' });

module.exports = { Rca };