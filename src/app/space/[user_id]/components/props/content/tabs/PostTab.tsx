import page from "@/app/page";
import request from "@/api/request";
import { formatDate } from "@/func/DateConvert";
import { quillToHTML } from "@/func/QuillToHTML";
import { EyeOutlined, MessageOutlined, LikeOutlined } from "@ant-design/icons";
import { Select, Input, List, Tag, Pagination } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";

interface defineProps {
  userId: string;
}

export default function PostTab({ userId }: defineProps) {
  const [page, setPage] = useState(0);
  const [threadData, setThreadData] = useState<PageEntity<Thread>>();
  const pageSize = 10;

  const fetchThreadsByUserId = async () => {
    await request
      .get(`/api/thread/info/user`, {
        params: {
          user_id: userId,
          page: page,
          page_size: pageSize,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          setThreadData(res.data.data);
        }
      });
  };

  useEffect(() => {
    fetchThreadsByUserId();
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
          itemLayout="vertical"
          dataSource={threadData?.data}
          renderItem={(thread) => (
            <List.Item
              key={thread.threadId}
              actions={[
                <span key="views">
                  <EyeOutlined /> {thread.viewCount}
                </span>,
                <span key="replies">
                  <MessageOutlined /> {thread.postCount}
                </span>,
                <span key="likes">
                  <LikeOutlined /> {thread.likeCount}
                </span>,
              ]}
              extra={
                <div className="text-xs text-neutral-500">
                  {formatDate(thread.createTime)}
                </div>
              }
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
                  <div>
                    {thread && (
                      <div className="flex items-center gap-2">
                        <Tag>{thread.tag.tag}</Tag>
                      </div>
                    )}
                  </div>
                }
              />
              <div
                className="text-neutral-600 leading-6 line-clamp-1"
                dangerouslySetInnerHTML={{
                  __html: quillToHTML(thread.content),
                }}
              ></div>
            </List.Item>
          )}
        />
        <div className="mt-4 flex justify-end">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={threadData?.totalSize}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
}
