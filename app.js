const {adminBot} = require('./admin_bot');
const {bot} = require('./bot');
const {sequelize} = require('./storage/connection');
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const {PORT, ADMIN_USER_ID} = process.env;
const app = express();

module.exports = ()  => {
    app.use(cors({
        origin: '*',
        credentials: true,
    }))

    app.use(bodyParser.json());

    app.post('/api/add_client/', async(req, res) => {
        const {
            userId,
            phoneNumber,
            username,
            firstName,
            lastName,
            allowsToWrite,
            connectionType,
            currentEvent,
        } = req.body;

        const currentClient = await sequelize.models.Client.findOne({where: {id: userId}});

        if(!currentClient){
            await sequelize.models.Client.create({
                id: userId,
                firstName,
                phoneNumber,
                lastName,
                username,
                connectionType,
                allowsToWrite,
                events: JSON.stringify([currentEvent]),
            })
        } else {
            currentClient.events = JSON.stringify([...JSON.parse(currentClient.dataValues.events), currentEvent])
            await currentClient.update({events: currentClient.events});
        }

        await bot.sendMessage(userId, 'Вы успешно оставили заявку. С Вами свяжутся в ближайшее время');
        await adminBot.sendMessage(
            ADMIN_USER_ID,
            `<b>Новая заявка на мероприятие ${currentEvent}:</b>
    - ID: ${userId},
    - Имя клиента: ${firstName} ${lastName},
    - Телефон: ${phoneNumber},
    - Сcылка в телеграм: <a href="https://t.me/${username}">${username}</a>,
    - Предпочтительный тип связи: ${connectionType}.
`, {parse_mode: 'HTML'}
        );

        res.append('Content-Type', 'application/javascript; charset=UTF-8');
        res.append('Connection', 'keep-alive');
        res.sendStatus(200).end();
    });

    app.listen(PORT, async () => {
        console.log(`Example app listening on port ${PORT}`)
        try {
            await sequelize.authenticate();
            // console.log((await sequelize.models.Client.create({firstName: 'Vasya', lastName: 'Pupkin'})));
            console.log('Connection has been established successfully.');

        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    })

}
