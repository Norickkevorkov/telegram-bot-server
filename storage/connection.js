const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize('postgres://postgres:gopass4242@192.168.0.5:5432/sarosdb');
module.exports.sequelize = sequelize;
module.exports.DataTypes = DataTypes;