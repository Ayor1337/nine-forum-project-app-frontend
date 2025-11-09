"use client";

import { useState } from "react";
import { Tabs, App } from "antd";
import ActivitySection from "./components/ActivitySection";
import PasswordSection from "./components/PasswordSection";
import PrivacySection from "./components/PrivacySection";
import SessionsSection from "./components/SessionsSection";
import TwoFactorSection from "./components/TwoFactorSection";

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
    <div>
      <div className="w-[1200px] mx-auto py-8 px-4">
        <div className="bg-white">
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
  );
}
