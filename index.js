const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const config = require('./config');
const token = config.token, apiUrl = config.apiUrl;

const app = require('express')();

app.use(bodyParser.json());

process.on('unhandledRejection', err => {
    console.log(err);
});

app.get('/', (req, res) => {
    res.send('Está funcionando!');
});

app.post('/webhook', async (req, res) => {
    const data = req.body;

    for (var i in data.messages) {
        const author = data.messages[i].author;
        const body = data.messages[i].body;
        const id = data.messages[i].body;
        const chatId = data.messages[i].chatId;
        const senderName = data.messages[i].senderName;

        if(data.messages[i].fromMe) return;

        if(/Oi/.test(body)) {
            const text = `Olá ${senderName}`;
            await apiWppBot('message', {chatId: chatId, body: text});
        } else if (/teste/.test(body)) {
            await apiWppBot('sendLocation', {lat: 51.178843, lng: -1.826210, address: 'Stonehenge', chatId: chatId})
        }
        res.send('Tudo certo!');
    }
})

app.listen(3333, () => {
    console.log('Listening on port 3333');
});

async function apiWppBot(method, params) {
    const options = {};
    options['method'] = "POST";
    options['body'] = JSON.stringify(params);
    options['headers'] = { 'Content-Type': 'application/json' };

    const url = `${apiUrl}/${method}?token=${token}`;

    const apiResponse = await fetch(url, options);
    const jsonResponse = await apiResponse.json();
    console.log(jsonResponse)
    return jsonResponse;
};