import TopicCard from "./TopicCard";
import NewTopicCard from "./NewTopicCard";

interface defineProps {
  themeTopic: ThemeTopic;
  handleRefresh: () => void;
}

export default function ThemeCard({ themeTopic, handleRefresh }: defineProps) {
  return (
    <>
      <div
        key={themeTopic.themeId}
        className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-t from-white to-slate-400"
      >
        <div className="text-2xl py-3 pl-4 text-white text-shadow-lg  font-bold">
          {themeTopic.title}
        </div>
        <div className="grid grid-cols-3 gap-5 my-3 mx-3">
          {themeTopic.topics.map((t) => (
            <TopicCard
              topic={t}
              key={t.topicId}
              hanldeRefresh={handleRefresh}
            />
          ))}
          <NewTopicCard
            themeId={themeTopic.themeId}
            handleRefresh={handleRefresh}
          />
        </div>
      </div>
    </>
  );
}
