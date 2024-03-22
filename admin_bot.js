const TelegramApi = require("node-telegram-bot-api");
const {models} = require('./db');

const {ADMIN_TELEGRAM_API_TOKEN, ADMIN_USER_ID} = process.env;
const adminBot = new TelegramApi(ADMIN_TELEGRAM_API_TOKEN, {polling: true})

const getAdminPerms =  async (chatId, cb) => {
    if (chatId === Number(ADMIN_USER_ID)) {
        await cb()
    } else {
        await adminBot.sendMessage(chatId, 'Недостаточно прав');
    }
}
let currentEvent;
module.exports.startAdminBot = function startAdminBot() {
    adminBot.on('message', async msg => {
        await getAdminPerms(msg.chat.id, async () => {
            switch (currentEvent?.status) {
                case 'CREATED': {
                    currentEvent.name = msg.text;
                    currentEvent.status = 'SET_DESCRIPTION';
                    await currentEvent.save();
                    await adminBot.sendMessage(ADMIN_USER_ID, 'Введите описание мероприятия');
                    break;
                }
                case 'SET_DESCRIPTION': {
                    currentEvent.description = msg.text;
                    currentEvent.status = 'SET_TYPE';
                    await currentEvent.save();
                    await adminBot.sendMessage(ADMIN_USER_ID, 'Формат встречи:', {
                        reply_markup: {
                            inline_keyboard: [[
                                {text: 'Оффлайн', callback_data: 'offline_type'},
                                {text: 'Онлайн', callback_data: 'online_type'},
                            ]]
                        }
                    })
                    break;
                }
                case 'SET_ADDRESS': {
                    currentEvent.address = msg.text;
                    currentEvent.status = 'SET_DATE';
                    await currentEvent.save();
                    await adminBot.sendMessage(ADMIN_USER_ID, 'Укажите дату и время');
                    break;
                }
                case 'SET_DATE': {
                    currentEvent.eventDate = msg.date;
                    currentEvent.status = 'DONE';
                    await currentEvent.save();
                    await adminBot.sendMessage(ADMIN_USER_ID, 'Сделать мероприятие активным:', {
                        reply_markup: {
                            inline_keyboard: [[
                                {text: 'Да', callback_data: 'event_is_active'},
                                {text: 'Нет', callback_data: 'event_is_not_active'},
                            ]]
                        }
                    })
                    break;
                }
                default: {
                    await adminBot.sendMessage(ADMIN_USER_ID, 'Добро пожаловать', {
                        reply_markup: {
                            inline_keyboard: [[
                                {text: 'Создать семинар', callback_data: 'create_event'},
                                {text: 'Посмотреть список заявок', callback_data: 'get_records_from_active_event'},
                                {text: 'Назначить мероприятие активным (Пока не работает!)', callback_data: 'set_active_event'}
                            ]]
                        }
                    });
                }
            }

        })
    });

    adminBot.on('photo', async (data) => {
        console.log(data);
    })

    adminBot.on('callback_query', async query => {
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
                    const allRecords = await models.Record.findAll({where:{}})
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
    });
}
module.exports.adminBot = adminBot;
