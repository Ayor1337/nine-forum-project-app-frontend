"use client";

import { Input, Tag } from "antd";
import PosterTool from "./PosterTool";
import ThreadCard from "./ThreadCard";
import { useEffect, useRef, useState } from "react";
import request from "@/api/request";
import { usePathname, useRouter } from "next/navigation";
import AnnouncementItem from "./AnnouncementItem";
import ChatBoard from "./ChatBoard";

export default function ThreadWrapper({ topicId }: { topicId: string }) {
  const [announcements, setAnncouncements] = useState<Announcement[]>();

  const fetchAnnouncement = async () => {
    await request
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
          <ChatBoard topicId={topicId} />
        </div>
        {/* ChatBoard End */}

        {/* Content Start */}
        <div>
          <ThreadCard topicId={Number(topicId)} />
        </div>

        {/* Content End */}
      </div>
    </>
  );
}
