"use client";

import { getImageUrl } from "@/axios/ImageService";
import { formatDate } from "@/func/DateConvert";
import { quillToHTML } from "@/func/QuillToHTML";
import { Avatar, Divider } from "antd";
import { useRouter } from "next/navigation";

export default function PostItem({ post }: { post: Post }) {
  const router = useRouter();
  return (
    <>
      <div className="px-4 py-3">
        <div className="flex px-1 py-2 rounded-lg ">
          {/* 左侧：用户信息区（固定宽度，不自适应） */}
          <div className="w-[200px] flex flex-col items-center gap-3 ">
            <Avatar
              size={64}
              src={getImageUrl(post.avatarUrl)}
              onClick={() => router.push(`/space/${post.accountId}`)}
              className="cursor-pointer"
            />
            <div className="text-[18px] font-medium text-neutral-800">
              {post.nickname}
            </div>
          </div>

          {/* 右侧：正文 */}
          <div className="flex-1 flex flex-col justify-between pr-10 leading-7 text-[15px] text-neutral-800">
            <div
              className="whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: quillToHTML(post.content) }}
            ></div>

            <div className="flex items-center justify-between text-sm mt-5">
              <div className="text-gray-500">{formatDate(post.createTime)}</div>
              <div className="text-violet-600 hover:underline cursor-pointer">
                回复
              </div>
            </div>
          </div>
        </div>

        <Divider className="!my-4" />
      </div>
    </>
  );
}
