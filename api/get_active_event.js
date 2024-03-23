const {models} = require('../db');
module.exports = async (req, res) => {
    const activeEvent = await models.Event?.findOne({where: {status: 'ACTIVE'}});
    if (activeEvent){
        res.json({name:activeEvent.name, id: activeEvent.id})
    }
}