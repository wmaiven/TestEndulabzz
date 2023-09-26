const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const bodyParser = require('body-parser');
const Api = require('./Api/ApiController');

const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', Api);

const server = http.createServer(app);

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('Nova conexão WebSocket');

  ws.on('message', (message) => {
    console.log(`Mensagem recebida: ${message}`);

    ws.send('Mensagem recebida pelo servidor');
  });

  ws.on('close', () => {
    console.log('Conexão fechada');
  });
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});


app.listen(8080, () => {
    console.log("app rodando porta 8080");
})