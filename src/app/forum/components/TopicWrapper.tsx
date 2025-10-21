"use client";

import React from "react";
import TopicCard from "./TopicCard";
import { useCallback, useEffect, useState } from "react";
import service from "@/axios";

export default function TopicWrapper() {
  const [themes, setThemes] = useState<Array<Theme>>();

  const fetchThemeData = useCallback(async () => {
    await service.get("/api/theme/info/list").then((res) => {
      if (res.data.code == 200) {
        setThemes(res.data.data);
      } else return null;
    });
  }, []);

  useEffect(() => {
    fetchThemeData();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {themes?.map((tm) => (
        <TopicCard theme={tm} key={tm.themeId} />
      ))}
    </div>
  );
}
