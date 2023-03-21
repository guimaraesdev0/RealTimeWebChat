import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import socket from "./utils/socket";

interface MessageType {
  author: string;
  msg: string;
}

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [list, setList] = useState<MessageType[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    if (username.trim() !== "") {
      localStorage.setItem("username", username.trim());
      setLoggedIn(true);
    }
  };

  const handlePost = () => {
    socket.emit("newMessage", { author: username, msg: message });
  };

  socket.on("Message", (msgData: MessageType) => {
    setList([...list, msgData]);
  });

  return (
    <div>
      <nav className="sticky top-0 z-10 bg-custom-nav ">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <span className="text-2xl text-white font-extrabold">☄️ WebChat</span>
            <div className="flex space-x-4 font-semibold text-white underline decoration-blue-500">
              <a href="#">Source Code</a>
            </div>
          </div>
        </div>
      </nav>


      {
        !loggedIn ? (
          <div className="flex justify-center ">

            <div className="main-div mt-40 w-6/12 h-80 bg-custom-nav rounded-xl">
              <h1 className="text-3xl text-center font-semibold pt-6 mb-6 text-white">Chat Online!</h1>
              <input type="text" value={username} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-gray-900
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500
    "

                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nome de usuário"
              />
              <div className="flex justify-btween">
                <button className="mt-5 bg-blue-600 text-white rounded w-36 h-10" onClick={handleLogin}>Entrar</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-screen">
            {/* Sidebar with chat rooms */}
            <div className="flex flex-col w-1/4 bg-gray-800 text-white">
              <div className="px-4 py-2 bg-gray-900">
                <h1 className="text-2xl font-bold">WebChat</h1>
              </div>
              <div className="px-4 py-2">
                <h2 className="text-lg font-semibold">Salas de Bate-papo</h2>
                <div className="mt-2">
                    <div>
                      <span>Chat Publico 1</span>
                    </div>
                </div>
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 bg-gray-100">
              <div className="px-4 py-2 bg-gray-200">
                <h2 className="text-lg font-semibold">Chat Publico 1</h2>
              </div>
              <div className="flex flex-col-reverse min-h-screen p-4 overflow-y-scroll">
                {/* Chat messages */}
                <div className="flex flex-col gap-2 mt-4">
                  {/* Message item */}
                  <div className="flex flex-col items-start">
                    <div className="bg-blue-500 py-2 px-4 rounded-md">
                      <span className="font-semibold text-white">John Doe</span>
                      <span className="text-white ml-2">Hello world!</span>
                    </div>
                    <span className="text-gray-400 text-sm mt-1">9:30 AM</span>
                  </div>
                  {/* Message item */}
                  <div className="flex flex-col items-end">
                    <div className="bg-gray-300 py-2 px-4 rounded-md">
                      <span className="font-semibold text-gray-800">Jane Doe</span>
                      <span className="text-gray-800 ml-2">Hey there!</span>
                    </div>
                    <span className="text-gray-400 text-sm mt-1">9:32 AM</span>
                  </div>
                  {/* Message item */}
                  <div className="flex flex-col items-start">
                    <div className="bg-blue-500 py-2 px-4 rounded-md">
                      <span className="font-semibold text-white">John Doe</span>
                      <span className="text-white ml-2">How are you?</span>
                    </div>
                    <span className="text-gray-400 text-sm mt-1">9:35 AM</span>
                  </div>
                </div>

                {/* Chat input */}
                <div className="flex justify-between items-center mt-4">
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-400 mr-2"
                    placeholder="Digite sua mensagem aqui..."
                  />
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>

        )
      }
    </div >
  );
}
