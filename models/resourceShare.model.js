const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import Sequelize instance

// sharedResource.model.js
module.exports = (sequelize, DataTypes) => {
    const SharedResource = sequelize.define('SharedResource', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      resource_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shared_with_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expiration_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  
    // Add associations after model definition
    SharedResource.associate = (models) => {
      SharedResource.belongsTo(models.Resource, { foreignKey: 'resource_id' }); // Belongs to Resource
      SharedResource.belongsTo(models.User, { foreignKey: 'shared_with_user_id' }); // Belongs to User (who the resource is shared with)
    };
  
    return SharedResource;
  };
  