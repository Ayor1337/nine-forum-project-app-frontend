"use client";

import { useState, useEffect } from "react";
import { Alert, Radio, Space, Typography, App } from "antd";
import { EyeOutlined, HeartOutlined, StarOutlined } from "@ant-design/icons";

const { Text } = Typography;

const LS = {
  privacy: "security.privacy",
};

type PrivacySettings = {
  profileVisibility: "public" | "friends" | "private";
  likesVisibility: "public" | "friends" | "private";
  favoritesVisibility: "public" | "friends" | "private";
  lastUpdatedAt?: number;
};

const defaultPrivacy: PrivacySettings = {
  profileVisibility: "public",
  likesVisibility: "friends",
  favoritesVisibility: "friends",
};

export default function PrivacySection() {
  const { message } = App.useApp();
  const [privacy, setPrivacy] = useState<PrivacySettings>(defaultPrivacy);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(LS.privacy);
        if (raw) {
          setPrivacy(JSON.parse(raw));
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          LS.privacy,
          JSON.stringify({ ...privacy, lastUpdatedAt: Date.now() })
        );
      } catch {
        message.error("写入本地存储失败");
      }
    }
  }, [privacy, message]);

  return (
    <App>
      <div>
        <Alert
          type="info"
          showIcon
          message={
            <div className="flex items-center gap-2">
              <Text>
                上次修改：
                {privacy.lastUpdatedAt
                  ? new Date(privacy.lastUpdatedAt).toLocaleString(undefined, {
                      hour12: false,
                    })
                  : "从未修改"}
              </Text>
            </div>
          }
          style={{ marginBottom: 16 }}
        />

        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <EyeOutlined />
              <Text>个人主页可见性</Text>
            </div>
            <Radio.Group
              value={privacy.profileVisibility}
              onChange={(e) =>
                setPrivacy((prev) => ({
                  ...prev,
                  profileVisibility: e.target.value,
                }))
              }
            >
              <Radio.Button value="public">公开</Radio.Button>
              <Radio.Button value="friends">仅好友</Radio.Button>
              <Radio.Button value="private">仅自己</Radio.Button>
            </Radio.Group>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <HeartOutlined />
              <Text>点赞记录可见性</Text>
            </div>
            <Radio.Group
              value={privacy.likesVisibility}
              onChange={(e) =>
                setPrivacy((prev) => ({
                  ...prev,
                  likesVisibility: e.target.value,
                }))
              }
            >
              <Radio.Button value="public">公开</Radio.Button>
              <Radio.Button value="friends">仅好友</Radio.Button>
              <Radio.Button value="private">仅自己</Radio.Button>
            </Radio.Group>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <StarOutlined />
              <Text>收藏夹可见性</Text>
            </div>
            <Radio.Group
              value={privacy.favoritesVisibility}
              onChange={(e) =>
                setPrivacy((prev) => ({
                  ...prev,
                  favoritesVisibility: e.target.value,
                }))
              }
            >
              <Radio.Button value="public">公开</Radio.Button>
              <Radio.Button value="friends">仅好友</Radio.Button>
              <Radio.Button value="private">仅自己</Radio.Button>
            </Radio.Group>
          </div>
        </Space>
      </div>
    </App>
  );
}