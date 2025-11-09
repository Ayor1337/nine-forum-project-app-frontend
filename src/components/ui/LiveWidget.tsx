"use client";

import React, { useEffect, useRef, useState } from "react";
import { useResourceTracker } from "@/func/ResourceTracker";

const LIVE2D_BASE = "/live2d_widget/";

// 简单的消息结构
type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function loadExternalResource(
  tracker: ReturnType<typeof useResourceTracker>,
  url: string,
  type: string
) {
  return new Promise((resolve, reject) => {
    try {
      if (type === "css") {
        const l = tracker.addLink(url, "stylesheet");
        l.onload = () => resolve(url);
        l.onerror = () => reject(url);
      } else if (type === "js") {
        // 经典脚本
        const s = tracker.addScript(url);
        s.onload = () => resolve(url);
        s.onerror = () => reject(url);
      } else if (type === "module") {
        // ES Module 脚本，用于包含 export 的第三方文件
        const s = tracker.addScript(url, { type: "module" });
        s.onload = () => resolve(url);
        s.onerror = () => reject(url);
      } else {
        reject(new Error(`Unsupported type: ${type}`));
      }
    } catch (e) {
      reject(e);
    }
  });
}

export default function Live2DLangChainChat() {
  const tracker = useResourceTracker();
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "init",
      role: "assistant",
      content: "我是驻场看板娘，有啥想问的就说～",
    },
  ]);
  const initedRef = useRef(false);

  // 1) 初始化 Live2D（注意加载顺序：CSS -> live2d.min.js -> waifu-tips.js -> initWidget）
  useEffect(() => {
    if (typeof window === "undefined") return;

    (async () => {
      try {
        await loadExternalResource(tracker, LIVE2D_BASE + "waifu.css", "css");
        await loadExternalResource(
          tracker,
          LIVE2D_BASE + "live2d.min.js",
          "js"
        );
        await loadExternalResource(
          tracker,
          LIVE2D_BASE + "waifu-tips.js",
          "module"
        );

        // 进入页面前清理可能残留的附加工具/提示节点，避免重复初始化冲突
        // [".waifu-tool", ".waifu-tips", "#waifu-toggle"].forEach((sel) => {
        //   document.querySelectorAll(sel).forEach((el) => el.remove());
        // });

        // 有些版本把 initWidget 挂到 window 上
        (window as any).initWidget?.({
          waifuPath: `${LIVE2D_BASE}waifu-tips.json`,
          cubism2Path: `${LIVE2D_BASE}live2d.min.js`,
          cubism5Path:
            "https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js",
          tools: ["chat", "settings", "quit"],
        });

        initedRef.current = true;
      } catch (err) {
        console.error("init live2d failed:", err);
      }
    })();

    return () => {
      // 清理由第三方脚本插入到 body 的节点（具体移除动作在 hook 中完成）
    };
  }, []);

  return (
    <>
      {/* Live2D 容器（保持和原项目一致） */}
      <div id="waifu-toggle"></div>
      <div id="waifu">
        {/* <div id="waifu-tips"></div> */}
        <div id="waifu-canvas">
          <canvas id="live2d" width={800} height={800}></canvas>
        </div>
        <div id="waifu-tool"></div>
      </div>
    </>
  );
}
