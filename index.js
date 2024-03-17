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
    console.log(currentChat);
    if(!currentChat){
        await sequelize.models.Chat.create({
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

app.post('/api/add_client/', async(req, res) => {
    const {
        userId,
        phoneNumber,
        username,
        firstName,
        lastName,
        allowsToWrite,
        connectionType,
        currentEvent,
    } = req.body;

    const currentClient = await sequelize.models.Client.findOne({where: {id: userId}});

    if(!currentClient){
        sequelize.models.Client.create({
            id: userId,
            firstName,
            phoneNumber,
            lastName,
            username,
            connectionType,
            allowsToWrite,
            events: JSON.stringify([currentEvent]),
        })
    } else {
        currentClient.events = JSON.stringify([...JSON.parse(currentClient.dataValues.events), currentEvent])
        await currentClient.update({events: currentClient.events});
    }


    res.append('Content-Type', 'application/javascript; charset=UTF-8');
    res.append('Connection', 'keep-alive');
    res.sendStatus(200).end();
});

app.listen(PORT, async () => {
    console.log(`Example app listening on port ${PORT}`)
    try {
        await sequelize.authenticate();
        // console.log((await sequelize.models.Client.create({firstName: 'Vasya', lastName: 'Pupkin'})));
        console.log('Connection has been established successfully.');
        
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})
