"use client";

import service from "@/axios";
import QuillTextBox from "@/components/ui/QuillTextBox";
import {
  CloseOutlined,
  RedoOutlined,
  UploadOutlined,
  UpOutlined,
  XOutlined,
} from "@ant-design/icons";
import { Button, Divider, Input } from "antd";
import useApp from "antd/es/app/useApp";
import { AnimatePresence, motion, px } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ThreadWrapperRef } from "./ThreadCard";

interface defineProps {
  topicId: string;
  refresh: () => void;
}

export default function PosterTool({ topicId, refresh }: defineProps) {
  const [isActive, setActive] = useState<boolean>(false);
  const [isScroll, setScroll] = useState<boolean>(false);
  const [title, setTitle] = useState<string>();
  const { message } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);

  const switchActive = (state: boolean) => {
    setActive(state);
  };

  const uploadThread = async (content: string | null) => {
    await service
      .post("/api/thread/post_thread", {
        topicId: topicId,
        content: content,
        title: title,
      })
      .then((res) => {
        if (res.data.code == 200) {
          message.info("发送成功");
          setTitle("");
          Promise.all;
          refresh();
          setActive(false);
        } else {
          message.warning(res.data.message);
          Promise.reject;
        }
      });
  };

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 800) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  });

  return (
    <div>
      {/* bg mask start  */}
      <AnimatePresence mode="sync" initial={false}>
        <Button type="link" />
        <motion.div
          key="mask"
          animate={{ opacity: isActive ? 100 : 0 }}
          className="fixed -left-1000 -top-1000 size-10000 bg-neutral-800/25  backdrop-blur-sm"
          style={{ pointerEvents: isActive ? "auto" : "none" }}
          onClick={() => switchActive(false)}
        />
      </AnimatePresence>
      {/* bg mask end  */}
      {/* upload start */}
      <AnimatePresence mode="sync" initial={false}>
        <div className="relative" key="upload-menu">
          <motion.div
            className="absolute top-0 bg-gradient-to-br from-slate-100 to-white shadow-xl z-100"
            ref={containerRef}
            onClick={() => switchActive(true)}
            animate={{
              width: isActive ? 1300 : 40,
              height: isActive ? 406 : 40,
              borderRadius: isActive ? "20px" : "100px",
              y: isActive ? -160 : 0,
              cursor: isActive ? "auto" : "pointer",
            }}
            onAnimationComplete={() => {
              if (containerRef.current) {
                if (isActive) {
                  containerRef.current.style.height = "auto";
                } else {
                  containerRef.current.style.height = "40px";
                }
              }
            }}
          >
            <div className="relative size-full">
              {isActive ? (
                // 发送帖子输入框 start
                <AnimatePresence initial={true} mode="sync">
                  <motion.div
                    key="textBox"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: isActive ? 100 : 0,
                    }}
                    transition={{ duration: 0.75, delay: 0.15 }}
                  >
                    <div
                      className="absolute right-4 top-4 cursor-pointer size-7 justify-center items-center transition-all  rounded-full hover:bg-neutral-200"
                      style={{ display: isActive ? "flex" : "none" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        switchActive(false);
                      }}
                    >
                      <div>
                        <CloseOutlined />
                      </div>
                    </div>
                    <div className="px-3 py-4">
                      <div className="text-xl text-slate-600">发个帖子</div>
                      <Divider size="small" />
                      <div className="flex flex-col">
                        <div className="mb-2 text-lg">标题</div>
                        <Input
                          value={title}
                          onChange={(t) => setTitle(t.target.value)}
                        />
                        <Divider size="middle" />
                        <QuillTextBox onFinish={uploadThread} />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                // 发送帖子输入框 end
                <div className="absolute top-1/2 left-1/2 -translate-1/2">
                  <UploadOutlined />
                </div>
              )}
            </div>
          </motion.div>
        </div>
        <div className="relative">
          <div
            className="absolute top-[50px] bg-gradient-to-br from-slate-100 to-white shadow-xl z-99 rounded-full cursor-pointer size-[40px]"
            onClick={() => refresh()}
          >
            <div className="absolute top-1/2 left-1/2 -translate-1/2">
              <RedoOutlined />
            </div>
          </div>
        </div>
        <div className="relative" key="elevator">
          <motion.div
            className="absolute bg-gradient-to-br from-slate-100 to-white shadow-xl rounded-full cursor-pointer"
            onClick={() => {
              scrollTo({ top: 0, behavior: "smooth" });
            }}
            animate={{
              width: isScroll ? 40 : 0,
              height: isScroll ? 40 : 0,
              x: isScroll ? 0 : 17,
              y: isScroll ? 100 : 50,
              opacity: isScroll ? 1 : 0,
            }}
            transition={{
              duration: 0.4,
              type: "spring",
              ease: ["easeInOut"],
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-1/2">
              <UpOutlined />
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
      {/* upload end */}
    </div>
  );
}
