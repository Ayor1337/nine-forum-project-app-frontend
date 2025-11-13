"use client";

import service from "@/axios";
import { getToken } from "@/axios/Authorization";
import Footer from "@/components/ui/Footer";
import HeaderNav from "@/components/ui/HeaderNav";
import { Client, IMessage } from "@stomp/stompjs";
import { Badge, Tabs } from "antd";
import { usePathname, useRouter } from "next/navigation";
import path from "path";
import { useEffect, useState } from "react";

interface defineProps {
  children: Readonly<React.ReactNode>;
}

export default function MessageLayout({ children }: defineProps) {
  const [activeTab, setActiveTab] = useState<string>();
  const [systemUnread, setSystemUnread] = useState<number>(0);
  const [userUnread, setUserUnread] = useState<number>(0);
  const [replyUnread, setReplyUnread] = useState<number>(0);
  const [clinet, setClient] = useState<Client | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUnreadMessage = async (type: string) => {
    await service
      .get(`/api/notif/remaining_message_unread`, {
        params: { type: type },
      })
      .then((res) => {
        if (res.data.code == 200) {
          if (type == "system") {
            setSystemUnread(res.data.data.unread);
          }
          if (type == "user") {
            setUserUnread(res.data.data.unread);
          }
          if (type == "reply") {
            setReplyUnread(res.data.data.unread);
          }
        }
      });
  };

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

  useEffect(() => {
    fetchUnreadMessage("system");
    fetchUnreadMessage("user");
    fetchUnreadMessage("reply");
  }, []);

  useEffect(() => {
    pathname.split("/").forEach((e, i) => {
      if (i == 2) {
        setActiveTab(e);
      }
    });
  }, [pathname]);

  return (
    <div className="min-h-screen relative">
      <div className="sticky top-0 z-999 w-full flex justify-center">
        <div className="w-full">
          <HeaderNav />
        </div>
      </div>
      <div className="w-[1200px] mx-auto flex mt-5">
        <Tabs
          activeKey={activeTab}
          onChange={(e) => {
            setActiveTab(e);
            router.push(`/message/${e}`);
          }}
          tabPosition="left"
          items={[
            {
              key: "reply",
              label: (
                <Badge count={replyUnread} size="small">
                  <div className="py-2">消息通知 </div>
                </Badge>
              ),
            },
            {
              key: "system",
              label: (
                <Badge count={systemUnread} size="small">
                  <div className="py-2">系统通知</div>
                </Badge>
              ),
            },
            {
              key: "whisper",
              label: (
                <Badge count={userUnread} size="small">
                  <div className="py-2">我的消息</div>
                </Badge>
              ),
            },
          ]}
        />
        <div className="flex-1">{children}</div>
      </div>

      <div className="absolute bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
}
