/* Import Modules */
import { Bot, MessageType } from './types';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import yargs from 'yargs';
import bots from './bots';
/* Config Modules */
const app = express();
const server = http.createServer(app);
const io = new Server(server);


/* Default Route */
app.get('/', (_req, res) => {
  res.send("Hello World!");
});


/* Socket.io Connection */
io.on('connection', (socket) => {

  /* New Message */

  socket.on('newMessage', (msgData: MessageType) => {

    const { author, msg } = msgData;

    for (const botName in bots) {
      const bot = bots[botName];
      const prefixes = bot.prefixes;

      for (const prefix of prefixes) {
        if (msg.startsWith(prefix)) {
          const commandName = msg.slice(prefix.length).split(" ")[0];
          const commandArgs = msg.slice(prefix.length + commandName.length + 1);
          const commands = bot.commands;

          if (commandName in commands) {
            commands[commandName]({
              author,
              msg: commandArgs,
              timestamp: new Date().toISOString(),
              role: "bot",
            });
            return;
          }
        }
      }
    }

    io.emit('Message', msgData);

  });

  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});

export { io }