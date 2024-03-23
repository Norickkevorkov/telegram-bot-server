const {models} = require("../db");
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
module.exports = (currentEvent, adminBot, getAdminPerms) => async query => {
    console.log(query);
    await getAdminPerms(query.from.id, async () => {
        switch (query.data){
            case 'create_event': {
                await adminBot.sendMessage(ADMIN_USER_ID, 'Введите имя');
                await models.Event?.sync({force: true});
                currentEvent = await models.Event.create({
                    name: '',
                    type: OFFLINE,
                    description: '',
                    address: '',
                    eventDate: '',
                    status: CREATED,
                })
                break;
            }
            case 'get_records_from_active_event': {
                await adminBot.sendMessage(ADMIN_USER_ID, 'Список заявок по активному мероприятию:')
                await models.Record.sync({force: true});
                const activeEvent = await models.Event.findOne({where:{status: ACTIVE}});
                console.log(activeEvent);
                const allRecords = await models.Record.findAll({where:{eventId: activeEvent.id}})
                if (allRecords.length) {
                    await adminBot.sendMessage(ADMIN_USER_ID, 'Заявок по активному мероприятию нет');
                } else {
                    allRecords.map(async record => {
                        const currentClient = await models.Client.findByPk(record.clientId);
                        await adminBot.sendMessage(
                            ADMIN_USER_ID, getClaim(
                                currentEvent.name,
                                currentClient.id,
                                currentClient.firstName,
                                currentClient.lastName,
                                currentClient.phoneNumber,
                                currentClient.username,
                            )
                            , {parse_mode: 'HTML'}
                        );
                    })
                }
                break;
            }
            case 'offline_type': {
                currentEvent.type = OFFLINE;
                currentEvent.status = SET_ADDRESS;
                await currentEvent.save();
                await adminBot.sendMessage(ADMIN_USER_ID, 'Введите адрес мероприятия:')
                break;
            }
            case 'online_type': {
                currentEvent.type = ONLINE;
                currentEvent.status = SET_ADDRESS;
                await currentEvent.save();
                await adminBot.sendMessage(ADMIN_USER_ID, 'Введите адрес мероприятия:')
                break;
            }
            case 'event_is_active': {
                const allEvents = await models.Event.findAll();
                for (const event of allEvents) {
                    event.status = DONE;
                    await event.save();
                }
                currentEvent.status = ACTIVE;
                await currentEvent.save();
                await adminBot.sendMessage(ADMIN_USER_ID, 'Мероприятие стало активным!');
                break;
            }
            case 'event_is_not_active': {
                await adminBot.sendMessage(ADMIN_USER_ID, 'Мероприятие неактивно! Можете сделать активным, выбрав в главном меню пункт "Сделать мероприятие активным"');
                break;
            }
        }
    })
}