import { Tabs } from "antd";
import { useState } from "react";
import ConversationWrapper from "./conversation_modules/CoversationWrapper";

export default function MessageWrapper() {
  const [activeTab, setActiveTab] = useState<string>("posts");

  return (
    <>
      <div className="flex">
        <Tabs
          activeKey={activeTab}
          onChange={(e) => setActiveTab(e)}
          tabPosition="left"
          items={[
            { key: "post", label: "帖子回复" },
            { key: "system", label: "系统通知" },
            { key: "message", label: "我的消息" },
          ]}
        />

        {activeTab === "post" && <div>帖子回复</div>}

        {activeTab === "system" && <div>系统通知</div>}

        {activeTab === "message" && (
          <div className="w-full px-2">
            <ConversationWrapper />
          </div>
        )}
      </div>
    </>
  );
}
