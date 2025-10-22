"use client";

import { useState, useEffect } from "react";
import { Alert, Button, List, Space, Typography, App } from "antd";
import {
  AndroidOutlined,
  AppleOutlined,
  WindowsOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const LS_KEY = "security.activities";

type Activity = {
  id: string;
  device: string;
  os: "windows" | "macos" | "android" | "ios";
  browser: string;
  location: string;
  ip: string;
  timestamp: number;
};

const mockActivities: Activity[] = [
  {
    id: "1",
    device: "Chrome",
    os: "windows",
    browser: "Chrome 120",
    location: "北京",
    ip: "127.0.0.1",
    timestamp: Date.now(),
  },
  {
    id: "2",
    device: "Safari Mobile",
    os: "ios",
    browser: "Safari 17",
    location: "上海",
    ip: "192.168.1.1",
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: "3",
    device: "Firefox",
    os: "macos",
    browser: "Firefox 121",
    location: "广州",
    ip: "192.168.1.2",
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
  },
];

export default function ActivitySection() {
  const { message, modal } = App.useApp();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(LS_KEY);
        setActivities(raw ? JSON.parse(raw) : mockActivities);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(activities));
      } catch {
        message.error("写入本地存储失败");
      }
    }
  }, [activities, message]);

  const clearActivities = () => {
    modal.confirm({
      title: "清空记录",
      content: "确定要清空所有登录记录吗？此操作不可恢复。",
      okText: "清空",
      cancelText: "取消",
      onOk: () => {
        setActivities([]);
        message.success("已清空登录记录");
      },
    });
  };

  const getOsIcon = (os: Activity["os"]) => {
    switch (os) {
      case "windows":
        return <WindowsOutlined />;
      case "macos":
        return <AppleOutlined />;
      case "android":
        return <AndroidOutlined />;
      case "ios":
        return <AppleOutlined />;
      default:
        return null;
    }
  };

  return (
    <App>
      <div>
        <Alert
          type="info"
          showIcon
          message={
            <div className="flex items-center gap-2">
              <Text>
                共 {activities.length} 条记录
                {activities.length > 0 && (
                  <Button
                    type="link"
                    size="small"
                    onClick={clearActivities}
                    style={{ padding: 0, marginLeft: 8 }}
                  >
                    清空记录
                  </Button>
                )}
              </Text>
            </div>
          }
          style={{ marginBottom: 16 }}
        />

        <List
          dataSource={activities}
          renderItem={(activity) => (
            <List.Item>
              <List.Item.Meta
                avatar={getOsIcon(activity.os)}
                title={
                  <Space>
                    <Text>{activity.device}</Text>
                    <Text type="secondary">·</Text>
                    <Text>{activity.browser}</Text>
                  </Space>
                }
                description={
                  <Space>
                    <Text type="secondary">{activity.location}</Text>
                    <Text type="secondary">·</Text>
                    <Text type="secondary">{activity.ip}</Text>
                    <Text type="secondary">·</Text>
                    <Text type="secondary">
                      {new Date(activity.timestamp).toLocaleString(undefined, {
                        hour12: false,
                      })}
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </App>
  );
}