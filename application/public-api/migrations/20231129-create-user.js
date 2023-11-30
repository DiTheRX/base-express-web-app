const {  DataTypes } = require('sequelize');
async function up({ context: queryInterface }) {
    await queryInterface.createTable('Users',{
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
    });
}

async function down({ context: queryInterface }) {
    await queryInterface.dropTable('Users');
}

module.exports = { up, down };