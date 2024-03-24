const {models} = require('../db');
const {bot} = require("../bot");
const {adminBot} = require("../admin_bot");
const getClaim = require("../utils/claim");
const {SEMINAR} = require("../db/models/constants");

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

    let currentClient = await models.Client?.findByPk(userId);
    let currentChat = await models.Chat?.findByPk(userId);
    let currentEvent = await models.Event.findByPk(Number(currentEventId));
    if (!currentClient) {
        currentClient = await models.Client.create({
            id: userId,
            firstName,
            phoneNumber,
            lastName,
            username,
            allowsToWrite,
            events: JSON.stringify([Number(currentEventId)]),
        })
    } else {
        currentClient.events = JSON.stringify([...JSON.parse(currentClient.dataValues.events), Number(currentEventId)])
        await currentClient.update({events: currentClient.events});
    }

    await bot.sendMessage(userId, 'Вы успешно оставили заявку. С Вами свяжутся в ближайшее время');

    const currentRecord = await models.Record.create({
        clientId: currentClient.id,
        connectionType: connectionType,
        chatId: currentChat.id,
        eventId: currentEvent.id,
        type: SEMINAR,
    })
    await adminBot.sendMessage(
        ADMIN_USER_ID, getClaim(
            currentEvent.name,
            currentEvent.id,
            currentClient.firstName,
            currentClient.lastName,
            currentClient.phoneNumber,
            currentClient.username,
            currentRecord.connectionType,
        )
        , {parse_mode: 'HTML'}
    );

    res.append('Content-Type', 'application/javascript; charset=UTF-8');
    res.append('Connection', 'keep-alive');
    res.sendStatus(200).end();
}