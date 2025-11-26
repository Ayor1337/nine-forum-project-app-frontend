import request from "@/api/request";
import { useAuth } from "@/components/AuthProvider";
import SwipeableRow from "@/components/ui/SwipeableCard";
import { Popconfirm, Tag } from "antd";
import useApp from "antd/es/app/useApp";
import { usePathname, useRouter } from "next/navigation";

export default function AnnouncementItem({
  announcement,
}: {
  announcement: Announcement;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { message } = useApp();
  const { permissionVerify } = useAuth();

  const unsetAnnouncement = async () => {
    await request
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

  const EditAnnouncement = () => {
    return (
      <Popconfirm
        title="确认取消公告"
        okText="确认"
        cancelText="不取消"
        onConfirm={() => {
          unsetAnnouncement();
        }}
      >
        <button className="w-16 bg-red-500 rounded-2xl text-white flex flex-col items-center justify-center hover:opacity-90">
          <span className="text-xs mt-1 text-center">取消公告</span>
        </button>
      </Popconfirm>
    );
  };

  return (
    <>
      <SwipeableRow
        actionWidth={70}
        actions={<EditAnnouncement />}
        canSwipe={permissionVerify("", announcement.topicId)}
      >
        <div
          className="flex items-center py-1 rounded pl-1 cursor-pointer "
          onClick={() => router.push(`${pathname}/${announcement.threadId}`)}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Tag>公告</Tag>
          </div>

          <div className="text-neutral-700">{announcement.title}</div>
        </div>
      </SwipeableRow>
    </>
  );
}
