const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const VisitorCard = sequelize.define('VisitorCard', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    id_number: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    relationship: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    registered_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'visitorcard',
    timestamps: false
});

module.exports = VisitorCard; 