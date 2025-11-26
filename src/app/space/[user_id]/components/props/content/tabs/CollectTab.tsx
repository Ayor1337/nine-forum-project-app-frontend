import page from "@/app/page";
import request from "@/api/request";
import { Empty, Card, Divider, Popconfirm, Button, Pagination } from "antd";
import useApp from "antd/es/app/useApp";
import Link from "next/link";
import { useState, useEffect } from "react";

interface defineProps {
  userId: string;
}

export default function CollectTab({ userId }: defineProps) {
  const [page, setPage] = useState(0);
  const [collectThreadData, setCollectThreadData] =
    useState<PageEntity<Thread>>();

  const pageSize = 8;

  const fetchCollectThreadsByUserId = async () => {
    await request
      .get(`/api/collect/get_collects`, {
        params: {
          user_id: userId,
          page: page,
          page_size: pageSize,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          setCollectThreadData(res.data.data);
        }
      });
  };

  useEffect(() => {
    fetchCollectThreadsByUserId();
  }, [page]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collectThreadData && collectThreadData.data.length === 0 ? (
          <div className="col-span-full">
            <Empty description="暂无收藏" />
          </div>
        ) : (
          collectThreadData?.data.map((fav) => (
            <Card key={fav.threadId} className="rounded-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/forum/${fav.topicId}/${fav.threadId}`}
                    className="text-base font-medium hover:text-blue-600"
                  >
                    {fav.title}
                  </Link>
                </div>
              </div>
              <Divider className="my-3" />
              <div>
                <Popconfirm
                  title="确认取消收藏？"
                  okText="确认"
                  cancelText="取消"
                >
                  <Button danger size="small">
                    取消收藏
                  </Button>
                </Popconfirm>
              </div>
            </Card>
          ))
        )}
      </div>
      <div className="mt-4 w-full flex justify-center">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={collectThreadData?.totalSize}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}
