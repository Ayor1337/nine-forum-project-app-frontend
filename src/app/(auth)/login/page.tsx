"use client";

import { useAuth } from "@/components/AuthProvider";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="flex flex-col items-center gap-5 w-100" key="login">
      <div className="text-4xl mb-5">登录</div>
      {/* 登录表单 start */}
      <Form className="w-full" onFinish={login}>
        <Form.Item<FormType> name="username">
          <Input
            placeholder="请输入账号/邮箱"
            prefix={<UserOutlined />}
            size="large"
          />
        </Form.Item>
        <Form.Item<FormType> name="password">
          <Input.Password
            placeholder="请输入密码"
            prefix={<LockOutlined />}
            size="large"
          />
        </Form.Item>
        <Form.Item<FormType>>
          <Button
            type="primary"
            size="large"
            className="w-full"
            htmlType="submit"
          >
            登录
          </Button>
        </Form.Item>
        <Form.Item>
          <Link href="/register">
            <Button type="link" size="large" className="w-full">
              没有账号？注册一个
            </Button>
          </Link>
        </Form.Item>
      </Form>
      {/* 登录表单 end */}
    </div>
  );
}
