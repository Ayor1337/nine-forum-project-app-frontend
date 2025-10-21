"use client";

import { Button, Divider } from "antd";
import { useState } from "react";
import TopicManager from "./admin/TopicManager";
import { useAuth } from "@/components/AuthProvider";

export default function ForumPageRightbar() {
  const [isDrawOpen, setDrawOpen] = useState<boolean>(false);
  const { permissionVerify } = useAuth();

  const handleDrawOpen = () => {
    setDrawOpen(true);
  };

  const handleDrawClose = () => {
    setDrawOpen(false);
  };

  return (
    <>
      {/* RightCard Start */}
      <div className="basis-1/4 grow-0 flex flex-col gap-5">
        <div className="rounded-xl shadow-md bg-white p-5">
          {/* 标题 */}
          <div className="text-lg font-semibold text-neutral-800 ">
            论坛公告
          </div>
          <Divider className="my-3" />
          {/* 内容 */}
          <div className="text-sm text-neutral-600 leading-relaxed">
            待完善
          </div>
        </div>

        {permissionVerify() && (
          <div className="rounded-xl shadow-md bg-white p-5">
            {/* 标题 */}
            <div className="text-lg font-semibold text-neutral-800 ">
              论坛管理
            </div>
            <Divider className="my-3" />
            {/* 内容 */}
            <div className="text-sm text-neutral-600 leading-relaxed">
              <div className="flex">
                <Button onClick={handleDrawOpen}>管理主题</Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* RightCard End */}

      {permissionVerify() && (
        <TopicManager isOpen={isDrawOpen} closeDraw={handleDrawClose} />
      )}
    </>
  );
}
