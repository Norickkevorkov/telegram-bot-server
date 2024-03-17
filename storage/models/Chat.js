const { sequelize, DataTypes } = require('../connection');

module.exports = sequelize.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    messages: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
}).sync();