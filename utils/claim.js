module.exports = (
    currentEventName,
    userId,
    firstName,
    lastName,
    phoneNumber,
    username,
    connectionType,
) => `<b>Заявка на мероприятие ${currentEventName}:</b>
    - ID: ${userId},
    - Имя клиента: ${firstName} ${lastName},
    - Телефон: ${phoneNumber},
    - Сcылка в телеграм: <a href="https://t.me/${username}">${username}</a>,
    - Предпочтительный тип связи: ${connectionType}.
`