import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import socket from "./utils/socket";
import { AiOutlineSend } from "react-icons/ai"


interface MessageType {
  author: string;
  msg: string;
  date: string;
}

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [list, setList] = useState<MessageType[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const historyDivRef = useRef<HTMLDivElement | null>(null);



  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedChatHistory = localStorage.getItem('chatHistory');
    if (storedChatHistory) {
      setList(JSON.parse(storedChatHistory));
    }
    if (storedUsername) {
      setUsername(storedUsername);
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (historyDivRef.current) {
      historyDivRef.current.scrollTop = historyDivRef.current.scrollHeight;
    }
  }, [list]);

  const handleLogin = () => {
    if (username.trim() !== "") {
      localStorage.setItem("username", username.trim());
      setLoggedIn(true);
    }
  };

  const handlePost = () => {
    function addZero(i: string | number) {
      if (i < 10) { i = "0" + i }
      return i;
    }
    if (message.length > 500 || message == "") {
      return
    } else {
      const d = new Date();
      let day = (d.getUTCDay())
      let month = (d.getUTCMonth())
      let year = (d.getUTCFullYear())
      let h = addZero(d.getHours());
      let m = addZero(d.getMinutes());
      let s = addZero(d.getSeconds());
      let time = h + ":" + m + ":" + s + " " + day + "/" + month + "/" + year;
      socket.emit("newMessage", { author: username, msg: message, date: time });
      setMessage("")
    }
  };

  socket.on("Message", (msgData: MessageType) => {
    setList([...list, msgData]);
    localStorage.setItem('chatHistory', JSON.stringify([...list, msgData]));
  });

  return (
    <div className="overflow-hidden">
      {
        !loggedIn ? (
          <div className="flex justify-center overflow-hidden">

            <div className="main-div mt-40 w-6/12 h-80 bg-custom-nav rounded-xl">
              <h1 className="text-3xl text-center font-semibold pt-6 mb-6 text-white">Chat Online!</h1>
              <input type="text" value={username} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400"
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nome de usuário"
              />
              <div className="flex justify-btween">
                <button className="mt-5 bg-blue-600 text-white rounded w-36 h-10" onClick={handleLogin}>Entrar</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-4">
            <div className="history-div pl-5 pt-5 overflow-y-auto pr-5 h-screen pb-20" ref={historyDivRef}>
              {/* System Message Item */}
              <div className="flex flex-col items-start mb-5">
                <span className=" text-sm text-white">🤖Sistema</span>
                <div className="bg-indigo-500 py-2 px-4 rounded-md max-w-5xl max-w-3/6">
                  <span className="text-white font-medium">Olá bem-vindo {username} 👋, apenas seu nome será salva nos cookies do seu navegador 🍪, além do nome nenhum informação como IP'S histórico ou dados do navegador será salvo 🔒</span>
                </div>
              </div>
              {/* User Message Item */}
              {list.map((msg: MessageType, i) => (
                <div key={i} className={msg.author == username ? 'flex flex-col items-end ' : 'flex flex-col items-start'}>
                  <span className=" text-sm mt-1 text-gray-400">{msg.author} º {i}</span>
                  <div className={msg.author == username ? ' bg-gray-300 py-2 px-4 rounded-md max-w-5xl max-w-3/6 break-words' : 'bg-gradient-to-r from-indigo-500 to-indigo-700 py-2 px-4 rounded-md max-w-5xl max-w-3/6 break-words'}>
                    <span className={msg.author == username ? 'text-black' : 'text-white'}>{msg.msg} </span>
                  </div>
                  <span className="text-gray-400 text-sm mt-1">{msg.date}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-5">
              <div className=" w-5/12 h-12 bottom-0 rounded-full fixed mb-5">
                <input type="text" placeholder="Sua mensagem..." className="text-white pl-5 w-full h-full rounded-full bg-slate-700 border-2 border-gray-700 focus:text-white focus:border-teal-500" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button className="absolute w-16 pt-1 ml-2 rounded-md text-indigo-500 text-4xl text-center" onClick={handlePost}><AiOutlineSend /></button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
