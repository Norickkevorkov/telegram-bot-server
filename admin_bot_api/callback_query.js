const {models} = require("../db");

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
                    type: 'offline',
                    description: '',
                    address: '',
                    eventDate: '',
                    status: 'CREATED',
                })
                break;
            }
            case 'get_records_from_active_event': {
                await adminBot.sendMessage(ADMIN_USER_ID, 'Список заявок по активному мероприятию:')
                await models.Record.sync({force: true});
                const activeEvent = await models.Event.findOne({where:{status: 'ACTIVE'}});
                console.log(activeEvent);
                const allRecords = await models.Record.findAll({where:{eventId: activeEvent.id}})
                if (allRecords.length) {
                    await adminBot.sendMessage(ADMIN_USER_ID, 'Заявок по активному мероприятию нет');
                } else {
                    allRecords.map(async record => {
                        const userId = await models.Client.findOne()
                        await adminBot.sendMessage(
                            ADMIN_USER_ID,
                            `<b>Заявка на мероприятие ${currentEvent}:</b>
    - ID: ${userId},
    - Имя клиента: ${firstName} ${lastName},
    - Телефон: ${phoneNumber},
    - Сcылка в телеграм: <a href="https://t.me/${username}">${username}</a>,
    - Предпочтительный тип связи: ${connectionType}.
`, {parse_mode: 'HTML'}
                        );
                    })
                }
                break;
            }
            case 'offline_type': {
                currentEvent.type = 'offline';
                currentEvent.status = 'SET_ADDRESS';
                await currentEvent.save();
                await adminBot.sendMessage(ADMIN_USER_ID, 'Введите адрес мероприятия:')
                break;
            }
            case 'online_type': {
                currentEvent.type = 'online';
                currentEvent.status = 'SET_ADDRESS';
                await currentEvent.save();
                await adminBot.sendMessage(ADMIN_USER_ID, 'Введите адрес мероприятия:')
                break;
            }
            case 'event_is_active': {
                const allEvents = await models.Event.findAll();
                for (const event of allEvents) {
                    event.status = 'DONE';
                    await event.save();
                }
                currentEvent.status = 'ACTIVE';
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