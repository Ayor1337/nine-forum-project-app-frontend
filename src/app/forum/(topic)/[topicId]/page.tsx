import ThreadWrapper from "@/app/forum/(topic)/[topicId]/components/ThreadWrapper";
import ThreadPageRightbar from "./components/ThreadPageRightbar";

export default async function page({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;

  return (
    <>
      <div className="w-full max-w-7xl mx-auto flex gap-5">
        {/* 左列 */}
        <ThreadWrapper topicId={topicId} />
        {/* 右列 */}
        <ThreadPageRightbar />
      </div>
    </>
  );
}
