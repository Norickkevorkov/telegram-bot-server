const { DataTypes} = require('sequelize');
const {WHATSAPP, TELEGRAM, PHONE} = require('./constants');
module.exports = (sequelize) => {
    sequelize.define('Client', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        username: {
            type: DataTypes.STRING,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        allowsToWrite: {
            type: DataTypes.BOOLEAN,
        },
        events: {
            type: DataTypes.JSON,
        }
    },{
        initialAutoIncrement: 1
    }).sync();
}
