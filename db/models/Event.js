const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Event', {
        id: {
            type: DataTypes.INTEGER,
            allowFalse: false,
            primaryKey: true,
            autoIncrement: true,
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
            type: DataTypes.ENUM(['online', 'offline']),
            allowFalse: false,
        },
        address: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM([
                'CREATED',
                'SET_NAME',
                'SET_TYPE',
                'SET_DESCRIPTION',
                'SET_ADDRESS',
                'SET_DATE',
                'ACTIVE',
                'DONE',
            ])
        }
    })
}