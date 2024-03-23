const {adminBot} = require('./admin_bot');
const {bot} = require('./bot');
const sequelize = require('./db');
const {models} = sequelize;
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
    app.get('/api/get_active_event', async (req, res) => {
        const activeEvent = await models.Event?.findOne({where: {status: 'ACTIVE'}});
        if (activeEvent){
            res.json({name:activeEvent.name, id: activeEvent.id})
        }
        res.sendStatus(200).end();
    })

    app.post('/api/add_client/', async(req, res) => {
        const {
            userId,
            phoneNumber,
            username,
            firstName,
            lastName,
            allowsToWrite,
            connectionType,
            currentEventId,
        } = req.body;

        await models.Client.sync({force:true})

        let currentClient = await models.Client?.findByPk(userId);
        let currentChat = await models.Chat?.findByPk(userId);
        let currentEvent = await models.Event.findByPk(currentEventId);
        if(!currentClient){
            currentClient = await models.Client.create({
                id: userId,
                firstName,
                phoneNumber,
                lastName,
                username,
                connectionType,
                allowsToWrite,
                events: JSON.stringify([currentEventId]),
            })
        } else {
            currentClient.events = JSON.stringify([...JSON.parse(currentClient.dataValues.events), currentEventId])
            await currentClient.update({events: currentClient.events});
        }

        await bot.sendMessage(userId, 'Вы успешно оставили заявку. С Вами свяжутся в ближайшее время');
        await models.Record.sync({force: true});

        await models.Record.create({
            clientId: currentClient.id,
            chatId: currentChat.id,
            eventId: currentEventId,
        })
        await adminBot.sendMessage(
            ADMIN_USER_ID,
            `<b>Новая заявка на мероприятие ${currentEvent.name}:</b>
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
