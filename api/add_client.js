const {models} = require('../db');
const {bot} = require("../bot");
const {adminBot} = require("../admin_bot");

const {ADMIN_USER_ID} = process.env;

module.exports = async (req, res) => {
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

    await models.Client.sync({force: true})

    let currentClient = await models.Client?.findByPk(userId);
    let currentChat = await models.Chat?.findByPk(userId);
    let currentEvent = await models.Event.findByPk(currentEventId);
    if (!currentClient) {
        currentClient = await models.Client.create({
            id: userId,
            firstName,
            phoneNumber,
            lastName,
            username,
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
        connectionType: connectionType,
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
}