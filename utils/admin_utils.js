const TelegramApi = require('node-telegram-bot-api');
const {ADMIN_USER_ID, ADMIN_TELEGRAM_API_TOKEN} = process.env;

const adminBot = new TelegramApi(ADMIN_TELEGRAM_API_TOKEN, {polling: true});

module.exports = function (chatId, cb){
    if(chatId === Number(ADMIN_USER_ID)){
        cb()
    } else {
        adminBot.sendMessage(chatId, 'Недостаточно прав');
    }
}
