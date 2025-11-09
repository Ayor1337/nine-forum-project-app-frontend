"use client";

import { getImageUrl } from "@/axios/ImageService";
import { formatDate } from "@/func/DateConvert";
import { quillToHTML } from "@/func/QuillToHTML";
import { Image, Tag } from "antd";
import { usePathname, useRouter } from "next/navigation";
import EditTool from "./ThreadActions";
import { useAuth } from "@/components/AuthProvider";
import {
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
} from "@ant-design/icons";
import React from "react";
import SwipeableRow from "@/components/ui/SwipeableCard";

export default function ThreadItem({ thread }: { thread: Thread }) {
  const pathname = usePathname();
  const router = useRouter();
  const { permissionVerify } = useAuth();

  return (
    <div>
      <SwipeableRow
        actions={
          <EditTool thread={thread} topicId={thread.topicId} tag={thread.tag} />
        }
        actionWidth={300}
        canSwipe={permissionVerify("", thread.topicId)}
        className="overflow-hidden"
      >
        {/* ====== 下面保持你原来的内容结构，仅把整个卡片作为 children 传入 ====== */}
        <div className="relative flex flex-col gap-3">
          {/* UserInfo Start */}
          <div
            className="flex items-center px-3 pt-3 cursor-pointer group"
            onClick={() => {
              router.push(`/space/${thread.accountId}`);
            }}
          >
            {/* 头像 */}
            <img
              className="size-12 rounded-full object-cover"
              src={getImageUrl(thread.avatarUrl)}
            />
            {/* 名称与时间 */}
            <div className="ml-2 leading-tight">
              <div className="font-medium text-neutral-900 group-hover:text-blue-600">
                {thread.accountName}
              </div>
              <div className="text-xs text-neutral-500 group-hover:text-blue-600">
                {formatDate(thread.createTime)}
              </div>
            </div>
          </div>

          {/* 标题 + 标签 */}
          <div
            className="group px-3 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`${pathname}/${thread.threadId}`);
            }}
          >
            <div className="flex items-center">
              {thread.tag.tagId && <Tag>{thread.tag.tag}</Tag>}
              <div className="text-lg font-semibold text-neutral-900 group-hover:text-blue-600 transition line-clamp-1">
                {thread.title}
              </div>
            </div>

            {/* 摘要 */}
            <div className="flex flex-col gap-3">
              <div
                className="text-sm text-neutral-700 leading-6 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: quillToHTML(thread.content),
                }}
              />
            </div>
          </div>

          {/* 图片区 */}
          <div className="grid grid-cols-3 gap-4 px-3">
            {thread.imageUrls.map((url) => (
              <Image
                src={getImageUrl(url)}
                key={url}
                className="max-h-30 object-cover"
                preview={{
                  zIndex: 101,
                  mask: (
                    <>
                      <EyeOutlined /> <span className="ml-1">预览</span>
                    </>
                  ),
                }}
              />
            ))}
          </div>

          {/* 统计区 */}
          <div className="flex self-end gap-5 px-10 items-center pb-3">
            <div className="flex gap-1 items-center">
              <EyeOutlined />
              <div>{thread.viewCount}</div>
            </div>
            <div className="flex gap-1 items-center">
              <MessageOutlined />
              <div>{thread.postCount}</div>
            </div>
            <div className="flex gap-1 items-center">
              <LikeOutlined />
              <div>{thread.likeCount}</div>
            </div>
            <div className="flex gap-1 items-center">
              <StarOutlined />
              <div>{thread.collectCount}</div>
            </div>
          </div>
        </div>
        {/* ====== /原内容 ====== */}
      </SwipeableRow>
    </div>
  );
}
