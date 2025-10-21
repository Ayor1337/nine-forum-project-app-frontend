import service from "@/axios";
import { Popconfirm, Tag } from "antd";
import useApp from "antd/es/app/useApp";
import { usePathname, useRouter } from "next/navigation";
import { threadId } from "worker_threads";

export default function AnnouncementItem({
  announcement,
}: {
  announcement: Announcement;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { message } = useApp();

  const unsetAnnouncement = async () => {
    await service
      .post(`/api/thread/perm/unset_announcement`, {
        topicId: announcement.topicId,
        threadId: announcement.threadId,
      })
      .then((res) => {
        if (res.data.code == 200) {
          message.info("取消设置成功");
        } else {
          message.warning(res.data.message);
        }
      });
  };

  return (
    <>
      <div
        className="flex items-center py-1 hover:bg-slate-300 rounded pl-1 transition cursor-pointer"
        onClick={() => router.push(`${pathname}/${announcement.threadId}`)}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Popconfirm
            title="确认取消公告"
            okText="确认"
            cancelText="不取消"
            onConfirm={() => {
              unsetAnnouncement();
            }}
          >
            <Tag className="hover:bg-red-500! hover:text-white!">公告</Tag>
          </Popconfirm>
        </div>

        <div className="text-neutral-700">{announcement.title}</div>
      </div>
    </>
  );
}
