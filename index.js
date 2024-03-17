const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const TelegramApi = require('node-telegram-bot-api');
const path = require('path')
const token = '7157931114:AAGi-kmgi1DpYe7psnJms5WeNbliCTG0gKs';
const webAppURL = 'https://saros-bot.online/'
const bot = new TelegramApi(token, {polling: true})

const PORT = 8000;
const app = express();

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if(text === '/start'){
        await bot.sendMessage(chatId, `Заполните форму по кнопке ниже`, {reply_markup: {
            inline_keyboard:[[{text: "Заполни форму", web_app: {url: webAppURL}}]]
        }} )
    } 
    if(text === '/info'){
        await bot.sendMessage(chatId, `Your name is ${msg.chat.username}`)
    }
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
    return res.send(req.body);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
