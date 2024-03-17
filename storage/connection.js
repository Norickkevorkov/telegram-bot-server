const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './storage/database.sqlite'
});
module.exports.sequelize = sequelize;
module.exports.DataTypes = DataTypes;