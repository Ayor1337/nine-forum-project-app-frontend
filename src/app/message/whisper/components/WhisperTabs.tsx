"use client";

import request from "@/api/request";
import { getToken } from "@/api/utils/auth";
import { getImageUrl } from "@/api/utils/image";
import { CloseOutlined } from "@ant-design/icons";
import { Client, IMessage } from "@stomp/stompjs";
import { usePathname, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function WhisperTabs() {
  const [active, setActive] = useState<number>(0);
  const [conversationList, setConversationList] = useState<Conversation[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const [client, setClient] = useState<Client | null>(null);
  const [chatUnread, setChatUnread] = useState<Array<ChatUnread>>([]);

  const handleSetChatUnread = (unread: ChatUnread) => {
    setChatUnread((prev) => {
      prev.forEach((item) => {
        if (item.conversationId === unread.conversationId) {
          item.unread = unread.unread;
        }
      });
      if (prev.find((item) => item.conversationId === unread.conversationId)) {
        return [...prev];
      }
      return [...prev, unread];
    });
  };

  const getChatunread = (
    conversationId: number,
    fromUserId: number
  ): number => {
    if (chatUnread.length == 0 || chatUnread == null) {
      return 0;
    }
    let chat = chatUnread.find(
      (item) =>
        item.conversationId == conversationId && item.fromUserId == fromUserId
    );
    return chat ? chat.unread : 0;
  };

  const chatUnreadComputed = (
    conversationId: number,
    fromUserId: number
  ): boolean => {
    if (active == conversationId) {
      return false;
    }
    return getChatunread(conversationId, fromUserId) > 0;
  };

  const fetchCoversationList = async () => {
    await request.get("/api/conversation/list").then((res) => {
      if (res.data.code == 200) {
        setConversationList(res.data.data);
      }
    });
  };

  const fetchUnreadList = async () => {
    await request.get("/api/conversation/message/unread").then((res) => {
      if (res.data.code == 200) {
        setChatUnread(res.data.data);
      }
    });
  };

  const readUnread = async (conversationId: number, userId: number) => {
    await request
      .get("/api/conversation/message/read", {
        params: {
          conversationId: conversationId,
          fromUserId: userId,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          fetchUnreadList();
        }
      });
  };

  const hideConversation = async (id: number) => {
    await request
      .post(
        "/api/conversation/hide",
        {},
        {
          params: {
            conversationId: id,
          },
        }
      )
      .then((res) => {});
  };

  const handleSelectKey = (key: number) => {
    setActive(key);
    router.push(`/message/whisper/${key}`);
  };

  useEffect(() => {
    fetchCoversationList();
    fetchUnreadList();

    const client = new Client({
      brokerURL: `ws://${process.env.NEXT_PUBLIC_WS_URL}/system`,
      connectHeaders: {
        Authorization: `Bearer ${getToken()}`,
      },
      reconnectDelay: 2000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setClient(client);
        client.subscribe("/user/notif/unread/whisper", (message: IMessage) => {
          handleSetChatUnread(JSON.parse(message.body));
        });
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  useEffect(() => {
    pathname.split("/").forEach((e, i) => {
      if (i == 3) {
        setActive(Number(e));
      }
    });
  }, []);

  return (
    <div className="flex flex-col gap-1 rounded-xl inset-shadow-sm h-full">
      {conversationList.map((conv) => (
        <div
          key={conv.conversationId}
          className={
            "flex items-center py-2 pl-3 transition rounded-xl " +
            (active == conv.conversationId ? "bg-slate-500 text-white" : "")
          }
          onClick={() => handleSelectKey(conv.conversationId)}
        >
          <div className="relative">
            <img
              src={getImageUrl(conv.userInfo.avatarUrl)}
              className="size-12 rounded-full flex-shrink-0"
            />
            {chatUnreadComputed(
              conv.conversationId,
              conv.userInfo.accountId
            ) && (
              <div className="absolute top-0 right-0">
                <div
                  className={
                    "flex justify-center items-center size-4 text-xs text-white rounded-full bg-red-400"
                  }
                >
                  <div>
                    {getChatunread(
                      conv.conversationId,
                      conv.userInfo.accountId
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="text-lg ml-2">{conv.userInfo.nickname}</div>
          <div
            className={
              "ml-auto mr-5 size-5 text-center content-center text-xs rounded-full  hover:text-red-500 transition " +
              (active == conv.conversationId
                ? "hover:bg-white"
                : "hover:bg-slate-100")
            }
            onClick={(e) => {
              e.stopPropagation();
              hideConversation(conv.conversationId);
            }}
          >
            <CloseOutlined />
          </div>
        </div>
      ))}
    </div>
  );
}
