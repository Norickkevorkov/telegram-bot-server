const sequelize = require('./db');
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const addClientApi = require('./api/add_client');
const getActiveEventApi = require('./api/get_active_event');
const {PORT} = process.env;

const app = express();

module.exports = ()=> {
    app.use(cors({
        origin: '*',
        credentials: true,
    }))

    app.use(bodyParser.json());

    app.post('/api/add_client/', addClientApi);
    app.get('/api/get_active_event', getActiveEventApi);

    app.listen(PORT, async () => {
        console.log(`Example app listening on port ${PORT}`)
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');

        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    })

}
