"use client";

import service from "@/axios";
import { getImageUrl } from "@/axios/ImageService";
import { numberProcess } from "@/func/NumberProcess";
import { Skeleton } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface defineProps {
  themeId: number;
}

export default function TopicItem({ themeId }: defineProps) {
  const [topicData, setTopicData] = useState<Array<Topic>>();
  const [isFetching, setFetching] = useState<boolean>(true);
  const pathname = usePathname();

  const fetchTopicData = useCallback(async (themeId: number) => {
    await service
      .get(`/api/topic/info/list_by_theme_id`, {
        params: {
          theme_id: themeId,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          setTopicData(res.data.data);
          setFetching(false);
        }
      });
  }, []);

  useEffect(() => {
    fetchTopicData(themeId);
  }, []);

  return (
    <>
      {isFetching ? (
        <TopicItemSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {topicData?.map((td) => (
            <Link href={pathname + "/" + td.topicId} key={td.topicId}>
              <div className="flex">
                <img
                  src={getImageUrl(td.coverUrl)}
                  className="w-32 h-18 object-cover shadow-lg"
                />
                <div className="flex flex-col justify-between ml-3">
                  <div>{td.title}</div>
                  <div>{td.description}</div>
                  <div>
                    阅读量：{numberProcess(td.viewCount)} 帖子数：
                    {numberProcess(td.threadCount)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function TopicItemSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="flex">
        <Skeleton.Image className="w-32! h-18!" />
        <Skeleton className="ml-3" paragraph={{ rows: 1 }} />
      </div>
      <div className="flex">
        <Skeleton.Image className="w-32! h-18!" />
        <Skeleton className="ml-3" paragraph={{ rows: 1 }} />
      </div>
    </div>
  );
}
