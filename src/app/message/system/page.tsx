"use client";

import { getToken } from "@/axios/Authorization";
import { Client, IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useRef, useState } from "react";
import SystemMessageCard from "./components/SystemMessageCard";
import service from "@/axios";
import VirtutalList from "rc-virtual-list";
import useApp from "antd/es/app/useApp";

export default function SystemPage() {
  const [client, setClient] = useState<Client | null>();
  const [notifications, setNotifications] = useState<SystemMessage[]>([]);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { message } = useApp();

  const CONTAINER_HEIGHT = 740;

  const fetchSystemMessages = async () => {
    await service
      .get("/api/system/message/list", {
        params: {
          page_num: page,
          page_size: 7,
        },
      })
      .then((res) => {
        const data: PageEntity<SystemMessage> = res.data.data;
        if (data.data == null || data.data.length === 0) {
          setHasMore(false);
          message.info("已经到底了");
        }
        data.data.forEach((item) => {
          appendSystemMessages(item);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const appendSystemMessages = useCallback(
    (message: SystemMessage | SystemMessage[]) => {
      setNotifications((prev) => {
        const incoming = Array.isArray(message) ? message : [message];
        const map = new Map(prev.map((m) => [m.systemMessageId, m]));
        incoming.forEach((m) => map.set(m.systemMessageId, m));
        return Array.from(map.values());
      });
    },
    []
  );

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (
      Math.abs(
        e.currentTarget.scrollHeight -
          e.currentTarget.scrollTop -
          CONTAINER_HEIGHT
      ) <= 1
    ) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    fetchSystemMessages();
  }, []);

  useEffect(() => {
    if (hasMore) {
      fetchSystemMessages();
    }
  }, [page]);

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
        client.subscribe(`/user/notif/system`, (message: IMessage) => {
          appendSystemMessages(JSON.parse(message.body));
        });
      },
      onStompError: (error) => {
        client.deactivate();
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    notifications && (
      <>
        <VirtutalList
          data={notifications}
          height={CONTAINER_HEIGHT}
          itemKey="systemMessageId"
          itemHeight={120}
          onScroll={onScroll}
        >
          {(item: SystemMessage) => <SystemMessageCard item={item} />}
        </VirtutalList>
      </>
    )
  );
}
