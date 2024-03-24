const {SET_PHOTO, DONE} = require("../db/models/constants");
const {event, getAdminPerms} = require('./index');
module.exports = (adminBot) => async (data) => {
    await getAdminPerms(adminBot, data.from.id, async() => {
        if (event.currentEvent?.status === SET_PHOTO){
            event.currentEvent.photo = data.photo[0].file_id;
            event.currentEvent.status = DONE;
            await event.currentEvent.save();
        }
    })
}