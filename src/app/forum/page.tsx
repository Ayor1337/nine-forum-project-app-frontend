import ForumPageRightbar from "@/app/forum/components/ForumPageRightbar";
import TopicWrapper from "@/app/forum/components/TopicWrapper";

export default function ForumPage() {
  return (
    <>
      <div className="flex w-full gap-5">
        <div className="flex-3/4">
          <TopicWrapper />
        </div>
        <ForumPageRightbar />
      </div>
    </>
  );
}
