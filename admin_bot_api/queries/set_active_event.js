const {models} = require("../../db");
const {ACTIVE, DONE} = require("../../db/models/constants");
const setActiveEvent = async(currentEvent) =>{
    const allEvents = await models.Event.findAll({where: {status: ACTIVE}});
    for (const event of allEvents) {
        event.status = DONE;
        await event.save();
    }
    currentEvent.status = ACTIVE;
    await currentEvent.save();
}

module.exports = setActiveEvent