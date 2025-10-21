import PostWrapper from "./components/PostWrapper";

export default async function PostPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;

  return (
    <div className="flex justify-center">
      <div className="w-[1200px]">
        <PostWrapper threadId={threadId} />
      </div>
    </div>
  );
}
