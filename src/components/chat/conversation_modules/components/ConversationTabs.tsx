import service from "@/axios";
import { getImageUrl } from "@/axios/ImageService";
import { CloseOutlined } from "@ant-design/icons";
import { useState } from "react";

interface defineProps {
  conversationList: Conversation[];
  activeKey?: number;
  onChange?: (key: number) => void;
}

export default function ConversationTabs({
  conversationList,
  activeKey,
  onChange,
}: defineProps) {
  const [active, setActive] = useState<number>(activeKey ? activeKey : 0);

  const hideConversation = async (id: number) => {
    await service
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
    if (onChange) {
      onChange(key);
    }
  };

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
          <div>
            <img
              src={getImageUrl(conv.userInfo.avatarUrl)}
              className="size-12 rounded-full flex-shrink-0"
            />
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
