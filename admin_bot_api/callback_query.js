const {event, getAdminPerms, setCurrentEvent} = require('./index');
const {models} = require("../db");
const setActiveEvent = require('./queries/set_active_event')
const getClaim = require('../utils/claim');
const {
    OFFLINE,
    CREATED,
    ACTIVE,
    SET_ADDRESS,
    ONLINE,
    DONE
} = require("../db/models/constants");

const {ADMIN_USER_ID} = process.env;
module.exports = (adminBot) => async query => {
    await getAdminPerms(adminBot, query.from.id, async () => {
        switch (query.data){
            case 'create_event': {
                event.currentEvent = {};
                await adminBot.sendMessage(ADMIN_USER_ID, 'Введите имя');

                event.currentEvent = await models.Event.create({
                    name: '',
                    type: OFFLINE,
                    description: '',
                    address: '',
                    eventDate: '',
                    status: CREATED,
                });
                break;
            }
            case 'get_records_from_active_event': {
                await adminBot.sendMessage(ADMIN_USER_ID, 'Список заявок по активному мероприятию:')
                const activeEvent = await models.Event.findOne({where:{status: ACTIVE}});
                const allRecords = await models.Record.findAll({where:{eventId: activeEvent.id}})
                if (!allRecords.length) {
                    await adminBot.sendMessage(ADMIN_USER_ID, 'Заявок по активному мероприятию нет');
                } else {
                    allRecords.map(async record => {
                        const currentClient = await models.Client.findByPk(record.clientId);
                        await adminBot.sendMessage(
                            ADMIN_USER_ID, getClaim(
                                activeEvent.name,
                                currentClient.id,
                                currentClient.firstName,
                                currentClient.lastName,
                                currentClient.phoneNumber,
                                currentClient.username,
                                record.connectionType,
                            )
                            , {parse_mode: 'HTML'}
                        );
                    })
                }
                break;
            }
            case 'offline_type': {
                event.currentEvent.type = OFFLINE;
                event.currentEvent.status = SET_ADDRESS;
                await event.currentEvent.save();
                await adminBot.sendMessage(ADMIN_USER_ID, 'Введите адрес мероприятия:')
                break;
            }
            case 'online_type': {
                event.currentEvent.type = ONLINE;
                event.currentEvent.status = SET_ADDRESS;
                await event.currentEvent.save();
                await adminBot.sendMessage(ADMIN_USER_ID, 'Введите адрес мероприятия:')
                break;
            }
            case 'event_is_active': {
                await setActiveEvent(event.currentEvent)
                await adminBot.sendMessage(ADMIN_USER_ID, 'Мероприятие стало активным!');
                break;
            }
            case 'event_is_not_active': {
                await adminBot.sendMessage(ADMIN_USER_ID, 'Мероприятие неактивно! Можете сделать активным, выбрав в главном меню пункт "Сделать мероприятие активным"');
                break;
            }
            case 'set_active_event': {
                const events = await models.Event.findAll({where: {status: DONE}});
                event.activeEvent = true;
                if (events.length) {
                    let html = `Введите номер мероприятия \n \n`;
                    events.sort((a,b) => a.id - b.id).forEach(event => {
                        html+=`${event.id} - ${event.name} \n`
                    })
                    await adminBot.sendMessage(ADMIN_USER_ID, html);
                } else {
                    await adminBot.sendMessage(ADMIN_USER_ID, 'Нет подходящих мероприятий');
                }

            }
        }
    })
}

