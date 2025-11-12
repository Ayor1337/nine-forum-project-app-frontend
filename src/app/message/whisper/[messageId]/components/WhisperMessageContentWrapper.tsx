"use client";

import service from "@/axios";
import { getToken } from "@/axios/Authorization";
import { useAuth } from "@/components/AuthProvider";
import { Client, IMessage } from "@stomp/stompjs";
import useApp from "antd/es/app/useApp";
import { useCallback, useEffect, useRef, useState } from "react";
import "./scroll.css";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { getImageUrl } from "@/axios/ImageService";
import { Image } from "antd";
import { ChatMessage } from "./chat";
import { formatSmartTime } from "@/func/DateConvert";

interface defineProps {
  conversationId: number;
}

export default function WhisperMessageContentWrapper({
  conversationId,
}: defineProps) {
  const PAGE_SIZE = 20;

  const [content, setContent] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const { message: antdMessage } = useApp();
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const { currentUser } = useAuth();
  const [page, setPage] = useState<number>(1);
  const [firstItemIndex, setFirstItemIndex] = useState(Number.MAX_SAFE_INTEGER);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [autoFollow, setAutoFollow] = useState(true);

  const isSender = useCallback(
    (accoundId: number) => {
      return currentUser ? currentUser.accountId === accoundId : false;
    },
    [currentUser]
  );

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
          antdMessage.warning(res.data.message);
        }
      });
  };

  const appendMessage = useCallback((message: ConversationMessage) => {
    setChatMessages((prevMessages) => {
      const prevArr = prevMessages ?? [];
      // 计算下一个递减索引：首条是 -1，之后每次 -1
      const nextIndex =
        prevArr.length === 0
          ? -1
          : (prevArr[prevArr.length - 1].index ?? -1) - 1;

      // 尾插，不改原数组
      return [...prevArr, { index: nextIndex, message }];
    });
  }, []);

  // 改函数签名：接收 pageNo
  const fetchConversationHistory = useCallback(
    async (pageNo: number) => {
      const res = await service.get("/api/conversation/message/list", {
        params: { conversationId, page_num: pageNo },
      });

      if (res.data.code !== 200) return;

      const pageEntity: PageEntity<ConversationMessage> = res.data.data;
      const list = pageEntity.data;
      list.reverse();

      // 批量前置（保持你 ChatMessage 的结构）
      setChatMessages((prev) => {
        const prevArr = prev ?? [];
        const seen = new Set(
          prevArr.map((x) => x.message.conversationMessageId)
        );

        // 过滤掉已经存在的
        const fresh = list.filter(
          (msg) => !seen.has(msg.conversationMessageId)
        );

        if (fresh.length === 0) {
          return prevArr; // 没有新增，直接返回旧的，避免多余 render
        }

        // 映射成你的 ChatMessage 结构（index 仅保留，不作为 key）
        const mapped: ChatMessage[] = fresh.map((msg, i) => ({
          message: msg,
          index: prevArr.length + list.length - i,
        }));

        // 头插：新老顺序保持不变
        return [...mapped, ...prevArr];
      });

      // 🔑 一次性扣减 firstItemIndex（按实际条数）
      if (list.length > 0) {
        setFirstItemIndex((v) => v - list.length);
      }

      // hasMore
      if (pageNo * PAGE_SIZE >= pageEntity.totalSize) {
        setHasMore(false);
      }
    },
    [conversationId]
  );

  const getPrevMessage = useCallback(
    (index: number) => {
      if (chatMessages == null) return null;
      if (chatMessages.length < 1) return null;

      const prevMessage = chatMessages
        .filter((x) => x.index === index + 1)
        .at(0);
      return prevMessage;
    },
    [chatMessages]
  );

  const itemContent = useCallback(
    (index: number, message: ChatMessage) => {
      if (!message) return null;

      const chatMessage = message.message;

      if (!chatMessage) return null;

      // 用回调的 index 拿上一条，避免用 message.index 造成错位
      const prev = getPrevMessage(message.index)?.message;

      const isMine = isSender(chatMessage.accountId);
      const isNewBlock = !prev || prev.accountId !== chatMessage.accountId;
      const showAvatar =
        !prev || prev.avatarUrl !== chatMessage.avatarUrl || isNewBlock;
      let longTimeNoSee;
      if (prev) {
        longTimeNoSee = formatSmartTime(
          prev.createTime,
          chatMessage.createTime
        );
      }

      const wrapperClass = isMine
        ? `flex pr-3 flex-1 items-center justify-end${
            isNewBlock ? " mt-2" : ""
          }`
        : `flex items-center${isNewBlock ? " mt-2" : ""}`;

      const bubbleClass = isMine
        ? "mr-3 ml-13 px-4 py-2 bg-green-400 text-white rounded-2xl"
        : "ml-3 mr-13 px-4 py-2 bg-slate-400 text-white rounded-2xl";

      // 更通用：用 w-10 h-10，避免 `size-10!` 这种写法
      const avatarClass = "size-10! rounded-full flex-shrink-0";

      return (
        <div>
          {longTimeNoSee && (
            <div className="flex flex-1 justify-center">{longTimeNoSee}</div>
          )}
          <div className="flex flex-1">
            <div className={wrapperClass}>
              {!isMine &&
                (showAvatar ? (
                  <Image
                    alt=""
                    src={getImageUrl(chatMessage.avatarUrl)}
                    className={avatarClass}
                    preview={false}
                  />
                ) : (
                  <div className="w-10 h-10 flex-shrink-0" />
                ))}

              <div className={bubbleClass}>{chatMessage.content}</div>

              {isMine &&
                (showAvatar ? (
                  <Image
                    alt=""
                    src={getImageUrl(chatMessage.avatarUrl)}
                    className={avatarClass}
                    preview={false}
                  />
                ) : (
                  <div className="w-10 h-10 flex-shrink-0" />
                ))}
            </div>
          </div>
        </div>
      );
    },
    [isSender, getPrevMessage]
  );

  const handleLoadMore = useCallback(async () => {
    if (!hasMore) return;
    const next = page + 1;
    setPage(next);
    await fetchConversationHistory(next); // ← 传入下一页
  }, [hasMore, page, fetchConversationHistory]);

  useEffect(() => {
    fetchConversationHistory(1);
  }, [fetchConversationHistory]);

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
        client.subscribe(
          `/user/transfer/conversation/${conversationId}`,
          (message: IMessage) => {
            appendMessage(JSON.parse(message.body));
          }
        );
      },
      onStompError: () => {
        client.deactivate();
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [conversationId, appendMessage]);

  return (
    chatMessages && (
      <>
        <div>
          <Virtuoso
            ref={virtuosoRef}
            className="h-120! scroller"
            data={chatMessages}
            itemContent={itemContent}
            firstItemIndex={firstItemIndex}
            followOutput={autoFollow ? "auto" : false}
            atBottomStateChange={setAutoFollow}
            computeItemKey={(i, m) => m.message.conversationMessageId}
            atTopThreshold={120}
            alignToBottom
            initialTopMostItemIndex={
              firstItemIndex + (chatMessages?.length ?? 0) - 1
            }
            startReached={handleLoadMore}
          />
        </div>
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
      </>
    )
  );
}
