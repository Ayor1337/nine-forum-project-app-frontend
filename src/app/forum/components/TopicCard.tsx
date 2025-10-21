import TopicItem from "./TopicItem";

export default await function TopicCard({ theme }: { theme: Theme }) {
  return (
    <div className="basis-3/4 flex flex-col rounded-xl overflow-hidden shadow-md">
      {/* 标题条 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-white font-semibold text-lg shadow">
        {theme.title}
      </div>
      {/* 内容区 */}
      <div className="bg-white px-4 py-6 ">
        <TopicItem themeId={theme.themeId} />
      </div>
    </div>
  );
};
