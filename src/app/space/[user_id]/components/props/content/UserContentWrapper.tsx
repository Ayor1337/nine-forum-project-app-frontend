import UserContent from "./UserContent";
import UserContentRightbar from "./UserContentRightbar";

interface defineProps {
  userId: string;
}

export default function UserContentWrapper({ userId }: defineProps) {
  return (
    <div className="flex gap-4 mt-4">
      {/* 左侧：主要内容 */}
      <UserContent userId={userId} />

      {/* 右侧：侧边栏 */}
      <UserContentRightbar userId={userId} />
    </div>
  );
}
