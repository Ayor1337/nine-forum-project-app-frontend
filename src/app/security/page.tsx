"use client";

import { useState } from "react";
import { Tabs, App } from "antd";
import PasswordSection from "./components/PasswordSection";
import TwoFactorSection from "./components/TwoFactorSection";
import PrivacySection from "./components/PrivacySection";
import SessionsSection from "./components/SessionsSection";
import ActivitySection from "./components/ActivitySection";

const tabs = [
  {
    key: "password",
    label: "密码管理",
    children: <PasswordSection />,
  },
  {
    key: "2fa",
    label: "两步验证",
    children: <TwoFactorSection />,
  },
  {
    key: "privacy",
    label: "隐私设置",
     children: <PrivacySection />,
  },
  {
    key: "sessions",
    label: "会话管理",
    children: <SessionsSection />,
  },
  {
    key: "activity",
    label: "登录活动",
    children: <ActivitySection />,
  },
];

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState("password");

  return (
    <App>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              tabPosition="left"
              items={tabs}
              className="min-h-[600px]"
            />
          </div>
        </div>
      </div>
    </App>
  );
}