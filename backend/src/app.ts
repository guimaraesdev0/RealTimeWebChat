import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

interface MessageType {
    author:string;
    msg:string;
}

app.get('/', (_req, res) => {
  res.send("Olá mundo");
});

io.on('connection', (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  socket.on('newMessage', (msgData:MessageType) => {
    console.log(`Mensagem recebida e enviada`);
    io.emit('Message', msgData);
  });

  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});