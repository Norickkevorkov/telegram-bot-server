const {sequelize, DataTypes} = require('../connection');

module.exports = sequelize.define('Client', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
    },
},{
    initialAutoIncrement: 1
}).sync()