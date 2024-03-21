const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
    dialect: process.env.DIALECT,
    storage: process.env.DATABASE_PATH,
});
module.exports.sequelize = sequelize;
module.exports.DataTypes = DataTypes;