import { Card, Tabs } from "antd";
import { useState } from "react";
import PostTab from "./tabs/PostTab";
import LikesTab from "./tabs/LikesTab";
import CollectTab from "./tabs/CollectTab";

interface defineProps {
  userId: string;
}

export default function UserContent({ userId }: defineProps) {
  const [activeTab, setActiveTab] = useState<string>("posts");

  return (
    <div className="flex-3/4">
      <Card className="rounded-2xl shadow-sm">
        <Tabs
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k)}
          items={[
            { key: "posts", label: "帖子" },
            { key: "likes", label: "喜欢" },
            { key: "favorites", label: "收藏" },
          ]}
        />

        {/* 帖子列表 */}
        {activeTab === "posts" && <PostTab userId={userId} />}

        {/* 回复列表 */}
        {activeTab === "likes" && <LikesTab userId={userId} />}

        {/* 收藏夹 */}
        {activeTab === "favorites" && <CollectTab userId={userId} />}
      </Card>
    </div>
  );
}
