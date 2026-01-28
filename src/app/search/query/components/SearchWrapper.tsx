"use client";

import request from "@/api/request";
import { useCallback, useEffect, useState } from "react";
import SearchResultCard from "./SearchResultCard";
import { useRouter } from "next/navigation";
import { Card, Space, Radio, Select, DatePicker, Checkbox } from "antd";
import dayjs, { Dayjs } from "dayjs";

interface Query {
  query: string;
  topicId?: number;
  enableHistory?: boolean;
  onlyThreadTopic?: boolean;
  pageNum?: number;
  startTime?: number | null;
  endTime?: number | null;
  order?: string;
}

interface defineProps {
  param: SearchParams;
}

interface Option {
  label: React.ReactNode;
  title: string;
  options?: ChildOption[];
}

interface ChildOption {
  label: React.ReactNode;
  value: string;
}

const normalizeToMilliseconds = (
  value: number | string | null | undefined
): number | null => {
  if (value === null || value === undefined) return null;

  const numericValue = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numericValue)) return null;

  return numericValue >= 1e12 ? numericValue : numericValue * 1000;
};

export default function SearchWrapper({ param }: defineProps) {
  const [results, setResults] = useState<PageEntity<ThreadDoc>>();
  const router = useRouter();
  const [query, setQuery] = useState<Query>(() => ({
    query: param.q,
    onlyThreadTopic: param.onlyThreadTopic,
    enableHistory: param.enableHistory,
    topicId: param.topicId,
    pageNum: param.page,
    startTime: normalizeToMilliseconds(param.startTime),
    endTime: normalizeToMilliseconds(param.endTime),
  }));

  const handleSearch = () => {
    if (!query) {
      return;
    }
    router.push(`/search/query?${buildQueryString()}`);
  };

  const getThreadByKeyword = useCallback(async () => {
    const normalizedTimeRange = {
      startTime: normalizeToMilliseconds(query.startTime),
      endTime: normalizeToMilliseconds(query.endTime),
    };

    await request
      .get("/api/search/info/query", {
        params: { ...query, ...normalizedTimeRange },
      })
      .then((res) => {
        if (res.data.code == 200) {
          setResults(res.data.data);
        }
      });
  }, [query]);

  // 修改：getRequestParams
  const buildQueryString = () => {
    const map = {
      query: "q",
      topicId: "topicId",
      enableHistory: "enableHistory",
      onlyThreadTopic: "onlyThreadTopic",
      startTime: "startTime",
      endTime: "endTime",
      order: "order",
      pageNum: "page",
    } as const;

    const normalizedQuery = {
      ...query,
      startTime: normalizeToMilliseconds(query.startTime),
      endTime: normalizeToMilliseconds(query.endTime),
    };

    return Object.keys(map)
      .map((key) => {
        const v = (normalizedQuery as any)[key];

        if (v === undefined || v === null) return "";
        if (typeof v === "boolean" && v === false) return "";

        const targetKey = map[key as keyof typeof map];
        return `${targetKey}=${encodeURIComponent(v)}`;
      })
      .filter(Boolean)
      .join("&");
  };

  useEffect(() => {
    getThreadByKeyword();
  }, [param]);

  useEffect(() => {
    if (query.query != param.q) {
      return;
    } else {
      router.push(`/search/query?` + buildQueryString());
    }
  }, [query]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-300 flex flex-col items-center mt-20">
        <div>
          <input
            type="text"
            value={query.query}
            onChange={(e) =>
              setQuery((query) => ({ ...query, query: e.target.value }))
            }
            className="border-0 ring-0 outline-none py-3 px-5 w-300 bg-neutral-100 rounded-3xl"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
        <div className="flex w-full mt-5">
          <div className="flex flex-4/5 flex-col divide-y-1  w-full px-3 divider-y-1 divide-slate-500/10">
            {results && results.totalSize > 0 ? (
              results.data.map((item, index) => (
                <SearchResultCard key={index} thread={item} />
              ))
            ) : (
              <div className="size-full text-2xl flex justify-center items-center">
                什么也没搜到捏
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1/5 gap-3">
            <div className="sticky top-5">
              <Selector query={query} setQuery={setQuery} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Selector({
  query,
  setQuery,
}: {
  query: Query;
  setQuery: (value: Query | ((prev: Query) => Query)) => void;
}) {
  const [time, setTime] = useState<string | null>(null);
  const [topicOptions, setTopicOptions] = useState<Option[]>([]);
  const [initTime, setInitTime] = useState<boolean>(false);
  const [rangeValue, setRangeValue] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  const fetchTopicList = async () => {
    await request
      .get("/api/theme/info/list_themes_contains_topics")
      .then((res) => {
        if (res.data.code == 200) {
          const resp: Array<ThemeTopic> = res.data.data;
          const options: Option[] = resp.map((item) => ({
            label: item.title,
            title: item.title,
            options: item.topics.map((topic) => ({
              label: topic.title,
              value: topic.topicId.toString(),
            })),
          }));
          setTopicOptions(options);
        }
      });
  };

  const initlizeTime = () => {
    const start = normalizeToMilliseconds(query.startTime);
    const end = normalizeToMilliseconds(query.endTime);

    if (start == null || end == null) {
      setTime("all");
      return;
    }

    const diff = end - start;

    const oneDay = 24 * 60 * 60 * 1000;
    const almost = (a: number, b: number) => Math.abs(a - b) < 5 * 60 * 1000; // 允许误差5分钟

    if (almost(diff, oneDay)) {
      setTime("today");
    } else if (almost(diff, 7 * oneDay)) {
      setTime("week");
    } else if (almost(diff, 30 * oneDay)) {
      setTime("month");
    } else if (almost(diff, 365 * oneDay)) {
      setTime("year");
    } else {
      setTime("custom"); // 不在预设范围内，就标记成自定义
      setRangeValue([dayjs(start), dayjs(end)]);
    }

    setInitTime(true);
  };

  useEffect(() => {
    fetchTopicList();
  }, []);

  useEffect(() => {
    if (!initTime) {
      initlizeTime();
      setInitTime(true);
      return;
    }

    let startTime: number | null = normalizeToMilliseconds(query.startTime);
    switch (time) {
      case "all":
        startTime = null;
        setRangeValue(null);
        break;
      case "today":
        startTime = Date.now() - 24 * 60 * 60 * 1000; // 一天
        setRangeValue(null);
        break;
      case "week":
        startTime = Date.now() - 7 * 24 * 60 * 60 * 1000; // 一周
        setRangeValue(null);
        break;
      case "month":
        startTime = Date.now() - 30 * 24 * 60 * 60 * 1000; // 一月
        setRangeValue(null);
        break;
      case "year":
        startTime = Date.now() - 365 * 24 * 60 * 60 * 1000; // 一年
        setRangeValue(null);
        break;
    }
    if (startTime !== null) {
      setQuery((query) => ({ ...query, startTime, endTime: Date.now() }));
    } else {
      setQuery((query) => ({ ...query, startTime: null, endTime: null }));
    }
  }, [time]);

  return (
    <div className="flex flex-col gap-3">
      {/* 卡片 1：时间筛选 */}
      <Card
        className="!bg-slate-50 shadow-2xs"
        title={<span className="text-slate-700">时间筛选</span>}
      >
        <Space direction="vertical" className="w-full">
          <Select
            className="w-full"
            placeholder="选择时间"
            value={time}
            onChange={setTime}
          >
            <Select.Option value="all">全部时间</Select.Option>
            <Select.Option value="today">今天</Select.Option>
            <Select.Option value="week">最近一周</Select.Option>
            <Select.Option value="month">最近一个月</Select.Option>
            <Select.Option value="year">最近一年</Select.Option>
            <Select.Option value="custom">自定时间</Select.Option>
          </Select>
          {time === "custom" && (
            <DatePicker.RangePicker
              className="w-full"
              placeholder={["开始时间", "结束时间"]}
              value={rangeValue}
              allowClear={false}
              onChange={(date) => {
                if (!date || !date[0] || !date[1]) return;
                const msDate = [date[0].valueOf(), date[1].valueOf()];
                setRangeValue(date);
                setQuery((query) => ({
                  ...query,
                  startTime: msDate[0],
                  endTime: msDate[1],
                }));
              }}
            />
          )}
        </Space>
      </Card>

      {/* 卡片 2：主题 / 板块筛选 */}
      <Card
        className="!bg-slate-50 shadow-2xs"
        title={<span className="text-slate-700">主题分类</span>}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Checkbox
            checked={query.onlyThreadTopic}
            onChange={(e) =>
              setQuery((q) => ({ ...q, onlyThreadTopic: e.target.checked }))
            }
          >
            只看主题帖
          </Checkbox>
          <Select
            className="w-full"
            placeholder="选择主题"
            value={query.topicId}
            onChange={(e) => setQuery((q) => ({ ...q, topicId: e }))}
            allowClear
            options={topicOptions}
          ></Select>
        </Space>
      </Card>

      {/* 卡片 3：排序方式 */}
      <Card
        className="!bg-slate-50 shadow-2xs"
        title={<span className="text-slate-700">排序方式</span>}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Radio.Group
            className="w-full flex flex-col gap-1"
            value={query.order}
            onChange={(e) => setQuery((q) => ({ ...q, order: e.target.value }))}
            defaultValue={null}
          >
            <Radio value={null} className="text-[12px]">
              按相关度
            </Radio>
            <Radio value="desc" className="text-[12px]">
              按时间（最新优先）
            </Radio>
            <Radio value="asc" className="text-[12px]">
              按时间（最早优先）
            </Radio>
          </Radio.Group>
        </Space>
      </Card>
    </div>
  );
}
