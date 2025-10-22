"use client";

import { useState, useEffect } from "react";
import { Alert, Button, Space, Typography, App } from "antd";
import { QrcodeOutlined, ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const LS_KEY = "security.twoFactorEnabled";

export default function TwoFactorSection() {
  const { message, notification } = App.useApp();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          setEnabled(raw === "true");
        }
      } catch {}
    }
  }, []);

  const onToggle = () => {
    try {
      localStorage.setItem(LS_KEY, String(!enabled));
      notification.success({
        message: !enabled ? "已启用两步验证" : "已禁用两步验证",
        description: "出于演示目的，未连接后端，仅本地记录。",
      });
      setEnabled(!enabled);
    } catch {
      message.error("写入本地存储失败");
    }
  };

  const onReset = () => {
    message.success("已重置两步验证");
  };

  return (
    <App>
      <div>
        <Alert
          type={enabled ? "success" : "warning"}
          showIcon
          message={
            <div className="flex items-center gap-2">
              <Text>当前状态：{enabled ? "已启用" : "未启用"}</Text>
            </div>
          }
          style={{ marginBottom: 16 }}
        />

        {enabled ? (
          <div>
            <Alert
              type="info"
              icon={<QrcodeOutlined />}
              message="扫描二维码"
              description={
                <div className="mt-4">
                  <div
                    className="bg-gray-200 w-48 h-48 flex items-center justify-center"
                    style={{ marginBottom: 16 }}
                  >
                    <Text type="secondary">二维码占位图</Text>
                  </div>
                  <Text type="secondary">
                    使用 Google Authenticator 或其他两步验证 App
                    扫描上方二维码，完成设置。
                  </Text>
                </div>
              }
              style={{ marginBottom: 16 }}
            />

            <Space>
              <Button danger onClick={onToggle}>
                禁用两步验证
              </Button>
              <Button onClick={onReset} icon={<ReloadOutlined />}>
                重置两步验证
              </Button>
            </Space>
          </div>
        ) : (
          <Button type="primary" onClick={onToggle}>
            启用两步验证
          </Button>
        )}
      </div>
    </App>
  );
}