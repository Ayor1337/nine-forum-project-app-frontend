"use client";

import { useState, useEffect } from "react";
import { Alert, Button, Form, Input, Space, Typography, App } from "antd";
import { LockOutlined, ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const LS_KEY = "security.passwordChangedAt";

export default function PasswordSection() {
  const { message, notification } = App.useApp();
  const [lastChangedAt, setLastChangedAt] = useState<string>("从未修改");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          setLastChangedAt(
            new Date(Number(raw)).toLocaleString(undefined, {
              hour12: false,
            })
          );
        }
      } catch {}
    }
  }, []);

  const onPasswordChange = ({
    current,
    next,
    confirm,
  }: {
    current: string;
    next: string;
    confirm: string;
  }) => {
    if (!next || next.length < 8) {
      message.error("新密码至少 8 位");
      return;
    }
    if (next !== confirm) {
      message.error("两次输入的新密码不一致");
      return;
    }
    try {
      localStorage.setItem(LS_KEY, String(Date.now()));
      notification.success({
        message: "密码已更新",
        description: "出于演示目的，未连接后端，仅本地记录。",
      });
      setLastChangedAt(
        new Date().toLocaleString(undefined, {
          hour12: false,
        })
      );
    } catch {
      message.error("写入本地存储失败");
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
              <Text>上次修改：{lastChangedAt}</Text>
            </div>
          }
          style={{ marginBottom: 16 }}
        />

        <Form
          layout="vertical"
          onFinish={(values) =>
            onPasswordChange({
              current: values.current,
              next: values.next,
              confirm: values.confirm,
            })
          }
        >
          <Form.Item name="current" label="当前密码">
            <Input.Password placeholder="当前密码（演示随意填）" />
          </Form.Item>
          <Form.Item
            name="next"
            label="新密码"
            rules={[{ required: true, message: "请输入新密码" }]}
          >
            <Input.Password placeholder="至少 8 位" />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="确认新密码"
            rules={[{ required: true, message: "请再次输入新密码" }]}
          >
            <Input.Password placeholder="再次输入新密码" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                更新密码
              </Button>
              <Button htmlType="reset" icon={<ReloadOutlined />}>
                重置表单
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </App>
  );
}