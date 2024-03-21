const {adminBot} = require('../index');

module.exports = function (chatId, cb){
    if(chatId === Number(ADMIN_USER_ID)){
        cb()
    } else {
        adminBot.sendMessage(chatId, 'Недостаточно прав');
    }
}
