const { Sequelize } = require("sequelize");

const {
    DATABASE_DIALECT,
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_NAME,
} = process.env
const sequelize = new Sequelize(`${DATABASE_DIALECT}://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`, {
    dialect: 'postgres',
});

const modelDefiners = [
    require('./models/Chat'),
    require('./models/Client'),
    require('./models/Event'),
    require('./models/Record')
]

modelDefiners.forEach(definer => definer(sequelize));

module.exports = sequelize;
