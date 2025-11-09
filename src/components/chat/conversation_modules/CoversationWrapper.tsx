"use client";

import service from "@/axios";
import { useEffect, useState } from "react";
import ConversationTabs from "./components/ConversationTabs";
import ConversationContent from "./components/ConversationContent";

export default function ConversationWrapper() {
  const [conversationList, setConversationList] = useState<Conversation[]>([]);
  const [selectKey, setSelectKey] = useState<number>();

  const fetchCoversationList = async () => {
    await service.get("/api/conversation/list").then((res) => {
      if (res.data.code == 200) {
        setConversationList(res.data.data);
      }
    });
  };

  useEffect(() => {
    fetchCoversationList();
  }, []);

  return (
    <>
      <div className="flex h-180 w-full">
        <div className="flex-1/5">
          <ConversationTabs
            conversationList={conversationList}
            activeKey={selectKey}
            onChange={(key) => setSelectKey(key)}
          />
        </div>
        <div className="flex-3/5 ml-2">
          {selectKey ? (
            <ConversationContent conversationId={selectKey} />
          ) : (
            <div className="flex h-full justify-center items-center">
              选择一个聊天对象
            </div>
          )}
        </div>
      </div>
    </>
  );
}
