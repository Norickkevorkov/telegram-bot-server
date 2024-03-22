const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define({
        id: {
            type: DataTypes.INTEGER,
            allowFalse: false,
            primaryKey: true,
            autoIncrement: true,
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