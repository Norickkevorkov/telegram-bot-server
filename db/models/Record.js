const { DataTypes } = require('sequelize');
const {SEMINAR} = require('./constants');
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