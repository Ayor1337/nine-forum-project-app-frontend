"use client";

import { getToken } from "@/api/utils/auth";
import { Client, IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useRef, useState } from "react";
import SystemMessageCard from "./components/SystemMessageCard";
import request from "@/api/request";
import { Virtuoso } from "react-virtuoso";

export default function SystemPage() {
  const PAGE_SIZE = 7;

  const [client, setClient] = useState<Client | null>();
  const [notifications, setNotifications] = useState<SystemMessage[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchSystemMessages = async () => {
    await request
      .get("/api/system/message/list", {
        params: {
          page_num: page,
          page_size: 7,
        },
      })
      .then((res) => {
        const data: PageEntity<SystemMessage> = res.data.data;
        if (page * PAGE_SIZE >= data.totalSize) {
          setHasMore(false);
        }
        data.data.forEach((item) => {
          appendSystemMessage(item);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const prependSystemMessage = useCallback((message: SystemMessage) => {
    setNotifications((prevMessages) => {
      if (
        prevMessages.some((m) => m.systemMessageId === message.systemMessageId)
      ) {
        return prevMessages;
      }
      if (!prevMessages) {
        return [message];
      }
      return [message, ...prevMessages];
    });
  }, []);

  const appendSystemMessage = useCallback((message: SystemMessage) => {
    setNotifications((prevMessages) => {
      if (
        prevMessages.some((m) => m.systemMessageId === message.systemMessageId)
      ) {
        return prevMessages;
      }
      if (!prevMessages) {
        return [message];
      }
      return [...prevMessages, message];
    });
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore) return;
    const next = page + 1;
    setPage(next);
    await fetchSystemMessages(); // ← 传入下一页
  }, [hasMore, page]);

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
          prependSystemMessage(JSON.parse(message.body));
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

  const itemContent = (index: number, data: SystemMessage) => (
    <SystemMessageCard item={data} />
  );

  return (
    notifications && (
      <>
        <Virtuoso
          className="h-175!"
          endReached={handleLoadMore}
          data={notifications}
          itemContent={itemContent}
        />
      </>
    )
  );
}
