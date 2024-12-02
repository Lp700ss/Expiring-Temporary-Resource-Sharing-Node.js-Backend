const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false, // Disable Sequelize's default timestamps
  }
);

module.exports = User;


sequelize.sync({ alter: true }) // Align the database schema with the updated model
  .then(() => console.log('Database schema updated.'))
  .catch((err) => console.error('Error updating schema:', err));
