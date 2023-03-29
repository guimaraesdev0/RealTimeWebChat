import { Bot, MessageType } from "../types";
import { io } from "../app";

const bots: Bot = {
  System: {
    prefixes: ['!'],
    commands: {
      stats: (msgData) => io.emit('Message', { author: '🤖 System', msg: ` Olá ${msgData.author}.`, timestamp: new Date().toISOString(), role: 'bot' } as MessageType),
      goodbye: (msgData) => io.emit('Message', { author: '🤖 Bot Example', msg: ` Thau ${msgData.author}, Thau mundo!`, timestamp: new Date().toISOString(), role: 'bot' } as MessageType),
    },
  },
  Tunai: {
    prefixes: ['+'],
    commands:{
      roletar: (msgData) => {
        const personagens = [
          {
            nome: "Enzo 🗿🍷",
            level: "888",
            descricao: "O Enzo é um garoto especial para momentos especiais, a sua fofura chama atenção nos lugares, uns dos bordões mais famosos dele é: 'Sou cria' e 'Sigma' ",
          },
          {
            nome: "Antonio",
            level: "15",
            descricao: "Antonio tem o poder passado de sua antiga tribo, onde ele os traiu em troca de sabedoria e poder do C#",
          },
          {
            nome: "Ezekiel",
            level: "69",
            descricao: "Ezekiel Dev, após largar o comando especiais da marinha, decidiu seguir a carreira como programador mobile",
          }
        ];
        const randomIndex = Math.floor(Math.random() * personagens.length);
        const randomPersonagem = personagens[randomIndex];
        io.emit('Message', { author: '🎲 Tunai', msg: `Você roletou o: ${randomPersonagem.nome} \n nível ${randomPersonagem.level}. \n ${randomPersonagem.descricao} \n *Requisitado por: ${msgData.author}*`, timestamp: new Date().toISOString(), role: 'bot' } as MessageType);
      },
    }
  },
  another: {
    prefixes: ['+'],
    commands: {
      ola: (msgData) => io.emit('Message', { author: '🐦 Saudações Bot', msg: ` Olá ${msgData.author}, Olá mundo!`, timestamp: new Date().toISOString(), role: 'bot' } as MessageType),
      thau: (msgData) => io.emit('Message', { author: '🐦 Saudações Bot', msg: ` Thau ${msgData.author}, Thau mundo!`, timestamp: new Date().toISOString(), role: 'bot' } as MessageType),
    },
  },
};




export default bots