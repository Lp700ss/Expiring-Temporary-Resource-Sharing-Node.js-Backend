const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Resource = sequelize.define('Resource', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  resource_url: { type: DataTypes.STRING, allowNull: false },
  owner_id: { type: DataTypes.UUID, allowNull: false },
  access_token: { type: DataTypes.STRING, allowNull: false },
  expiration_time: { type: DataTypes.DATE, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Resource;
