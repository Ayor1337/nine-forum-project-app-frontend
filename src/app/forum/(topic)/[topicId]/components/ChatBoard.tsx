import request from "@/api/request";
import { UpOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
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
  const [chatboardHistories, setChatboardHistories] = useState<ChatboardHistory[]>([]);
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const { message } = useApp();
  /* 
    Virtuoso 的 firstItemIndex 需要管理“虚拟”起始索引。
    我们从一个较大的数字开始，以允许向前添加历史记录。
    当向前添加 N 个项目时，我们将 firstItemIndex 减去 N。
    当追加项目时，我们不改变 firstItemIndex。
  */
  const START_INDEX = 10000;
  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

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
    if (message) {
      // 追加：不改变 firstItemIndex
      setChatboardHistories((prev) => [...prev, message]);
      
      // 滚动到底部
      setTimeout(() => {
        // 我们使用函数更新器来获取最新状态（如果需要），或者仅仅依赖 ref
        // 基于最新状态计算索引。
        // 这里没有依赖项很难获取最新的 'userMessages'。
        // 但是 Virtuoso 支持 `scrollToIndex({ index: 'LAST' })` 吗？
        // 如果不支持，我们需要索引。
        // 保险起见：滚动到一个巨大的数字，或者使用 `align: 'end'` 并根据状态设置器推导出的特定索引？
        // 更好的方法：使用 Virtuoso 的 `followOutput` 属性或 `scrollTo({ top: ... })`。
        // 最简单的手动滚动：
        virtuosoRef.current?.scrollTo({
           top: 999999, // 滚动到最底部
           behavior: 'smooth'
        });
      }, 100);
    }
  };


  const fetchMessages = useCallback(
    async (pageNum: number, isHistory: boolean = false) => {
      // 如果是加载历史记录，需要 loading=false。
      // 如果是初始加载，也需要 loading=false（隐式处理）。
      if (loading) return;
      
      setLoading(true);
      try {
        const res = await request.get("/api/chat/info/history", {
          params: {
            topic_id: topicId,
            page_num: pageNum,
            page_size: 20,
          },
        });

        if (res.data.code === 200) {
          const historyList: ChatboardHistory[] = res.data.data.data;
          
          if (!historyList || historyList.length < 20) {
             // 如果是 0 项，如果长度 > 0 我们可能仍然处理。
             // 如果长度 < 20，则是最后一页。
             setHasMore(false);
          }
          
          if (historyList.length === 0) {
             setLoading(false);
             return; 
          }

          // API 假设为倒序（最新的在前）。
          // 反转以按时间顺序显示 [旧的 ... 新的]。
          // 分页：第 1 页（最新的 20 条），第 2 页（较旧的 20 条）。
          // 第 1 页反转 -> [旧(19), ..., 新(0)]
          // 第 2 页反转 -> [更旧(39), ..., 旧(20)]
          const chronological = historyList.reverse();

          if (isHistory) {
            // 向前添加
            setFirstItemIndex((prev) => prev - chronological.length);
            setChatboardHistories((prev) => [...chronological, ...prev]);
          } else {
            // 初始加载
            setChatboardHistories(chronological);
            // 我们从 START_INDEX 开始。
            // 如果我们假设初始加载就是“底部”，
            // 如果我们将其视为“基准”，则无需调整。
            // 但我们可能希望统一逻辑。
            // 让我们在初始加载时保持 firstItemIndex 为 START_INDEX。
            // 滚动到底部。
            setTimeout(() => {
              virtuosoRef.current?.scrollToIndex({
                index: START_INDEX + chronological.length - 1,
                align: "end",
              });
            }, 100);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [topicId, loading] // fetchMessages 依赖项
  );

  const handleExpand = () => {
    if (isExpanded) {
      setExpanded(false);
    } else {
      setExpanded(true);
      // 等待渲染/动画
      setTimeout(() => {
          if (virtuosoRef.current) {
             // 滚动到底部
             virtuosoRef.current.scrollToIndex({
                index: firstItemIndex + chatboardHistories.length - 1,
                align: "end",
                behavior: "smooth"
             });
          }
      }, 50); 
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
    fetchMessages(1, false);
    setPage(2);
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
            className="h-full rounded-xl bg-neutral-100 py-2 pl-2"
            // style={{ overflowY: isExpanded ? "auto" : "visible" }}
          >
             <Virtuoso
                ref={virtuosoRef}
                style={{ height: "100%" }}
                data={chatboardHistories}
                overscan={2000} // 提前渲染 2000px，触发 startReached 更早
                firstItemIndex={firstItemIndex}
                initialTopMostItemIndex={firstItemIndex + chatboardHistories.length - 1} // 仅在挂载时有数据才有效，通常如果为空则忽略
                startReached={() => {
                  if (hasMore && !loading) {
                    // 获取历史记录
                    fetchMessages(page, true);
                    setPage((prev) => prev + 1);
                  }
                }}
                itemContent={(index, message) => (
                  <div className="py-2 pr-2">
                    <ChatBoardMessage
                      chatboardHistory={message}
                      disabled={!isExpanded}
                    />
                  </div>
                )}
              />
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
