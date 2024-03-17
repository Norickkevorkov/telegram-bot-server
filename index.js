const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const TelegramApi = require('node-telegram-bot-api');
const path = require('path');
const {sequelize} = require('./storage/connection');
const Client = require('./storage/models/Client');
const Chat = require('./storage/models/Chat');

const token = '7157931114:AAGi-kmgi1DpYe7psnJms5WeNbliCTG0gKs';
const webAppURL = 'https://saros-bot.ru/'
const bot = new TelegramApi(token, {polling: true})

const PORT = 8000;
const app = express();



bot.on('message', async msg => {
    const text = msg.text;
    console.log(msg);
    const chatId = msg.chat.id;
    const currentChat = await sequelize.models.Chat.findOne({where: {id: chatId}});
    if(!currentChat){
        await sequelize.models.Chat.create({
            id: chatId,
            firstName: msg.from.first_name,
            lastName: msg.from.last_name,
            username: msg.from.username,
            messages: [msg.text],
        })
        await bot.sendMessage(chatId, 'Добро пожаловать!');
    } else {
        await currentChat.update(messages, [...currentChat.dataValues.messages, msg.text]);
    }
    if(text === '/start'){
        await bot.sendMessage(chatId, `Заполните форму по кнопке ниже`, {reply_markup: {
            inline_keyboard:[[{text: "Заполни форму", web_app: {url: webAppURL}}]]
        }} )
    }
    if(text === '/info'){
        await bot.sendMessage(chatId, `Your name is ${msg.chat.username}`)
    }
    bot
    if(text === '/message'){
        await bot.sendPhoto(chatId, `./assets/photo_2024-03-12_16-40-08.jpg`,{caption: '4242'})
    } 
})

app.use(cors({
    origin: '*',
    credentials: true,
}))

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello world');
})

app.post('/api/add_client/', (req, res) => {
    console.log(req.body);
    return res;
});

app.listen(PORT, async () => {
    console.log(`Example app listening on port ${PORT}`)
    try {
        await sequelize.authenticate();
        console.log((await sequelize.models.Client.create({firstName: 'Vasya', lastName: 'Pupkin'})));
        console.log('Connection has been established successfully.');
        
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})
