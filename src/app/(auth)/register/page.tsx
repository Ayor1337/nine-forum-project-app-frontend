"use client";

import { register, registerVerify } from "@/api/auth";
import { MailOutlined } from "@ant-design/icons";
import { Client, IMessage } from "@stomp/stompjs";
import { Button, Form, Input, Result, Steps } from "antd";
import useApp from "antd/es/app/useApp";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const [current, setCurrent] = useState(0);
  const [token, setToken] = useState("");
  const [client, setClient] = useState<Client | null>(null);
  const [uuid, setUuid] = useState<string>("");
  const router = useRouter();
  const { message } = useApp();

  const stepItems = [
    {
      title: "填写邮箱",
    },
    {
      title: "邮箱验证",
    },
    {
      title: "注册",
    },
  ];
  const handleRegisterVerify = async (values: any) => {
    await registerVerify(values.email).then((res) => {
      if (res.data.code == 200) {
        setUuid(res.data.data);
        setCurrent(1);
      }
    });
  };

  const handleRegister = async (values: any) => {
    if (token == null || token == "") {
      return;
    }
    await register({
      username: values.username,
      nickname: values.nickname,
      password: values.password,
      email: values.email,
      token: token,
    }).then((res) => {
      if (res.data.code == 200) {
        message.success("注册成功");
        router.push("/login");
      } else {
        message.warning(res.data.message);
      }
    });
  };

  useEffect(() => {
    const client = new Client({
      brokerURL: `ws://${process.env.NEXT_PUBLIC_WS_URL}/system`,
      reconnectDelay: 2000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setClient(client);
        client.subscribe(`/verify/${uuid}`, (message: IMessage) => {
          const data: VeifyMessage = JSON.parse(message.body);
          if (data.isVerified) {
            setToken(data.token);
            setCurrent(2);
          }
        });
      },
    });

    if (uuid) {
      client.activate();
    }
  }, [uuid]);

  return (
    <div
      className="flex flex-col h-120 items-center gap-5 w-110"
      key="register"
    >
      <Steps items={stepItems} current={current} className="flex-1/5 " />
      {current == 0 && (
        <div className="flex-4/5 w-full">
          <div className="text-4xl text-center mb-5">注册</div>
          <Form className="w-full" onFinish={handleRegisterVerify}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "不能为空" },
                {
                  type: "email",
                  message: "请输入正确的邮箱",
                },
              ]}
            >
              <Input
                placeholder="请输入邮箱, 用于注册"
                prefix={<MailOutlined />}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                注册
              </Button>
            </Form.Item>
            <Form.Item>
              <Link href="/login">
                <Button type="link" className="w-full">
                  已有账号？前往登录
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </div>
      )}
      {current == 1 && (
        <div className="flex-4/5">
          <Result status="success" title="请检查邮箱" subTitle="已发送验证码" />
        </div>
      )}
      {current == 2 && (
        <div className="flex-4/5 w-full">
          <Form
            className="w-full"
            onFinish={handleRegister}
            labelCol={{ span: 4 }}
            labelAlign="right"
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                { required: true, message: "请输入用户名" },
                {
                  min: 4,
                  max: 16,
                  message: "用户名长度在4-16之间",
                },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "用户名只能包含字母、数字和下划线",
                },
              ]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="nickname"
              label="昵称"
              rules={[
                { required: true, message: "请输入名字" },
                {
                  min: 3,
                  max: 20,
                  message: "名字长度在6-16之间",
                },
              ]}
            >
              <Input placeholder="请输入昵称" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: "请输入密码" },
                {
                  min: 6,
                  max: 16,
                  message: "密码长度在6-16之间",
                },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "密码只能包含字母、数字和下划线",
                },
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
            <Form.Item
              name="repassword"
              label="确认密码"
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("两次密码输入不一致");
                  },
                }),
              ]}
            >
              <Input.Password placeholder="重复密码" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                注册
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
}
