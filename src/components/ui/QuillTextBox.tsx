"use client";

import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // 记得引入样式
import "./style/quill.css";
import { useRouter } from "next/navigation";
import useApp from "antd/es/app/useApp";

interface defineProps {
  onFinish: (content: string | null) => Promise<void>;
}

export default function QuillTextBox({ onFinish }: defineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const { message } = useApp();
  const router = useRouter();

  const resetContent = () => {
    if (quillRef.current) {
      quillRef.current.setContents([]);
      setContent(null);
    }
  };

  useEffect(() => {
    if (containerRef.current && !quillRef.current) {
      quillRef.current = new Quill(containerRef.current, {
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

      quillRef.current.on("text-change", () => {
        const delta = quillRef.current?.getContents();
        setContent(JSON.stringify(delta));
      });
    }

    return () => {
      if (quillRef) {
        rootRef.current?.remove();
      }
    };
  }, []);

  return (
    <div ref={rootRef}>
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
