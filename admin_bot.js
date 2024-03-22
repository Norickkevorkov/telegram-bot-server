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
                default: {
                    await adminBot.sendMessage(ADMIN_USER_ID, 'Добро пожаловать', {
                        reply_markup: {
                            inline_keyboard: [[{text: 'Создать семинар', callback_data: 'create_event'}]]
                        }
                    });
                }
            }

        })
    });

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
                        date: '',
                        status: 'CREATED',
                    })
                    break;
                }
                case 'offline_type': {
                    currentEvent.type = 'offline';
                    currentEvent.status = 'SET_ADDRESS';
                    await currentEvent.save();
                    break;
                }
                case 'online_type': {
                    currentEvent.type = 'online';
                    currentEvent.status = 'SET_ADDRESS';
                    await currentEvent.save();
                }
            }
        })
    });
}
module.exports.adminBot = adminBot;
