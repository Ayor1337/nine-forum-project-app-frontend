import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center gap-5 w-100" key="register">
      <div className="text-4xl mb-5">注册</div>
      <Input
        placeholder="请输入用户名"
        prefix={<UserOutlined />}
        size="large"
      />
      <Input placeholder="请输入密码" prefix={<LockOutlined />} size="large" />
      <Input
        placeholder="请再次输入密码"
        prefix={<LockOutlined />}
        size="large"
      />
      <Input
        placeholder="请输入邮箱，用于找回密码"
        prefix={<MailOutlined />}
        size="large"
      />

      <Button type="primary" size="large" className="w-full">
        注册
      </Button>
      <Link href="/login">
        <Button type="link" size="large" className="w-full">
          已有账号？前往登录
        </Button>
      </Link>
    </div>
  );
}
