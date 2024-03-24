const {ADMIN_USER_ID} = process.env;
const getAdminPerms =  async (adminBot, chatId, cb) => {
    if (chatId === Number(ADMIN_USER_ID)) {
        await cb()
    } else {
        await adminBot.sendMessage(chatId, 'Недостаточно прав');
    }
}

const event= {};
const setCurrentEvent = (currentEvent) => {
    event.currentEvent = currentEvent;
}

module.exports.setCurrentEvent = setCurrentEvent;
module.exports.event = event;
module.exports.getAdminPerms = getAdminPerms;