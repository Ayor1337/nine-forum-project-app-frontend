"use client";

import service from "@/axios";
import { Button, Divider, Skeleton } from "antd";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import ThreadItem from "./ThreadItem";

interface defineProps {
  topicId: number;
}

export interface ThreadWrapperRef {
  refresh: () => Promise<void>;
}

const ThreadCard = forwardRef<ThreadWrapperRef, defineProps>(
  ({ topicId }, ref) => {
    const PAGE_SIZE = 10;

    const [threadList, setThreadList] = useState<PageEntity<Thread>>();
    const [isFetching, setFetching] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);

    const fetchThreadsByTopicId = useCallback(async (topicId: number) => {
      await service
        .get(`/api/thread/info/topic`, {
          params: {
            topic_id: topicId,
            page_num: page,
            page_size: PAGE_SIZE,
          },
        })
        .then((res) => {
          if (res.data.code == 200) {
            console.log(res.data.data);

            setThreadList(res.data.data);
            setFetching(false);
          }
        });
    }, []);

    const refreshHandler = useCallback(async () => {
      const idNum = Number(topicId);
      if (!isNaN(idNum)) {
        await Promise.all([fetchThreadsByTopicId(idNum)]);
      }
    }, [topicId, fetchThreadsByTopicId]);

    useImperativeHandle(
      ref,
      () => ({
        refresh: refreshHandler,
      }),
      [refreshHandler]
    );

    useEffect(() => {
      if (!isNaN(Number(topicId))) {
        fetchThreadsByTopicId(topicId);
      }
    }, []);

    return (
      <>
        {/* Content Start */}
        <div className="rounded-xl border border-black/5 bg-white shadow-sm transition">
          {/* Filter Start */}
          <div className="flex gap-2 px-3 pb-2 pt-2">
            <div className="!px-2 link">热门</div>
            <div className="!px-2 link">最新</div>
          </div>
          {/* Filter End */}

          <div className="flex flex-col">
            {/* Content Card Start */}
            {isFetching ? (
              <ThreadItemSkeleton />
            ) : (
              threadList?.data.map((tm) => (
                <div key={tm.threadId}>
                  <ThreadItem thread={tm} />
                  <div className="px-4">
                    <Divider size="small" />
                  </div>
                </div>
              ))
            )}
            {/* Content Card End */}
            {threadList && threadList.data.length == 0 && (
              <div className="flex justify-center items-center">
                <div className="py-10">该主题还是空的, 请发送第一个帖子</div>
              </div>
            )}
          </div>
        </div>
        {/* Content End */}
      </>
    );
  }
);

export default ThreadCard;

function ThreadItemSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-3 py-3 rounded-lg ">
      <div className="flex items-center">
        <Skeleton.Avatar size={40} />
        <Skeleton paragraph={{ rows: 2 }} title={false} className="ml-3" />
      </div>
      <Skeleton paragraph={{ rows: 1 }} title={false} />
      <div className="flex gap-3">
        <Skeleton.Image className="w-48!" />
        <Skeleton paragraph={{ rows: 3 }} title={false} />
      </div>
    </div>
  );
}
