import { formatDate } from "@/func/DateConvert";
import { useRouter } from "next/navigation";

interface defineProps {
  thread: ThreadDoc;
}

export default function SearchResultCard({ thread }: defineProps) {
  const router = useRouter();

  return (
    thread && (
      <div className="flex py-3 px-2">
        <div className="flex w-full flex-col">
          <div
            onClick={() =>
              router.push(`/forum/${thread.topicId}/${thread.threadId}`)
            }
            className="text-2xl text-blue-600 cursor-pointer"
          >
            {thread.title}
          </div>
          <div className="leading-6 line-clamp-3">{thread.content}</div>
          <div className="flex gap-3 justify-between text-neutral-500">
            <div>
              <div>创建时间: {formatDate(thread.createTime)}</div>
            </div>
            <div className="flex gap-5">
              <div>查看：{thread.viewCount}</div>
              <div>点赞：{thread.likeCount}</div>
              <div>收藏：{thread.collectCount}</div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
