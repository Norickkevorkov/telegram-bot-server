const {adminBot} = require("../admin_bot");
const {ADMIN_USER_ID} = process.env;
const getAdminPerms =  async (chatId, cb) => {
    if (chatId === Number(ADMIN_USER_ID)) {
        await cb()
    } else {
        console.log(chatId);
        await adminBot.sendMessage(chatId, 'Недостаточно прав');
    }
}

let currentEvent;
const setCurrentEvent = (event) => {
    console.log('=========================')
    console.log(event);
    currentEvent = event;
}

module.exports.setCurrentEvent = setCurrentEvent;
module.exports.currentEvent = currentEvent;
module.exports.getAdminPerms = getAdminPerms;