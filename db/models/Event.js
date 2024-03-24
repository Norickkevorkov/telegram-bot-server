const { DataTypes } = require('sequelize');
const {
    OFFLINE,
    ONLINE,
    CREATED,
    SET_NAME,
    SET_TYPE,
    SET_DESCRIPTION,
    SET_ADDRESS,
    SET_PHOTO,
    SET_DATE,
    ACTIVE,
    DONE,
} = require('./constants');
module.exports = (sequelize) => {
    sequelize.define('Event', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            autoIncrementIdentity: true
        },
        name: {
            type: DataTypes.STRING,
            allowFalse: false,
        },
        description: {
            type: DataTypes.STRING,
            allowFalse: false,
        },
        type: {
            type: DataTypes.ENUM(ONLINE, OFFLINE),
            allowFalse: false,
        },
        address: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.STRING
        },
        photo: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM(
                CREATED,
                SET_NAME,
                SET_TYPE,
                SET_DESCRIPTION,
                SET_ADDRESS,
                SET_PHOTO,
                SET_DATE,
                ACTIVE,
                DONE,
            )
        }
    }).sync();
}