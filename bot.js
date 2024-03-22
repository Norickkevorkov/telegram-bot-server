const TelegramApi = require("node-telegram-bot-api");
const {models} = require("./db");

const {
    TELEGRAM_API_TOKEN,
    WEB_APP_URL
} = process.env;

const bot = new TelegramApi(TELEGRAM_API_TOKEN, {polling: true})
module.exports.bot = bot;
module.exports.startBot = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        console.log(msg);
        const chatId = msg.chat.id;
        await models.Chat.sync({force: true});
        const currentChat = await models.Chat?.findByPk(chatId);
        if(!currentChat){
            await models.Chat.create({
                id: chatId,
                firstName: msg.from.first_name,
                lastName: msg.from.last_name,
                username: msg.from.username,
                messages: JSON.stringify([msg.text]),
            })
            await bot.sendMessage(chatId, 'Добро пожаловать!');
        } else {
            currentChat.messages = JSON.stringify([...JSON.parse(currentChat.dataValues.messages), msg.text])
            await currentChat.update({messages: currentChat.messages});
        }
        if(text === '/start'){
            await bot.sendMessage(chatId, `Заполните форму по кнопке ниже`, {reply_markup: {
                    inline_keyboard:[[{text: "Заполни форму", web_app: {url: WEB_APP_URL}}]]
                }} )
        }
        if(text === '/info'){
            await bot.sendMessage(chatId, `Your name is ${msg.chat.username}`)
        }
        if(text === '/message'){
            await bot.sendPhoto(chatId, `./assets/photo_2024-03-12_16-40-08.jpg`,{caption: '4242'})
        }
    })

}