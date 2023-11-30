const {  DataTypes } = require('sequelize');

const Model = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        },
        defaultValue: 0
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
    }
}
module.exports = Model