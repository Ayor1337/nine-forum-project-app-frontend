import request from "@/api/request";
import { UpOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ChatBoardMessage from "./ChatBoardMessage";
import { Client, IMessage } from "@stomp/stompjs";
import useApp from "antd/es/app/useApp";

interface defineProps {
  topicId: string;
}
export default function ChatBoard({ topicId }: defineProps) {
  const [isHover, setHover] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [client, setClient] = useState<Client | null>(null);
  const [userMessages, setUserMessages] = useState<UserMessage[]>([]);
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const chatboardRef = useRef<HTMLDivElement>(null);
  const { message } = useApp();

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    if (inputValue == null) {
      setHover(false);
    }
    if (inputValue.length < 1) {
      setHover(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !inputValue.trim()) {
      return;
    }
    await request
      .post("/api/chat/send", {
        content: inputValue.trim(),
        topicId: topicId,
      })
      .then((res) => {
        if (res.data.code != 200) {
          message.warning(res.data.message);
        }
      });

    setInputValue("");
  };

  const addUserMessages = async (message: ChatboardHistory) => {
    let userInfo: UserInfo | undefined;

    if (message) {
      try {
        userInfo = await fetchUserinfo(message.accountId);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    }

    if (userInfo) {
      setUserMessages((prevMessages) => [
        ...prevMessages,
        { userInfo: userInfo!, message },
      ]);
    }
  };

  const fetchUserinfo = async (
    accountId: number
  ): Promise<UserInfo | undefined> => {
    try {
      const res = await request.get(`/api/user/info/by_user_id`, {
        params: {
          user_id: accountId,
        },
      });

      if (res.data.code === 200) {
        return res.data.data;
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }

    return undefined;
  };

  const fetchMessages = async () => {
    await request
      .get("/api/chat/info/history", {
        params: {
          topic_id: topicId,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          res.data.data.map((data: ChatboardHistory) => {
            addUserMessages(data);
          });
        }
      });
  };

  const handleExpand = () => {
    if (isExpanded) {
      setExpanded(false);
    } else {
      setExpanded(true);
      if (chatboardRef.current) {
        chatboardRef.current.scrollTo({
          top: chatboardRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    const client = new Client({
      brokerURL: `ws://${process.env.NEXT_PUBLIC_WS_URL}/chatboard`,
      reconnectDelay: 2000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setClient(client);
        client.subscribe(`/broadcast/topic/${topicId}`, (message: IMessage) => {
          console.log(message);
          addUserMessages(JSON.parse(message.body));
        });
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (chatboardRef.current) {
      chatboardRef.current.scrollTo({
        top: chatboardRef.current.scrollHeight,
      });
    }
  }, []);

  return (
    <div className="rounded-xl border border-black/5 bg-white shadow-sm hover:shadow-md transition p-3">
      <AnimatePresence initial={false}>
        <div className="pl-1 py-2 text-lg">聊天板</div>
        <motion.div
          key="chatboard"
          className="relative"
          animate={{
            height: isExpanded ? "240px" : "30px",
            pointerEvents: isExpanded ? "auto" : "none",
          }}
          onClick={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="h-full rounded-xl bg-neutral-100 py-2"
            ref={chatboardRef}
            style={{ overflowY: isExpanded ? "auto" : "hidden" }}
          >
            <div className="flex flex-col gap-3">
              {userMessages.map((message, index) => (
                <ChatBoardMessage
                  userMessage={message}
                  disabled={!isExpanded}
                  key={index}
                />
              ))}
            </div>
          </div>
          <AnimatePresence initial={false}>
            <div className="absolute h-full w-full top-0 overflow-hidden pointer-events-none">
              <motion.div
                key="input"
                animate={{
                  bottom: isHover ? "15px" : "-30px",
                  opacity: isHover ? 1 : 0,
                }}
                className="absolute left-1/2 -translate-x-1/2 z-10"
              >
                <input
                  className="bg-slate-300 rounded-full text-neutral-50 py-1 px-3 outline-none pointer-events-auto"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage(e);
                    }
                  }}
                />
                <button
                  className="bg-blue-500 rounded-full size-7 ml-1 text-white pointer-events-auto"
                  onClick={handleSendMessage}
                >
                  <UpOutlined />
                </button>
              </motion.div>
              <motion.div
                key="mask"
                animate={{ opacity: isHover ? 100 : 0 }}
                className="absolute bottom-0 bg-gradient-to-t from-slate-300/30 to-transparent w-full h-15 pointer-events-none z-9"
              />
            </div>
          </AnimatePresence>
        </motion.div>
        <motion.div
          key="expandIcon"
          className="absolute text-neutral-500 cursor-pointer transition left-1/2 bottom-4 -translate-x-1/2 z-6"
          animate={{ opacity: isExpanded ? (isHover ? 0 : 0.35) : 1 }}
          onClick={() => handleExpand()}
        >
          {isExpanded ? "收起" : "展开"}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
