import service from "@/axios";
import { formatDate } from "@/func/DateConvert";
import { quillToHTML } from "@/func/QuillToHTML";
import { EyeOutlined, MessageOutlined, LikeOutlined } from "@ant-design/icons";
import { Select, Input, List, Tag, Pagination, Popconfirm } from "antd";
import useApp from "antd/es/app/useApp";
import Link from "next/link";
import { useEffect, useState } from "react";

interface defineProps {
  userId: string;
}

export default function LikesTab({ userId }: defineProps) {
  const [page, setPage] = useState(0);
  const pageSize = 1;
  const [likeThreadData, setLikeThreadData] = useState<PageEntity<Thread>>();
  const { message } = useApp();

  const fetchLikeThreadsByUserId = async () => {
    await service
      .get(`/api/like/get_likes`, {
        params: {
          user_id: userId,
          page: page,
          page_size: pageSize,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          setLikeThreadData(res.data.data);
        }
      });
  };

  const unlikeThread = async (threadId: number) => {
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
          message.info("取消点赞成功");
          fetchLikeThreadsByUserId();
        } else {
          message.warning(res.data.message);
        }
      });
  };

  useEffect(() => {
    fetchLikeThreadsByUserId();
  }, [page]);

  useEffect(() => {
    fetchLikeThreadsByUserId;
  }, [page]);

  return (
    <>
      <div>
        <div className="mb-4 flex flex-wrap gap-2">
          <Select
            placeholder="按板块筛选"
            style={{ width: 160 }}
            options={[
              { value: "all", label: "全部板块" },
              { value: "qa", label: "问答" },
              { value: "share", label: "分享" },
              { value: "announce", label: "公告" },
            ]}
          />
          <Select
            placeholder="排序方式"
            defaultValue={"new"}
            style={{ width: 160 }}
            options={[
              { value: "new", label: "最新发布" },
              { value: "hot", label: "最热" },
              { value: "reply", label: "最近回复" },
            ]}
          />
          <Input.Search
            placeholder="搜索我的帖子"
            className="max-w-[260px]"
            onSearch={(v) => {
              // TODO: 触发搜索
              console.log("search:", v);
            }}
          />
        </div>

        <List
          itemLayout="horizontal"
          dataSource={likeThreadData?.data}
          renderItem={(thread) => (
            <List.Item
              actions={[
                <Popconfirm
                  okText="确认"
                  cancelText="取消"
                  onConfirm={() => unlikeThread(thread.threadId)}
                  title="取消点赞"
                >
                  <a key="unlike">取消点赞</a>
                </Popconfirm>,
              ]}
              key={thread.threadId}
            >
              <List.Item.Meta
                title={
                  <Link
                    className="text-lg hover:text-blue-600 transition-colors"
                    href={`/forum/${thread.topicId}/${thread.threadId}`}
                  >
                    {thread.title}
                  </Link>
                }
                description={
                  <div
                    className="text-neutral-600 leading-6 line-clamp-1"
                    dangerouslySetInnerHTML={{
                      __html: quillToHTML(thread.content),
                    }}
                  />
                }
              />
            </List.Item>
          )}
        />
        <div className="mt-4 flex justify-end">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={likeThreadData?.totalSize}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
}
