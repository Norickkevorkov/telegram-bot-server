const TelegramApi = require("node-telegram-bot-api");

const {ADMIN_TELEGRAM_API_TOKEN, ADMIN_USER_ID} = process.env;
const adminBot = new TelegramApi(ADMIN_TELEGRAM_API_TOKEN, {polling: true})

function getAdminPerms(chatId, cb) {
    if (chatId === Number(ADMIN_USER_ID)) {
        cb()
    } else {
        adminBot.sendMessage(chatId, 'Недостаточно прав');
    }
}

module.exports.startAdminBot = function startAdminBot() {
    adminBot.on('message', async msg => {
        getAdminPerms(msg.chat.id, () => {
            adminBot.sendMessage(ADMIN_USER_ID, 'Welcome', {
                reply_markup: {
                    inline_keyboard: [[{text: 'Создать семинар', callback_data: 'create_event'}]]
                }
            });
        })
    });

    adminBot.on('callback_query', query => {
        console.log(query);
        // getAdminPerms(msg.from.id, async () => {
        //     console.log(msg);
        //     if (msg.data === 'create_event') {
        //         await adminBot.sendMessage(msg.from.id, '42')
        //     }
        // })
    })
}
module.exports.adminBot = adminBot;