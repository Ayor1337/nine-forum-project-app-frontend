"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumb } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import service from "@/axios";

const SEGMENT_ALIAS: Record<string, string> = {
  forum: "论坛",
  posts: "帖子",
  users: "用户",
  settings: "设置",
};

function normalizeSegments(pathname: string): string[] {
  return pathname.split("/").filter(Boolean);
}

function segmentLabel(seg: string): string {
  const decoded = decodeURIComponent(seg);
  return SEGMENT_ALIAS[decoded] ?? decoded.replace(/-/g, " ");
}

export default function ForumBreadcrumb() {
  const pathname = usePathname();
  const segments = normalizeSegments(pathname);

  // 仅用于第 3 段（themeId）的动态题目
  const [topicTitle, setTopicTitle] = useState<string>();
  const [threadTitle, setThreadTitle] = useState<string>();

  const fetchTopicTitle = useCallback(async (topicId: number) => {
    const res = await service.get(`/api/bread/info/topic_bread`, {
      params: {
        topic_id: topicId,
      },
    });
    if (res.data?.code === 200) {
      setTopicTitle(res.data.data); // 假设拿到的是主题名字符串
    } else {
      setTopicTitle(undefined);
    }
  }, []);

  const fetchThreadTitle = useCallback(async (threadId: number) => {
    const res = await service.get(`/api/bread/info/thread_bread`, {
      params: {
        thread_id: threadId,
      },
    });
    if (res.data?.code === 200) {
      setThreadTitle(res.data.data); // 假设拿到的是主题名字符串
    } else {
      setThreadTitle(undefined);
    }
  }, []);

  // 当存在第 3 段且是数字 → 拉主题名
  useEffect(() => {
    if (segments.length >= 1) {
      const maybeThemeId = Number(segments[1]);
      if (!Number.isNaN(maybeThemeId)) {
        fetchTopicTitle(maybeThemeId);
      }

      if (segments.length >= 2) {
        const maybeThreadId = Number(segments[2]);
        if (!Number.isNaN(maybeThreadId)) {
          fetchThreadTitle(maybeThreadId);
        }
      }
      return;
    }
    setTopicTitle(undefined);
  }, [segments, fetchTopicTitle]);

  const items = useMemo(() => {
    if (segments.length === 0) {
      return [{ title: <Link href="/">首页</Link> }];
    }

    const acc: { title: React.ReactNode }[] = [
      { title: <Link href="/">首页</Link> },
    ];

    segments.forEach((seg, idx) => {
      const href = "/" + segments.slice(0, idx + 1).join("/");

      // 第 3 段：themeId → 用动态标题替换
      if (idx === 1) {
        const label = topicTitle ?? `主题 ${seg}`; // 避免闪“纯数字”
        if (idx === segments.length - 1) {
          acc.push({ title: label });
        } else {
          acc.push({ title: <Link href={href}>{label}</Link> });
        }
        return;
      }

      if (idx === 2) {
        const label = threadTitle ?? `帖子 ${seg}`; // 避免闪“纯数字”
        if (idx === segments.length - 1) {
          acc.push({ title: label });
        } else {
          acc.push({ title: <Link href={href}>{label}</Link> });
        }
        return;
      }

      // 其它段维持原逻辑（第 4 段 topicId 你后续自行替换）
      if (idx === segments.length - 1) {
        acc.push({ title: segmentLabel(seg) });
      } else {
        acc.push({ title: <Link href={href}>{segmentLabel(seg)}</Link> });
      }
    });

    return acc;
  }, [segments, topicTitle, pathname]);

  return (
    <div className="w-full py-2">
      <Breadcrumb items={items} />
    </div>
  );
}
