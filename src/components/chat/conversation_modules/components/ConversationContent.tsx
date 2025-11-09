import service from "@/axios";
import { getToken } from "@/axios/Authorization";
import { getImageUrl } from "@/axios/ImageService";
import { useAuth } from "@/components/AuthProvider";
import { Client, IMessage } from "@stomp/stompjs";
import useApp from "antd/es/app/useApp";
import { use, useEffect, useRef, useState } from "react";
import "./scroll.css";

interface defineProps {
  conversationId: number;
}

export default function ConversationContent({ conversationId }: defineProps) {
  const [content, setContent] = useState<string>("");
  const [conversationMessages, setConversationMessages] = useState<
    Array<ConversationMessage>
  >([]);
  const [client, setClient] = useState<Client | null>(null);
  const { message } = useApp();
  const { currentUser } = useAuth();
  const conversationBox = useRef<HTMLDivElement>(null);

  const isSender = (accoundId: number) => {
    if (currentUser) {
      return currentUser.accountId == accoundId;
    }
  };

  const sendMessage = async () => {
    if (content.trim() == "") {
      return;
    }
    if (conversationId == null || conversationId == 0) {
      return;
    }
    await service
      .post("/api/conversation/send", {
        conversationId: conversationId,
        content: content,
      })
      .then((res) => {
        if (res.data.code == 200) {
          setContent("");
        } else {
          message.warning(res.data.message);
        }
      });
  };

  const addConversationMessages = async (message: ConversationMessage) => {
    if (message) {
      setConversationMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  const fetchConversationHistory = async (id: number) => {
    await service
      .get("/api/conversation/message/list", {
        params: {
          conversationId: id,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          setConversationMessages(res.data.data);
        } else {
          console.log(res.data.message);
        }
      });
  };

  useEffect(() => {
    const client = new Client({
      brokerURL: `ws://${process.env.NEXT_PUBLIC_WS_URL}/chat`,
      connectHeaders: {
        Authorization: `Bearer ${getToken()}`,
      },
      reconnectDelay: 2000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (str) => console.log("[STOMP]", str),
      onConnect: () => {
        setClient(client);
        client.subscribe(
          `/user/transfer/conversation/${conversationId}`,
          (message: IMessage) => {
            addConversationMessages(JSON.parse(message.body));
          }
        );
      },
      onStompError: (error) => {
        message.error("连接出现异常, 请刷新重新连接");
        client.deactivate();
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [conversationId]);

  useEffect(() => {
    fetchConversationHistory(conversationId);
  }, [conversationId]);

  useEffect(() => {
    if (conversationBox.current) {
      conversationBox.current.scrollTop = conversationBox.current.scrollHeight;
    }
  }, [fetchConversationHistory]);

  return (
    <div className="max-h-full">
      <div
        className="flex flex-col overflow-y-scroll h-120 scroller pr-1"
        ref={conversationBox}
      >
        {conversationMessages &&
          conversationMessages.map((message, index) => (
            <>
              {isSender(message.accountId) ? (
                <>
                  <div
                    className={
                      "flex items-center self-end" +
                      (index > 0 &&
                      conversationMessages[index - 1].accountId !=
                        message.accountId
                        ? " mt-2"
                        : "")
                    }
                    key={message.conversationMessageId}
                  >
                    <div className="mr-3 ml-13 px-4 py-2 bg-slate-400 text-white rounded-2xl">
                      {message.content}
                    </div>
                    {index > 0 &&
                    conversationMessages[index - 1].avatarUrl ==
                      message.avatarUrl ? (
                      <div className="size-10 flex-shrink-0" />
                    ) : (
                      <div>
                        <img
                          src={getImageUrl(message.avatarUrl)}
                          className="size-10 rounded-full flex-shrink-0"
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={
                      "flex items-center" +
                      (index > 0 &&
                      conversationMessages[index - 1].accountId !=
                        message.accountId
                        ? " mt-2"
                        : "")
                    }
                    key={message.conversationMessageId}
                  >
                    {index > 0 &&
                    conversationMessages[index - 1].avatarUrl ==
                      message.avatarUrl ? (
                      <div className="size-10 flex-shrink-0" />
                    ) : (
                      <div>
                        <img
                          src={getImageUrl(message.avatarUrl)}
                          className="size-10 rounded-full flex-shrink-0"
                        />
                      </div>
                    )}
                    <div className="ml-3 mr-13 px-4 py-2 bg-slate-400 text-white rounded-2xl">
                      {message.content}
                    </div>
                  </div>
                </>
              )}
            </>
          ))}
      </div>
      <div className="flex-1/5 relative bg-slate-400 rounded-xl mt-1">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="想说些什么呢 ?"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={5}
            className="size-full text-[15px] text-white resize-none outline-none px-3 py-4 "
          />
        </div>
        <div className="px-3 py-3 flex justify-end">
          <div
            className="w-18 h-8 bg-blue-500 text-white rounded-xl flex justify-center items-center cursor-pointer hover:bg-blue-600 transition"
            onClick={sendMessage}
          >
            发送
          </div>
        </div>
      </div>
    </div>
  );
}
