"use client";

import service from "@/axios";
import { getToken } from "@/axios/Authorization";
import { getImageUrl } from "@/axios/ImageService";
import { useAuth } from "@/components/AuthProvider";
import { Client, IMessage } from "@stomp/stompjs";
import useApp from "antd/es/app/useApp";
import { use, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./scroll.css";
import VirtualList, { ListRef } from "rc-virtual-list";

interface defineProps {
  conversationId: number;
}

export default function WhisperMessageContentWrapper({
  conversationId,
}: defineProps) {
  const [content, setContent] = useState<string>("");
  const [conversationMessages, setConversationMessages] =
    useState<PageEntity<ConversationMessage>>();
  const [client, setClient] = useState<Client | null>(null);
  const { message } = useApp();
  const { currentUser } = useAuth();
  const listRef = useRef<ListRef>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isInit, setInit] = useState<boolean>(false);
  const [topHeight, setTopHeight] = useState<number>(0);

  const CONTAINER_HEIGHT = 480;

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
      setConversationMessages((prevMessages) => {
        if (prevMessages) {
          return {
            totalSize: prevMessages.totalSize + 1,
            data: [message, ...prevMessages.data],
          };
        } else {
          return {
            totalSize: 1,
            data: [message],
          };
        }
      });
    }
  };

  const fetchConversationHistory = async (id: number) => {
    await service
      .get("/api/conversation/message/list", {
        params: {
          conversationId: id,
          page_num: page,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          let pageEntity: PageEntity<ConversationMessage> = res.data.data;
          console.log("查询一次");

          if (page * 20 >= res.data.data.totalSize) {
            console.log("结束了");
            setHasMore(false);
          }
          pageEntity.data.forEach((message) => {
            addConversationMessages(message);
          });
        }
      });
  };

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    const el = listRef.current?.getScrollInfo();

    if (!el) return;

    if (el.y <= 0 && hasMore) {
      // console.log(topHeight);
      listRef.current?.scrollTo({
        top: Math.abs(e.currentTarget.scrollHeight - topHeight),
      });
      setPage(page + 1);
      if (hasMore) {
        fetchConversationHistory(conversationId);
      }
    }
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
      onConnect: () => {
        setClient(client);
        client.subscribe(
          `/user/transfer/conversation/${conversationId}`,
          (message: IMessage) => {
            addConversationMessages(JSON.parse(message.body));
            message.ack();
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

  useLayoutEffect(() => {
    if (!isInit) {
      const len = conversationMessages?.data?.length ?? 0;
      if (!len) return;
      // 方案A：按索引定位到底
      listRef.current?.scrollTo({ index: len - 1, align: "bottom" });
      // 方案B：像素制兜底（部分旧版更稳）
      listRef.current?.scrollTo(Number.MAX_SAFE_INTEGER);
      setInit(true);
    }
  }, [conversationMessages?.data?.length]);

  return (
    conversationMessages && (
      <div className="max-h-full">
        <VirtualList
          data={conversationMessages.data}
          itemKey="conversationMessageId"
          height={CONTAINER_HEIGHT}
          itemHeight={60}
          onScroll={onScroll}
          ref={listRef}
          className="flex flex-col scroller pr-1"
        >
          {(message, index) => (
            <div className="flex flex-1" key={message.conversationMessageId}>
              {isSender(message.accountId) ? (
                <div
                  className={
                    "flex flex-1 items-center justify-end" +
                    (index > 0 &&
                    conversationMessages.data[index - 1].accountId !=
                      message.accountId
                      ? " mt-2"
                      : "")
                  }
                >
                  <div className="mr-3 ml-13 px-4 py-2 bg-green-400 text-white rounded-2xl">
                    {message.content}
                  </div>
                  {index > 0 &&
                  conversationMessages.data[index - 1].avatarUrl ==
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
              ) : (
                <div
                  className={
                    "flex items-center" +
                    (index > 0 &&
                    conversationMessages.data[index - 1].accountId !=
                      message.accountId
                      ? " mt-2"
                      : "")
                  }
                >
                  {index > 0 &&
                  conversationMessages.data[index - 1].avatarUrl ==
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
              )}
            </div>
          )}
        </VirtualList>
        <div className="flex-1/5 relative border-1 border-slate-400/35 rounded-xl mt-1">
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
              className="size-full text-[15px] text-slate-700 resize-none outline-none px-3 py-4 "
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
    )
  );
}
