import { Bot, MessageType } from "../types";
import { io } from "../app";

const bots: Bot = {
  example: {
    prefixes: ['@'],
    commands: {
      hello: (msgData) => io.emit('Message', {author:'🤖 Bot Example', msg:` Olá ${msgData.author}, Olá mundo!`,   timestamp: new Date().toISOString(), role: 'bot'} as MessageType),
      goodbye: (msgData) => io.emit('Message', {author:'🤖 Bot Example', msg:` Thau ${msgData.author}, Thau mundo!`, timestamp: new Date().toISOString(), role: 'bot' } as MessageType),
    },
  },
  another: {
    prefixes: ['.'],
    commands: {
      ola: (msgData) => io.emit('Message', {author:'🐦 Saudações Bot', msg:` Olá ${msgData.author}, Olá mundo!`,   timestamp: new Date().toISOString(), role: 'bot'} as MessageType),
      thau: (msgData) => io.emit('Message', {author:'🐦 Saudações Bot', msg:` Thau ${msgData.author}, Thau mundo!`, timestamp: new Date().toISOString(), role: 'bot' } as MessageType),
    },
  },
};

export default bots