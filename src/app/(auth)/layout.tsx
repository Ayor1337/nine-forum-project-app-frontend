import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-dvw h-dvh flex justify-center items-center">
      <div className="bg-red-300 h-160 w-340 flex shadow-2xl">
        <div className="flex-1/3"></div>

        <div className="flex-2/3 bg-white flex justify-center items-center overflow-hidden relative">
          <div className="absolute top-3 left-3 flex items-center">
            <Link href="/forum">
              <Button type="link" color="lime">
                <ArrowLeftOutlined />
                <div>返回</div>
              </Button>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
