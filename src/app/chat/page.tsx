"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "other";
  senderName: string;
  timestamp: Date;
}

interface OnlineUser {
  id: string;
  username: string;
  avatar: string;
  status: "online" | "away";
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>()
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // WebSocket 会自动携带 Cookie 中的 Authorization 头
    // 后端可以从请求头中获取 Authorization 来验证 token
    const websocket = new WebSocket(`ws://localhost:9966/chat`);

    websocket.onopen = () => {
      console.log("WebSocket连接已打开");
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        
      } catch (error) {
        console.log("收到消息:", event.data);
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket连接已关闭");
      setWs(null);
    };

    // 组件卸载时关闭WebSocket连接
    return () => {
      websocket.close();
    };
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ws || !inputMessage.trim()) return;

    const messageData = {
      type: "message",
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    // 发送消息到服务器
    ws.send(JSON.stringify(messageData));
    
    // 清空输入框
    setInputMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex h-screen max-h-screen">
      {/* 左侧聊天区域 */}
      <div className="flex-1 flex flex-col">
        <div className="bg-blue-600 p-4 text-white flex items-center">
          <h1 className="text-xl font-bold">聊天室</h1>
          <span className="ml-auto text-sm">
            在线用户: {onlineUsers?.length || 0}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              暂无消息，开始聊天吧！
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white shadow"
                    }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === "other" && (
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <img
                          src="/avatar.jpg"
                          alt="头像"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      {message.sender === "other" && (
                        <div className="text-xs text-gray-500 mb-1">
                          {message.senderName}
                        </div>
                      )}
                      <div className="mb-1">{message.content}</div>
                      <div
                        className={`text-xs ${message.sender === "user"
                            ? "text-blue-100"
                            : "text-gray-400"
                          }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                    {message.sender === "user" && (
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <img
                          src="/wakaba.jpg"
                          alt="我的头像"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="输入消息..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!ws || !inputMessage.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              发送
            </button>
          </div>
        </form>
      </div>

      {/* 右侧在线用户列表 */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">在线用户</h2>
          <p className="text-sm text-gray-500">
            {onlineUsers?.length || 0} 人在线
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {onlineUsers?.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              暂无在线用户
            </div>
          ) : (
            <div className="p-2">
              {onlineUsers?.map((user) => (
                <div>{user}</div>
              ))}
            </div>
          )}
        </div>

        {/* 用户操作区域 */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
              <img
                src="/wakaba.jpg"
                alt="我的头像"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-sm">我</div>
              <div className="text-xs text-green-600">在线</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
