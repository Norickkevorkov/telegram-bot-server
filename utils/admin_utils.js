const adminBot = new TelegramApi(adminToken, {polling: true});
const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

module.exports = function (chatId, cb){
    if(chatId === Number(ADMIN_USER_ID)){
        cb()
    } else {
        adminBot.sendMessage(chatId, 'Недостаточно прав');
    }
};
