const { DataTypes } = require('sequelize');
const {SEMINAR, WHATSAPP, TELEGRAM, PHONE} = require('./constants');
module.exports = (sequelize) => {
    sequelize.define('Record', {
        id: {
            type: DataTypes.INTEGER,
            allowFalse: false,
            primaryKey: true,
            autoIncrement: true,
        },
        type: {
            type: DataTypes.ENUM(SEMINAR),
        },
        connectionType: {
            type: DataTypes.ENUM(WHATSAPP, TELEGRAM, PHONE),
        },
        clientId: {
            type: DataTypes.INTEGER,
            allowFalse: false,
        },
        chatId: {
            type: DataTypes.INTEGER,
            allowFalse: false,
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowFalse: false
        }
    })
}