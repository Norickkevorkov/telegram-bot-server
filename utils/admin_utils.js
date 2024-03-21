const {ADMIN_USER_ID} = process.env;

module.exports = function (adminBot, chatId, cb){
    if(chatId === Number(ADMIN_USER_ID)){
        cb()
    } else {
        adminBot.sendMessage(chatId, 'Недостаточно прав');
    }
}
