import WhisperMessageContentWrapper from "./components/WhisperMessageContentWrapper";

export default async function WhisperContent({
  params,
}: {
  params: Promise<{ messageId: number }>;
}) {
  const { messageId } = await params;

  return (
    <>
      <WhisperMessageContentWrapper
        conversationId={messageId}
        key={messageId}
      />
    </>
  );
}
