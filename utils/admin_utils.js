const {adminBot} = require('../index');

const {ADMIN_USER_ID} = process.env;

module.exports = function (chatId, cb){
    if(chatId === Number(ADMIN_USER_ID)){
        cb()
    } else {
        adminBot.sendMessage(chatId, 'Недостаточно прав');
    }
}
