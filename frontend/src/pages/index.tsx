import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import socket from "./utils/socket";
import { AiOutlineSend } from "react-icons/ai"
import { IoIosSettings } from 'react-icons/io'
import MarkdownIt from 'markdown-it';
const md = new MarkdownIt();


interface MessageType {
  author: string;
  msg: string;
  timestamp: string;
  role: 'user' | 'administrator' | 'bot';
  room: string;
}

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [list, setList] = useState<MessageType[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [room, setRoom] = useState<string>()
  const historyDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
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
      socket.emit("newMessage", { author: username, msg: message, timestamp: time, role: 'user' } as MessageType);
      setMessage("")
    }
  };
  socket.on("Message", (msgData: MessageType) => {
    setList([...list, msgData]);
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
          <div>
            <div className="flex">
              <div className="w-28 h-screen bg-custom-nav text-white">
                <ul className="p-4">
                  <li className="transition duration-500 ease-in-out transform hover:-translate-y-2 bg-gray-600 rounded-md hover:rounded-lg h-16 mt-4">
                    <a href="#" className="flex items-center justify-center h-full">
                      <span>Público 1</span>
                    </a>
                  </li>
                  <li className="transition duration-500 ease-in-out transform hover:-translate-y-2 bg-gray-600 rounded-md hover:rounded-lg h-16 mt-4">
                    <a href="#" className="flex items-center justify-center h-full">
                      <span>Item 2</span>
                    </a>
                  </li>
                  <li className="transition duration-500 ease-in-out transform hover:-translate-y-2 bg-gray-600 rounded-md hover:rounded-lg h-16 mt-4">
                    <a href="#" className="flex items-center justify-center h-full">
                      <span>Item 3</span>
                    </a>
                  </li>
                  <li className="transition duration-500 ease-in-out transform hover:-translate-y-2 bg-gray-600 rounded-md hover:rounded-lg h-16 mt-4">
                    <a href="#" className="flex items-center justify-center h-full">
                      <span className="text-4xl pb-2">+</span>
                    </a>
                  </li>
                </ul>

              </div>
              {/* Chat Container */}
              <div className="w-full h-scree">
                <div className="bg-neutral-800/1 h-10 text-white pt-3 pl-5 border-b-2 border-stone-800">
                  <span>🟢 # Chat Público 1 </span><span style={{ float: 'right' }} className="mr-10 text-2xl text-gray-400"><IoIosSettings /></span>
                </div>
                <div className="history-div overflow-y-auto h-screen m-3 mt-5 pb-32" ref={historyDivRef}>
                  {/* System Message Item */}
                  <div className="flex flex-col items-start mb-5">
                    <span className=" text-sm text-white">👋 Chat Público</span>
                    <div className="bg-indigo-500 py-2 px-4 rounded-md max-w-5xl max-w-3/6">
                      <span className="text-white font-medium">Olá bem-vindo {username} 👋, Bem-vindo {username} ao chat {room}, o respeito é fundamental durante as conversas ❗ Caso alguém esteja quebrando as regras, não hesite em chamar um administrador 🛡️</span>
                    </div>
                  </div>
                  <hr className=" border-stone-800" />
                  {/* User Message Item */}
                  {list.map((msg: MessageType, i) => (
                    <div key={i} className={msg.author == username ? 'flex flex-col items-end mr-5' : 'flex flex-col items-start'}>
                      <span className=" text-sm mt-1 text-gray-400">{msg.author} º {i} {msg.role == "bot" ? <span className="">Bot</span> : ''}</span>
                      <div className={msg.author == username ? ' bg-gray-300 py-2 px-4 rounded-md max-w-5xl max-w-3/6 break-words' : msg.role == 'administrator' ? 'bg-amber-500 py-2 px-4 rounded-md max-w-5xl max-w-3/6 break-words' : msg.role == 'bot' ? ' bg-teal-500 py-2 px-4 rounded-md max-w-5xl max-w-3/6 break-words' : 'bg-indigo-600 py-2 px-4 rounded-md max-w-5xl max-w-3/6 break-words'}>
                        <div dangerouslySetInnerHTML={{ __html: md.render(msg.msg) }}></div>
                      </div>
                      <span className="text-gray-400 text-sm mt-1">{msg.timestamp}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-5">
                  <div className=" w-8/12 h-12 bottom-0 rounded-full fixed mb-5">
                    <input onKeyDown={(e) => {
                      if (e.keyCode == 16 || e.keyCode == 13) {setMessage(message + '\n') } if (e.keyCode == 13) { handlePost() }
                    }} type="text" placeholder="Sua mensagem..." className="text-white pl-5 w-full min-h-full h-auto rounded-full bg-slate-700 border-2 border-gray-700 focus:text-white focus:border-teal-500" value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button className="absolute w-16 pt-1 ml-2 rounded-full text-indigo-500 text-4xl text-center" onClick={handlePost}><AiOutlineSend className="ml-4 text-center" /></button>
                  </div>
                </div>
              </div>
              {/* All Users Div */}
              <div className=" w-1/12 h-screen bg-custom-nav text-white">
                <ul className="p-4">
                  Olá
                </ul>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
