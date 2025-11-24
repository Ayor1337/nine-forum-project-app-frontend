"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { Avatar, Badge, Button, Drawer, Input } from "antd";
import { BellOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getImageUrl } from "@/axios/ImageService";
import { useRouter } from "next/navigation";
import MessageWrapper from "../chat/MessageWrapper";
import { Client, IMessage } from "@stomp/stompjs";
import { getToken } from "@/axios/Authorization";
import service from "@/axios";

export default function HeaderNav() {
  const { currentUser, isLogin, logout } = useAuth();
  const [isActive, setActive] = useState<boolean>(false);
  const [isNotiHover, setNotiHover] = useState<boolean>(false);
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [client, setClient] = useState<Client | null>(null);
  const [systemUnread, setSystemUnread] = useState<number>(0);
  const [userUnread, setUserUnread] = useState<number>(0);
  const [replyUnread, setReplyUnread] = useState<number>(0);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const router = useRouter();

  const fetchUnreadMessage = async () => {
    await service.get("/api/notif/remaining_message_unread").then((res) => {
      if (res.data.code == 200) {
        setUnreadCount(res.data.data.unread);
      }
    });
  };

  const fetchUnreadMessageItem = async (type: string) => {
    await service
      .get(`/api/notif/remaining_message_unread`, {
        params: { type: type },
      })
      .then((res) => {
        if (res.data.code == 200) {
          if (type == "system") {
            setSystemUnread(res.data.data.unread);
            return;
          }
          if (type == "user") {
            setUserUnread(res.data.data.unread);
            return;
          }
          if (type == "reply") {
            setReplyUnread(res.data.data.unread);
            return;
          }
        }
      });
  };

  useEffect(() => {
    fetchUnreadMessage();
    fetchUnreadMessageItem("system");
    fetchUnreadMessageItem("user");
    fetchUnreadMessageItem("reply");
  }, []);

  useEffect(() => {
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
        client.subscribe("/user/notif/unread", (message: IMessage) => {
          setUnreadCount(JSON.parse(message.body).unread);
        });
        setClient(client);
        client.subscribe("/user/notif/unread/system", (message: IMessage) => {
          setSystemUnread(JSON.parse(message.body).unread);
        });
        client.subscribe("/user/notif/unread/user", (message: IMessage) => {
          setUserUnread(JSON.parse(message.body).unread);
        });
        client.subscribe("/user/notif/unread/reply", (message: IMessage) => {
          setReplyUnread(JSON.parse(message.body).unread);
        });
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <div className="z-999 bg-white/70 w-full backdrop-blur-md shadow-sm">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-3">
        {/* 左侧导航 */}
        <nav className="flex gap-6">
          <Link href="/" className="header-nav-link">
            主页
          </Link>
          <Link href="/forum" className="header-nav-link">
            论坛
          </Link>
          <Link href="/about" className="header-nav-link">
            联系我们
          </Link>
        </nav>

        <Search />

        {/* 右侧操作 */}
        {isLogin ? (
          <div className="relative">
            <AnimatePresence initial={false}>
              <div className="flex items-center gap-5">
                <div
                  className="size-8 relative flex justify-center items-center rounded-full group hover:bg-neutral-200 transition"
                  onClick={() => setDrawerOpen(true)}
                  onMouseEnter={() => setNotiHover(true)}
                  onMouseLeave={() => setNotiHover(false)}
                >
                  <Badge count={unreadCount}>
                    <BellOutlined className="text-lg" />
                  </Badge>

                  <motion.div
                    key="noti-dropdown"
                    className="overflow-hidden absolute shadow-lg rounded-2xl w-34 top-10 bg-white"
                    initial={{ height: 0 }}
                    animate={{ height: isNotiHover ? "auto" : 0 }}
                  >
                    <div className="flex flex-col px-1 py-2 gap-1  ">
                      <div
                        className="flex items-center justify-between cursor-pointer hover:bg-neutral-100 px-3 py-1 rounded-2xl transition"
                        onClick={() => router.push("/message/reply")}
                      >
                        <div>我的回复</div>
                        <Badge count={replyUnread} />
                      </div>
                      <div
                        className="flex items-center justify-between cursor-pointer hover:bg-neutral-100 px-3 py-1 rounded-2xl transition"
                        onClick={() => router.push("/message/system")}
                      >
                        <div>系统通知</div>
                        <Badge count={systemUnread} />
                      </div>
                      <div
                        className="flex items-center justify-between cursor-pointer hover:bg-neutral-100 px-3 py-1 rounded-2xl transition"
                        onClick={() => router.push("/message/whisper")}
                      >
                        <div>我的消息</div>
                        <Badge count={userUnread} />
                      </div>
                    </div>
                  </motion.div>
                </div>
                <motion.div
                  key="avatar"
                  initial={{ scale: 1, y: 0 }}
                  animate={{ scale: isActive ? 3 : 1, y: isActive ? 40 : 0 }}
                  exit={{ scale: 1, y: 0 }}
                  transition={{ duration: 0.15, bounce: 0.5 }}
                  className="z-99"
                  onMouseEnter={() => setActive(true)}
                  onMouseLeave={() => setActive(false)}
                >
                  <Avatar src={getImageUrl(currentUser?.avatarUrl)} />
                </motion.div>
              </div>
              <motion.div
                key="user-dropdown"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isActive ? 1 : 0,
                  pointerEvents: isActive ? "auto" : "none",
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={() => setActive(true)}
                onMouseLeave={() => setActive(false)}
                className="absolute -right-10 top-13 w-60 min-h-50 bg-white shadow "
              >
                <div className="pt-1 pb-5 px-2 w-full h-full flex flex-col items-center">
                  <div className="mb-10 self-start text-lg">
                    {currentUser?.nickname}
                  </div>
                  <div
                    className="flex flex-col
                   items-center flex-1 justify-between w-full gap-2 "
                  >
                    <Link
                      href={"/space/" + currentUser?.accountId}
                      className="hover:bg-neutral-100! text-black! w-9/10 py-2 rounded-2xl text-center transition-all cursor-pointer"
                    >
                      个人信息
                    </Link>
                    <div
                      className="hover:bg-neutral-100 w-9/10 py-2 rounded-2xl text-center transition-all cursor-pointer"
                      onClick={() => router.push("/security")}
                    >
                      安全设置
                    </div>
                    <div
                      className="hover:bg-neutral-100 w-9/10 py-2 rounded-2xl text-center transition-all cursor-pointer"
                      onClick={logout}
                    >
                      退出登录
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <Link href="/login" className="header-nav-link">
              登录
            </Link>
            <Link href="/register" className="header-nav-link">
              注册
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Search() {
  const [query, setQuery] = useState<string>("");
  const [isHover, setIsHover] = useState<boolean>(false);
  const [isTopicHover, setIsTopicHover] = useState<boolean>(false);
  const router = useRouter();
  const handleSearch = () => {
    if (query) {
      router.push(`/search/query?q=${query}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <>
      {/* Search Start */}
      <AnimatePresence initial={false}>
        <div className="rounded-xl peer flex w-150 bg-slate-50 shadow-sm transition relative overflow-hidden">
          <input
            placeholder="想搜点什么呢..."
            className="border-0 ring-0 outline-none py-1 px-4 w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                handleSearch();
              }
            }}
          />
          <motion.div
            className={
              "absolute right-0 group h-full overflow-hidden rounded-xl cursor-pointer transition " +
              (isTopicHover ? "bg-orange-600" : "bg-orange-500")
            }
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <motion.div
              animate={{
                width: isHover ? "140px" : "40px",
              }}
              className="flex items-center text-neutral-50 text-shadow-xs rounded-xl rounded-l-none transition h-full "
            >
              <motion.div className="flex flex-1 h-full items-center">
                <motion.div
                  animate={{ width: isHover ? "60%" : "100%" }}
                  className="text-nowrap flex gap-2 justify-center items-center h-full rounded-r-xl bg-blue-700 hover:bg-blue-900 hover:text-neutral-200 transition"
                  onClick={() => {
                    handleSearch();
                  }}
                >
                  <SearchOutlined />
                  <motion.div animate={{ opacity: isHover ? 1 : 0 }}>
                    全局
                  </motion.div>
                </motion.div>
                <motion.div
                  animate={{ width: isHover ? "40%" : "0%" }}
                  className="text-nowrap flex justify-center items-center h-full"
                  onMouseEnter={() => {
                    setIsTopicHover(true);
                  }}
                  onMouseLeave={() => {
                    setIsTopicHover(false);
                  }}
                  onClick={() => {
                    handleSearch();
                  }}
                >
                  <motion.div animate={{ opacity: isHover ? 1 : 0 }}>
                    主题
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </AnimatePresence>
      {/* Search End */}
    </>
  );
}
