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
            const actionData = (eventType) => {
                switch (eventType) {
                    case 'CREATED':
                        return {text: 'Введите имя', callback_data: 'set_name'};
                    default:
                        return {text: 'Создать семинар', callback_data: 'create_event'};
                }
            }
            const eventType = currentEvent?.status;
            await adminBot.sendMessage(ADMIN_USER_ID, 'Welcome', {
                reply_markup: {
                    inline_keyboard: [[actionData(eventType)]]
                }
            });
        })
    });

    adminBot.on('callback_query', async query => {
        console.log(query);
        await getAdminPerms(query.from.id, async () => {
            switch (query.data){
                case 'create_event': {
                    await adminBot.sendMessage(query.from.id, '42')
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
            }
        })
    });
}
module.exports.adminBot = adminBot;
