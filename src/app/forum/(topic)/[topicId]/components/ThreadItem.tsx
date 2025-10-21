"use client";

import { getImageUrl } from "@/axios/ImageService";
import { formatDate } from "@/func/DateConvert";
import { quillToHTML } from "@/func/QuillToHTML";
import { Image, Tag } from "antd";
import { usePathname, useRouter } from "next/navigation";
import EditTool from "./EditTool";
import { useAuth } from "@/components/AuthProvider";
import {
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
} from "@ant-design/icons";

export default function ThreadItem({ thread }: { thread: Thread }) {
  const pathname = usePathname();
  const router = useRouter();
  const { permissionVerify } = useAuth();

  return (
    <>
      <div>
        <div className="relative flex flex-col gap-3  rounded-lg  ">
          {/* UserInfo Start */}
          <div
            className=" flex items-center px-3 pt-3 cursor-pointer group"
            onClick={() => {
              router.push(`/space/${thread.accountId}`);
            }}
          >
            {/* 用户头像 start */}
            <img
              className="size-12 rounded-full object-cover"
              src={getImageUrl(thread.avatarUrl)}
            ></img>
            {/* 用户头像 end */}

            {/* 用户名 start */}
            <div className="ml-2 leading-tight ">
              <div className="font-medium text-neutral-900 group-hover:text-blue-600">
                {thread.accountName}
              </div>
              <div className="text-xs text-neutral-500 group-hover:text-blue-600">
                {formatDate(thread.createTime)}
              </div>
            </div>
            {/* 用户名 end */}

            {/* 管理工具 start  */}
            {permissionVerify("", thread.topicId) && (
              <EditTool
                topicId={thread.topicId}
                tag={thread.tag}
                thread={thread}
              />
            )}

            {/* 管理工具 end  */}
          </div>
          {/* 标题 */}
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

            {/* 摘要 + 图片 */}
            <div className="flex flex-col gap-3">
              <div
                className="text-sm text-neutral-700 leading-6 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: quillToHTML(thread.content),
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 px-3">
            {thread.imageUrls.map((url) => (
              <Image
                src={getImageUrl(url)}
                key={url}
                className="max-h-30 object-cover "
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
          <div className="flex self-end gap-5 px-10 items-center">
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
      </div>
    </>
  );
}
