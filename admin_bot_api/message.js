const {Op} = require('sequelize')
const {event, getAdminPerms} = require('./index');
const {models} = require('../db');
const setActiveEvent = require('./queries/set_active_event');
const {
    CREATED,
    SET_DESCRIPTION,
    SET_TYPE,
    SET_ADDRESS,
    SET_PHOTO,
    SET_DATE,
    DONE, ACTIVE
} = require("../db/models/constants");

const {ADMIN_USER_ID} = process.env;

module.exports = (adminBot) => async msg => {
    await getAdminPerms(adminBot, msg.chat.id, async () => {
        if (msg.text === '/menu') {
            const notCompletedEvents = await models.Event?.findAll({
                where: {
                    [Op.not]: {
                        status: {
                            [Op.or]: [DONE, ACTIVE]
                        }
                    }
                }
            });
            notCompletedEvents.map(async event => {
                await event.destroy();
                await event.save();
            });
            event.currentEvent = {};
            event.activeEvent = false;
        }
        if(event.activeEvent){
            const selectedEvent = await models.Event.findByPk(Number(msg.text));
            if (selectedEvent) {
                await setActiveEvent(selectedEvent);
                await adminBot.sendMessage(ADMIN_USER_ID, `Мероприятие ${selectedEvent.name} стало активным`);
            } else {
                await adminBot.sendMessage(ADMIN_USER_ID, 'Мероприятия с таким ID не существует');
                adminBot.dispatchEvent('set_active_event');
            }
        }
        switch (event.currentEvent?.status) {
            case CREATED: {
                event.currentEvent.name = msg.text;
                event.currentEvent.status = SET_DESCRIPTION;
                await event.currentEvent.save();
                await adminBot.sendMessage(ADMIN_USER_ID, 'Введите описание мероприятия');
                break;
            }
            case SET_DESCRIPTION: {
                event.currentEvent.description = msg.text;
                event.currentEvent.status = SET_TYPE;
                await event.currentEvent.save();
                await adminBot.sendMessage(ADMIN_USER_ID, 'Формат встречи:', {
                    reply_markup: {
                        inline_keyboard: [[{text: 'Оффлайн', callback_data: 'offline_type'}, {
                            text: 'Онлайн',
                            callback_data: 'online_type'
                        },]]
                    }
                })
                break;
            }
            case SET_ADDRESS: {
                event.currentEvent.address = msg.text;
                event.currentEvent.status = SET_DATE;
                await event.currentEvent.save();
                await adminBot.sendMessage(ADMIN_USER_ID, 'Укажите дату и время');
                break;
            }
            case SET_DATE: {
                event.currentEvent.date = msg.text;
                event.currentEvent.status = SET_PHOTO;
                await event.currentEvent.save();
                await adminBot.sendMessage(ADMIN_USER_ID, 'Загрузи картинку мероприятия!')
                break;
            }
            case SET_PHOTO: {
                await adminBot.sendMessage(ADMIN_USER_ID, 'Сделать мероприятие активным:', {
                    reply_markup: {
                        inline_keyboard: [[{
                            text: 'Да',
                            callback_data: 'event_is_active'
                        }, {
                            text: 'Нет',
                            callback_data: 'event_is_not_active'
                        }]]
                    }
                })
                break;
            }
            default: {
                await adminBot.sendMessage(ADMIN_USER_ID, 'Добро пожаловать', {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: 'Создать семинар', callback_data: 'create_event'},],
                            [{text: 'Посмотреть список заявок', callback_data: 'get_records_from_active_event'}],
                            [{text: 'Назначить мероприятие активным', callback_data: 'set_active_event'}]
                        ]
                    },
                });
            }
        }
    })
}