const {
    CREATED,
    SET_DESCRIPTION,
    SET_TYPE,
    SET_ADDRESS,
    SET_PHOTO,
    SET_DATE,
    DONE
} = require("../db/models/constants");
const {ADMIN_USER_ID} = process.env;

module.exports = (currentEvent, adminBot, getAdminPerms) => async msg => {
    await getAdminPerms(msg.chat.id, async () => {
        switch (currentEvent?.status) {
            case CREATED: {
                currentEvent.name = msg.text;
                currentEvent.status = SET_DESCRIPTION;
                await currentEvent.save();
                await adminBot.sendMessage(ADMIN_USER_ID, 'Введите описание мероприятия');
                break;
            }
            case SET_DESCRIPTION: {
                currentEvent.description = msg.text;
                currentEvent.status = SET_TYPE;
                await currentEvent.save();
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
                currentEvent.address = msg.text;
                currentEvent.status = SET_PHOTO;
                await currentEvent.save();
                await adminBot.sendMessage(ADMIN_USER_ID, 'Укажите дату и время');
                break;
            }
            case SET_DATE: {
                currentEvent.eventDate = msg.date;
                currentEvent.status = DONE;
                await currentEvent.save();
                await adminBot.sendMessage(ADMIN_USER_ID, 'Сделать мероприятие активным:', {
                    reply_markup: {
                        inline_keyboard: [[{text: 'Да', callback_data: 'event_is_active'}, {
                            text: 'Нет',
                            callback_data: 'event_is_not_active'
                        },]]
                    }
                })
                break;
            }
            case SET_PHOTO: {
                await adminBot.sendMessage(ADMIN_USER_ID, 'Загрузи картинку мероприятия!')
                break;
            }
            default: {
                await adminBot.sendMessage(ADMIN_USER_ID, 'Добро пожаловать', {
                    reply_markup: {
                        inline_keyboard: [[{
                            text: 'Создать семинар',
                            callback_data: 'create_event'
                        },], [{text: 'Посмотреть список заявок', callback_data: 'get_records_from_active_event'},], [{
                            text: 'Назначить мероприятие активным (Пока не работает!)',
                            callback_data: 'set_active_event'
                        }]]
                    },
                });
            }
        }
    })
}