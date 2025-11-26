"use client";

import request from "@/api/request";
import { getImageUrl } from "@/api/utils/image";
import { useAuth } from "@/components/AuthProvider";
import { formatDate } from "@/func/DateConvert";
import { quillToHTML } from "@/func/QuillToHTML";
import { Avatar, Divider, Popconfirm } from "antd";
import useApp from "antd/es/app/useApp";
import { useRouter } from "next/navigation";

interface defineProps {
  post: Post;
  handleRefresh: () => void;
}

export default function PostItem({ post, handleRefresh }: defineProps) {
  const router = useRouter();
  const { currentUser, permissionVerify } = useAuth();
  const { message } = useApp();

  const isDeleteShow = () => {
    if (currentUser?.accountId == post.accountId) {
      return true;
    }
    return permissionVerify("", post.topicId);
  };

  const handleRemove = () => {
    if (permissionVerify("", post.topicId)) {
      removePost();
    } else {
      removePostPerm();
    }
  };

  const removePost = async () => {
    await request
      .delete(`/api/post/delete`, {
        params: {
          post_id: post.postId,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          message.info("删除成功");
          handleRefresh();
        } else {
          message.warning(res.data.message);
        }
      });
  };

  const removePostPerm = async () => {
    await request
      .delete(`/api/post/perm/delete`, {
        params: {
          post_id: post.postId,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          message.info("删除成功");
        } else {
          message.warning(res.data.message);
        }
      });
  };

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
              <div className="flex gap-5">
                {isDeleteShow() && (
                  <div>
                    <Popconfirm
                      title="确定删除吗？"
                      okText="确定"
                      cancelText="取消"
                      onConfirm={handleRemove}
                    >
                      <div className="text-violet-600 hover:underline cursor-pointer">
                        删除
                      </div>
                    </Popconfirm>
                  </div>
                )}
                <div className="text-violet-600 hover:underline cursor-pointer">
                  回复
                </div>
              </div>
            </div>
          </div>
        </div>

        <Divider className="!my-4" />
      </div>
    </>
  );
}
