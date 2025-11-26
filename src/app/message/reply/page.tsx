"use client";

import { getToken } from "@/api/utils/auth";
import { Client, IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useState } from "react";
import request from "@/api/request";
import { Virtuoso } from "react-virtuoso";
import ReplyMessageCard from "./components/ReplyMessageCard";

export default function SystemPage() {
  const PAGE_SIZE = 7;

  const [client, setClient] = useState<Client | null>();
  const [notifications, setNotifications] = useState<ReplyMessage[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchReplyMessages = async () => {
    await request
      .get("/api/post/message/list", {
        params: {
          page_num: page,
          page_size: 7,
        },
      })
      .then((res) => {
        const data: PageEntity<ReplyMessage> = res.data.data;

        if (page * PAGE_SIZE >= data.totalSize) {
          setHasMore(false);
        }
        data.data.forEach((item) => {
          appendReplyMessage(item);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const prependReplyMessage = useCallback((message: ReplyMessage) => {
    setNotifications((prevMessages) => {
      if (!prevMessages) {
        return [message];
      }
      return [message, ...prevMessages];
    });
  }, []);

  const appendReplyMessage = useCallback((message: ReplyMessage) => {
    setNotifications((prevMessages) => {
      if (prevMessages.some((m) => m.postId === message.postId)) {
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
    await fetchReplyMessages(); // ← 传入下一页
  }, [hasMore, page]);

  useEffect(() => {
    fetchReplyMessages();
  }, []);

  useEffect(() => {
    if (hasMore) {
      fetchReplyMessages();
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
        client.subscribe(`/user/notif/reply`, (message: IMessage) => {
          prependReplyMessage(JSON.parse(message.body));
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

  const itemContent = (index: number, data: ReplyMessage) => (
    <ReplyMessageCard item={data} />
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
