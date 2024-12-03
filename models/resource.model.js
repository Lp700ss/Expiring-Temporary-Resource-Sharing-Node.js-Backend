const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');

const Resource = sequelize.define(
  'Resource',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: {
      type: DataTypes.UUID, // Ensure it matches User.id
      allowNull: false,
    },
    resource_url: { type: DataTypes.TEXT, allowNull: false },
    access_token: { type: DataTypes.STRING, allowNull: false, unique: true },
    expiration_time: { type: DataTypes.DATE, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM('active', 'expired'), defaultValue: 'active' },
  },
  {
    timestamps: false, // Disable default timestamps
  }
);

Resource.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = Resource;
