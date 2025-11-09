"use client";

import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css"; // 记得引入样式
import "./style/quill.css";
import type Quill from "quill";

interface defineProps {
  onFinish: (content: string | null) => Promise<void>;
}

export default function QuillTextBox({ onFinish }: defineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const [content, setContent] = useState<string | null>(null);

  const resetContent = () => {
    if (quillRef.current) {
      quillRef.current.setContents([]);
      setContent(null);
    }
  };

  useEffect(() => {
    let mounted = true;
    let quillInstance: any;
    let handler: (() => void) | null = null;

    (async () => {
      const Quill = (await import("quill")).default;

      if (!mounted) return;
      if (containerRef.current && !quillRef.current) {
        quillInstance = new Quill(containerRef.current, {
          theme: "snow",
          placeholder: "写点什么吧...",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }, { size: [] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              ["image"],
            ],
          },
        });

        handler = () => {
          const delta = quillInstance.getContents();
          setContent(JSON.stringify(delta));
        };

        quillInstance.on("text-change", handler);
        quillRef.current = quillInstance;
      }
    })();

    return () => {
      // 不要自己删 DOM，交给 React
      mounted = false;
      if (quillInstance && handler) {
        quillInstance.off("text-change", handler);
      }
      quillRef.current = null;
    };
  }, []);

  return (
    <div>
      <div ref={containerRef} className="min-h-30" />
      <div className="flex gap-2 justify-end mt-2 mr-2">
        <div
          className="px-3 py-1 bg-blue-200 rounded-lg cursor-pointer"
          onClick={resetContent}
        >
          重置
        </div>
        <div
          className="px-3 py-1 bg-slate-200 rounded-lg cursor-pointer"
          onClick={() =>
            onFinish(content).then(() => {
              resetContent();
            })
          }
        >
          提交
        </div>
      </div>
    </div>
  );
}
