import request from "@/api/request";
import { Drawer } from "antd";
import { useCallback, useEffect, useState } from "react";
import ThemeCard from "./ThemeCard";
import { useAuth } from "@/components/AuthProvider";
import NewThemeCard from "./NewThemeCard";

interface defineProps {
  isOpen: boolean;
  closeDraw: () => void;
}

export default function TopicManager({ isOpen, closeDraw }: defineProps) {
  const [themeTopics, setThemeTopics] = useState<Array<ThemeTopic>>();

  const fetchThemeTopicList = useCallback(async () => {
    await request.get("/api/theme/list_themes_contains_topics").then((res) => {
      if (res.data.code == 200) {
        setThemeTopics(res.data.data);
      }
    });
  }, []);

  const refresh = () => {
    fetchThemeTopicList();
  };

  useEffect(() => {
    if (isOpen) {
      fetchThemeTopicList();
    }
  }, [isOpen]);

  return (
    <Drawer
      className="flex"
      title="论坛主页管理"
      open={isOpen}
      onClose={closeDraw}
      width={1200}
    >
      <div className="flex flex-col gap-5">
        {themeTopics?.map((tt) => (
          <ThemeCard themeTopic={tt} key={tt.themeId} handleRefresh={refresh} />
        ))}
        <NewThemeCard handleRefresh={refresh} />
      </div>
    </Drawer>
  );
}
