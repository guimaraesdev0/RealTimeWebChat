import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

interface MessageType {
  author: string;
  msg: string;
  date: string;
  role: "user" | "system";
}

const HistoryChat:MessageType[] = []

app.get('/', (_req, res) => {
  res.send("Olá mundo");
});

io.on('connection', (socket) => {

  socket.on('newMessage', (msgData:MessageType) => {
    io.emit('Message', msgData);
    console.log(`Mensagem recebida e enviada`);
    
  });

  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${socket.id}`);
    
  });
});

server.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});