import { formatDate } from "@/func/DateConvert";

interface defineProps {
  item: SystemMessage;
}

export default function SystemMessageCard({ item }: defineProps) {
  return (
    <div className="flex max-h-30 flex-col border-1 border-black/10 shadow-xs rounded-xl py-3 px-5 my-3">
      <div className="flex mb-3">
        <div className="font-bold text-xl">{item.title}</div>
        <div className="text-sm text-neutral-400 self-end pl-1">
          {formatDate(item.createTime)}
        </div>
      </div>
      <div>{item.content}</div>
    </div>
  );
}
