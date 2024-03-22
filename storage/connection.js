const { Sequelize, DataTypes } = require("sequelize");
const Chat = require('./models/Chat');
const Client = require('./models/Client');
await Chat;
await Client;
const sequelize = new Sequelize('postgres://postgres:gopass4242@192.168.0.5:5432/sarosdb');
module.exports.sequelize = sequelize;
module.exports.DataTypes = DataTypes;