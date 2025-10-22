"use client";

import { useState, useEffect } from "react";
import { Alert, Button, List, Space, Typography, App } from "antd";
import { GlobalOutlined, LaptopOutlined } from "@ant-design/icons";

const { Text } = Typography;

const LS_KEY = "security.sessions";

type Session = {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: number;
  current?: boolean;
};

const mockSessions: Session[] = [
  {
    id: "current",
    device: "Windows PC",
    browser: "Chrome",
    location: "北京",
    ip: "127.0.0.1",
    lastActive: Date.now(),
    current: true,
  },
  {
    id: "other1",
    device: "iPhone",
    browser: "Safari",
    location: "上海",
    ip: "192.168.1.1",
    lastActive: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: "other2",
    device: "MacBook",
    browser: "Firefox",
    location: "广州",
    ip: "192.168.1.2",
    lastActive: Date.now() - 1000 * 60 * 60 * 24,
  },
];

export default function SessionsSection() {
  const { message, modal } = App.useApp();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(LS_KEY);
        setSessions(raw ? JSON.parse(raw) : mockSessions);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(sessions));
      } catch {
        message.error("写入本地存储失败");
      }
    }
  }, [sessions, message]);

  const revokeSession = (sessionId: string) => {
    modal.confirm({
      title: "确认注销",
      content: "确定要注销此会话吗？",
      okText: "注销",
      cancelText: "取消",
      onOk: () => {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        message.success("已注销会话");
      },
    });
  };

  const revokeOtherSessions = () => {
    modal.confirm({
      title: "注销其他会话",
      content: "确定要注销除当前会话外的所有其他会话吗？",
      okText: "注销",
      cancelText: "取消",
      onOk: () => {
        setSessions((prev) => prev.filter((s) => s.current));
        message.success("已注销其他会话");
      },
    });
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
                当前活跃会话：{sessions.length} 个
                {sessions.length > 1 && (
                  <Button
                    type="link"
                    size="small"
                    onClick={revokeOtherSessions}
                    style={{ padding: 0, marginLeft: 8 }}
                  >
                    注销其他会话
                  </Button>
                )}
              </Text>
            </div>
          }
          style={{ marginBottom: 16 }}
        />

        <List
          dataSource={sessions}
          renderItem={(session) => (
            <List.Item
              actions={[
                !session.current && (
                  <Button
                    key="revoke"
                    size="small"
                    onClick={() => revokeSession(session.id)}
                  >
                    注销
                  </Button>
                ),
              ]}
            >
              <List.Item.Meta
                avatar={
                  session.device.includes("Mobile") ? (
                    <GlobalOutlined />
                  ) : (
                    <LaptopOutlined />
                  )
                }
                title={
                  <Space>
                    <Text>{session.device}</Text>
                    <Text type="secondary">·</Text>
                    <Text>{session.browser}</Text>
                    {session.current && (
                      <>
                        <Text type="secondary">·</Text>
                        <Text type="success">当前会话</Text>
                      </>
                    )}
                  </Space>
                }
                description={
                  <Space>
                    <Text type="secondary">{session.location}</Text>
                    <Text type="secondary">·</Text>
                    <Text type="secondary">{session.ip}</Text>
                    <Text type="secondary">·</Text>
                    <Text type="secondary">
                      最后活跃：
                      {new Date(session.lastActive).toLocaleString(undefined, {
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