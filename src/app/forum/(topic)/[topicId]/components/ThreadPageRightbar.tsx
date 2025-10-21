"use client";

import { useAuth } from "@/components/AuthProvider";
import { Button, Divider } from "antd";
import { useState } from "react";

export default function ThreadPageRightbar() {
  const [isDrawOpen, setDrawOpen] = useState<boolean>(true);
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
        <div className="rounded-xl shadow-md bg-white  p-5">
          {/* 标题 */}
          <div className="text-lg font-semibold text-neutral-800 ">
            论坛公告
          </div>

          <Divider className="my-3" />

          {/* 内容 */}
          <div className="text-sm text-neutral-600 leading-relaxed">待完善</div>
        </div>
      </div>
      {/* RightCard End */}
    </>
  );
}
