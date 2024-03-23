const {SET_PHOTO, SET_DATE} = require("../db/models/constants");
const {currentEvent, getAdminPerms} = require('./index');
module.exports = (adminBot) => async (data) => {
    if (currentEvent?.status === SET_PHOTO){
        currentEvent.photo = data.photo[0].file_id;
        currentEvent.status = SET_DATE;
        await currentEvent.save();
    }
}