const TelegramApi = require("node-telegram-bot-api");
const messageApi = require('./admin_bot_api/message');
const callbackQueryApi = require('./admin_bot_api/callback_query');
const photoApi = require('./admin_bot_api/photo');
const {ADMIN_TELEGRAM_API_TOKEN} = process.env;
const adminBot = new TelegramApi(ADMIN_TELEGRAM_API_TOKEN, {polling: true})


module.exports.startAdminBot = function startAdminBot() {

    adminBot.on('message', messageApi(currentEvent, adminBot, getAdminPerms));

    adminBot.on('photo', photoApi(currentEvent, adminBot, getAdminPerms));

    adminBot.on('callback_query', callbackQueryApi(currentEvent, adminBot, getAdminPerms));
}
module.exports.adminBot = adminBot;
