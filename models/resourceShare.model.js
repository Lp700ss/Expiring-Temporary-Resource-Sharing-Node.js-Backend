const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Resource = require('./resource.model');
const User = require('./user.model');

const SharedResource = sequelize.define('SharedResource', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    resource_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: Resource, key: 'id' },
    },
    shared_with_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: User, key: 'id' },
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

SharedResource.belongsTo(Resource, { foreignKey: 'resource_id', onDelete: 'CASCADE' });
SharedResource.belongsTo(User, { foreignKey: 'shared_with_user_id', onDelete: 'CASCADE' });

module.exports = SharedResource;
