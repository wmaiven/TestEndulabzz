// Importação das dependências
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const bodyParser = require('body-parser');
const Api = require('./Api/ApiController');

// Inicialização da aplicação Express
const app = express();

// Configuração do middleware para interpretar JSON no corpo das requisições
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Habilitação do CORS para permitir requisições de diferentes origens
app.use(cors());

// Utilização das rotas definidas no ApiController
app.use('/', Api);

// Criação do servidor HTTP
const server = http.createServer(app);

// Criação do servidor WebSocket
const wss = new WebSocket.Server({ noServer: true });

// Evento de conexão para o WebSocket
wss.on('connection', (ws) => {
  console.log('Nova conexão WebSocket');

  // Evento de recebimento de mensagem
  ws.on('message', (message) => {
    console.log(`Mensagem recebida: ${message}`);

    // Envio de mensagem de volta para o cliente WebSocket
    ws.send('Mensagem recebida pelo servidor');
  });

  // Evento de fechamento de conexão
  ws.on('close', () => {
    console.log('Conexão fechada');
  });
});

// Evento de upgrade para suportar WebSockets
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Inicialização do servidor HTTP na porta 8080
server.listen(8080, () => {
  console.log("App rodando na porta 8080");
});
