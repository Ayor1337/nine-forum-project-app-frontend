"use client";

import { useEffect, useRef } from "react";
import PostCard, { PostWrapperRef } from "./PostCard";
import ReplyBox from "@/components/ui/QuillTextBox";
import { Divider } from "antd";
import service from "@/axios";
import useApp from "antd/es/app/useApp";

export default function PostWrapper({ threadId }: { threadId: string }) {
  const postWrapperRef = useRef<PostWrapperRef>(null);
  const { message } = useApp();
  let viewTimer: NodeJS.Timeout;

  const updateDataHandler = async () => {
    await await postWrapperRef.current?.refresh();
  };

  const uploadPost = async (content: string | null) => {
    await service
      .post("/api/post/post", {
        content: content,
        threadId: threadId,
      })
      .then((res) => {
        if (res.data.code == 200) {
          message.info("发送成功");
          updateDataHandler();
          Promise.all;
        } else {
          Promise.reject;
          message.warning(res.data.message);
        }
      });
  };

  const viewThread = async () => {
    await service.post(
      `/api/thread/view`,
      {},
      {
        params: {
          thread_id: threadId,
        },
      }
    );
  };

  useEffect(() => {
    viewTimer = setTimeout(() => {
      viewThread();
    }, 3000);

    return () => {
      clearTimeout(viewTimer);
    };
  }, []);

  return (
    <>
      <PostCard threadId={threadId} ref={postWrapperRef} />

      <div className="min-h-50 w-full rounded-2xl border border-black/5 bg-white shadow-lg mt-5 px-5 py-3">
        <div className="text-xl">回复</div>
        <Divider size="small" />
        <div>
          <ReplyBox onFinish={uploadPost} />
        </div>
      </div>
    </>
  );
}
