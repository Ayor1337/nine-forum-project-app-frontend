"use client";

import service from "@/axios";
import { Avatar, Divider, Popconfirm } from "antd";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { formatDate } from "@/func/DateConvert";
import PostItem from "./PostItem";
import { quillToHTML } from "@/func/QuillToHTML";
import { getImageUrl } from "@/axios/ImageService";
import { usePathname, useRouter } from "next/navigation";
import {
  DeleteOutlined,
  EditOutlined,
  LikeFilled,
  LikeOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/components/AuthProvider";
import useApp from "antd/es/app/useApp";

interface DefineProps {
  threadId: string;
}

// 父组件能拿到的ref类型
export interface PostWrapperRef {
  refresh: () => Promise<void>;
}
const PostCard = forwardRef<PostWrapperRef, DefineProps>(
  ({ threadId }, ref) => {
    const [thread, setThread] = useState<Thread>();
    const [posts, setPosts] = useState<Array<Post>>();
    const [isLike, setLike] = useState<Boolean>(false);
    const [isCollect, setCollect] = useState<Boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [collectCount, setCollectCount] = useState<number>(0);
    const { currentUser } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { message } = useApp();

    const fetchThreadById = useCallback(async (threadId: number) => {
      await service
        .get(`/api/thread/info`, {
          params: {
            thread_id: threadId,
          },
        })
        .then((res) => {
          if (res.data.code == 200) {
            setThread(res.data.data);
          }
        });
    }, []);

    const fetchPostsByThreadId = useCallback(async (threadId: number) => {
      await service
        .get(`/api/post/info/thread`, {
          params: {
            thread_id: threadId,
          },
        })
        .then((res) => {
          if (res.data.code == 200) {
            setPosts(res.data.data);
          }
        });
    }, []);

    const likeThread = async () => {
      await service
        .post(
          `/api/like/like_thread`,
          {},
          {
            params: {
              thread_id: threadId,
            },
          }
        )
        .then((res) => {
          if (res.data.code == 200) {
            fetchIsLikeByThreadId();
            fetchLikeCountByThreadId();
          } else {
            message.warning(res.data.message);
          }
        });
    };

    const collectThread = async () => {
      await service
        .post(
          `/api/collect/collect_thread`,
          {},
          {
            params: {
              thread_id: threadId,
            },
          }
        )
        .then((res) => {
          if (res.data.code == 200) {
            fetchCollectCountByThreadId();
            fetchIsCollectByThreadId();
          } else {
            message.warning(res.data.message);
          }
        });
    };

    const unlikeThread = async () => {
      await service
        .post(
          `/api/like/unlike_thread`,
          {},
          {
            params: {
              thread_id: threadId,
            },
          }
        )
        .then((res) => {
          if (res.data.code == 200) {
            fetchIsLikeByThreadId();
            fetchLikeCountByThreadId();
          } else {
            message.warning(res.data.message);
          }
        });
    };

    const uncollectThread = async () => {
      await service
        .post(
          `/api/collect/uncollect_thread`,
          {},
          {
            params: {
              thread_id: threadId,
            },
          }
        )
        .then((res) => {
          if (res.data.code == 200) {
            fetchCollectCountByThreadId();
            fetchIsCollectByThreadId();
          }
        });
    };

    const fetchIsLikeByThreadId = async () => {
      await service
        .get(`/api/like/is_like`, {
          params: {
            thread_id: threadId,
          },
        })
        .then((res) => {
          if (res.data.code == 200) {
            setLike(res.data.data);
          }
        });
    };

    const fetchIsCollectByThreadId = async () => {
      await service
        .get(`/api/collect/is_collect`, {
          params: {
            thread_id: threadId,
          },
        })
        .then((res) => {
          if (res.data.code == 200) {
            setCollect(res.data.data);
          }
        });
    };

    const fetchLikeCountByThreadId = async () => {
      await service
        .get(`/api/like/get_like_count`, {
          params: {
            thread_id: threadId,
          },
        })
        .then((res) => {
          if (res.data.code == 200) {
            setLikeCount(res.data.data);
          }
        });
    };

    const fetchCollectCountByThreadId = async () => {
      await service
        .get(`/api/collect/get_collect_count`, {
          params: {
            thread_id: threadId,
          },
        })
        .then((res) => {
          setCollectCount(res.data.data);
        });
    };

    const removeThread = async () => {
      await service
        .delete(`/api/thread/remove_thread`, {
          params: {
            thread_id: threadId,
          },
        })
        .then((res) => {
          if (res.data.code == 200) {
            message.info("删除成功");
            router.push(pathname.substring(0, pathname.lastIndexOf("/")));
          } else {
            message.warning(res.data.message);
          }
        });
    };

    const refreshHandler = useCallback(async () => {
      const idNum = Number(threadId);
      if (!isNaN(idNum)) {
        await Promise.all([
          fetchThreadById(idNum),
          fetchPostsByThreadId(idNum),
        ]);
      }
    }, [threadId, fetchThreadById, fetchPostsByThreadId]);

    useImperativeHandle(
      ref,
      () => ({
        refresh: refreshHandler,
      }),
      [refreshHandler]
    );

    useEffect(() => {
      if (!isNaN(Number(threadId))) {
        fetchThreadById(Number(threadId));
        fetchPostsByThreadId(Number(threadId));
        fetchIsLikeByThreadId();
        fetchLikeCountByThreadId();
        fetchIsCollectByThreadId();
        fetchCollectCountByThreadId();
      }
    }, []);

    return (
      <>
        {/* Post Reply Start  */}
        <div className="rounded-2xl border border-black/5 bg-white shadow-lg mt-4 overflow-hidden">
          {/* Post Header Start */}
          {thread && (
            <div className="px-5 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white">
              <div className="flex items-center h-[40px]">
                <div className="w-[200px] flex gap-3 justify-center text-sm">
                  <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                    查看
                    <span className="font-semibold">{thread?.viewCount}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                    回复
                    <span className="font-semibold">{thread?.postCount}</span>
                  </div>
                </div>
                <div className="font-bold text-[18px] tracking-wide">
                  {thread?.title}
                </div>
                {thread.accountId == currentUser?.accountId ? (
                  <div className="ml-auto mr-5 flex gap-3">
                    {isLike ? (
                      <div
                        className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/40 transition cursor-pointer backdrop-blur-sm"
                        onClick={() => unlikeThread()}
                      >
                        <LikeFilled />
                        <span className="ml-1">{likeCount}</span>
                      </div>
                    ) : (
                      <div
                        className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/40 transition cursor-pointer backdrop-blur-sm"
                        onClick={() => likeThread()}
                      >
                        <LikeOutlined />
                        <span className="ml-1">{likeCount}</span>
                      </div>
                    )}
                    <div className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/40 transition cursor-pointer backdrop-blur-sm">
                      <EditOutlined />
                    </div>
                    <Popconfirm
                      title="确认删除"
                      okText="确定"
                      cancelText="不要"
                      onConfirm={removeThread}
                    >
                      <div className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/40 transition cursor-pointer backdrop-blur-sm">
                        <DeleteOutlined />
                      </div>
                    </Popconfirm>
                  </div>
                ) : (
                  <div className="ml-auto mr-5 flex gap-3">
                    {isLike ? (
                      <div
                        className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/40 transition cursor-pointer backdrop-blur-sm"
                        onClick={() => unlikeThread()}
                      >
                        <LikeFilled />
                        <span className="ml-1">{likeCount}</span>
                      </div>
                    ) : (
                      <div
                        className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/40 transition cursor-pointer backdrop-blur-sm"
                        onClick={() => likeThread()}
                      >
                        <LikeOutlined />
                        <span className="ml-1">{likeCount}</span>
                      </div>
                    )}
                    {isCollect ? (
                      <div
                        className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/40 transition cursor-pointer backdrop-blur-sm"
                        onClick={() => uncollectThread()}
                      >
                        <StarFilled />
                        <span className="ml-1">{collectCount}</span>
                      </div>
                    ) : (
                      <div
                        className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/40 transition cursor-pointer backdrop-blur-sm"
                        onClick={() => collectThread()}
                      >
                        <StarOutlined />
                        <span className="ml-1">{collectCount}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Post Header End */}

          <Divider className="!my-0" />

          {/* Message Box Start */}
          {thread ? (
            <>
              <div className="px-4 py-3">
                <div className="flex px-1 py-2 rounded-lg">
                  {/* 左侧：用户信息区（固定宽度，不自适应） */}
                  <div className="w-[200px] flex flex-col items-center gap-3">
                    <Avatar
                      size={64}
                      src={getImageUrl(thread.avatarUrl)}
                      onClick={() => router.push(`/space/${thread.accountId}`)}
                      className="cursor-pointer"
                    />
                    <div className="text-[18px] font-medium text-neutral-800">
                      {thread.accountName}
                    </div>
                  </div>

                  {/* 右侧：正文 */}
                  <div className="flex-1 flex flex-col justify-between pr-10 leading-7 text-[15px] text-neutral-800">
                    <div
                      className="whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html: quillToHTML(thread.content),
                      }}
                    ></div>

                    <div className="flex items-center justify-between text-sm mt-5">
                      <div className="text-gray-500">
                        {formatDate(thread.createTime)}
                      </div>
                      <div className="text-violet-600 hover:underline cursor-pointer">
                        回复
                      </div>
                    </div>
                  </div>
                </div>

                <Divider className="!my-4" />
              </div>
            </>
          ) : (
            ""
          )}

          {/* Message Box End */}
          {posts?.map((pm) => (
            <PostItem
              post={pm}
              key={pm.postId}
              handleRefresh={() => fetchPostsByThreadId(Number(threadId))}
            />
          ))}
        </div>
        {/* Post Reply End  */}
      </>
    );
  }
);

export default PostCard;
