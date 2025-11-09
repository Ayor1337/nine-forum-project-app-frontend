"use client";

import { Input, Tag } from "antd";
import PosterTool from "./PosterTool";
import ThreadCard, { ThreadWrapperRef } from "./ThreadCard";
import { useEffect, useRef, useState } from "react";
import service from "@/axios";
import { usePathname, useRouter } from "next/navigation";
import AnnouncementItem from "./AnnouncementItem";
import ChatBoard from "./ChatBoard";

export default function ThreadWrapper({ topicId }: { topicId: string }) {
  const threadWrapperRef = useRef<ThreadWrapperRef>(null);
  const [announcements, setAnncouncements] = useState<Announcement[]>();

  const updateDataHandler = async () => {
    await await threadWrapperRef.current?.refresh();
  };

  const fetchAnnouncement = async () => {
    await service
      .get(`/api/thread/info/announcement`, {
        params: {
          topic_id: topicId,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          setAnncouncements(res.data.data);
        }
      });
  };

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  return (
    <>
      <div className="basis-3/4 grow-0 flex flex-col gap-4">
        {/* Search Start */}
        <div className="rounded-xl border border-black/5 bg-white shadow-sm hover:shadow-md transition">
          <div className="p-4">
            <Input
              placeholder="想要搜点什么..."
              className=" !border-0 !ring-0 !outline-none"
            />
          </div>
        </div>
        {/* Search End */}

        {/* Announcement Start */}
        {announcements && announcements.length > 0 && (
          <div className="rounded-xl border border-black/5 bg-white shadow-sm hover:shadow-md transition p-3 overflow-hidden">
            <div className="space-y-1.5">
              {announcements?.map((a) => (
                <AnnouncementItem announcement={a} key={a.threadId} />
              ))}
            </div>
          </div>
        )}

        {/* Announcement End */}

        {/* ChatBoard Start */}
        <div className="relative">
          <div className="fixed -translate-x-15 z-99">
            <PosterTool topicId={topicId} refresh={updateDataHandler} />
          </div>
          <ChatBoard topicId={topicId} />
        </div>

        {/* ChatBoard End */}

        {/* Content Start */}
        <div className="relative">
          <ThreadCard topicId={Number(topicId)} ref={threadWrapperRef} />
        </div>

        {/* Content End */}
      </div>
    </>
  );
}
