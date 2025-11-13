import { quillToHTML } from "@/func/QuillToHTML";
import { useRouter } from "next/navigation";

interface defineProps {
  item: ReplyMessage;
}

export default function ReplyMessageCard({ item }: defineProps) {
  const router = useRouter();

  return (
    <div
      className="flex flex-col border-1 border-black/10 shadow-xs rounded-xl py-3 px-5 my-3 cursor-pointer hover:shadow transition"
      onClick={() => {
        router.push(`/forum/${item.topicId}/${item.threadId}`);
      }}
    >
      <div className="flex mb-3">
        <div className="text-lg">
          {item.nickname} 在 {item.threadTitle} 中回复了
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: quillToHTML(item.content),
        }}
      />
      <div className="text-sm text-neutral-400 self-end pl-1 ">2020-10-10</div>
    </div>
  );
}
