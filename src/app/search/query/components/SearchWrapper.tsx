"use client";

import service from "@/axios";
import { useCallback, useEffect, useState } from "react";
import SearchResultCard from "./SearchResultCard";
import { usePathname, useRouter } from "next/navigation";
import { Card, Button, Space, Radio, Select, DatePicker, Checkbox } from "antd";

interface defineProps {
  param: SearchParams;
}
export default function SearchWrapper({ param }: defineProps) {
  const [query, setQuery] = useState(param.q);
  const [results, setResults] = useState<PageEntity<ThreadDoc>>();
  const router = useRouter();

  const handleSearch = () => {
    if (!query) {
      return;
    }
    router.push(`/search/query?q=${query}`);
  };

  const getThreadByKeyword = useCallback(
    async (query: string) => {
      await service
        .get("/api/search/info/query", {
          params: {
            query: query,
            pageNum: 1,
            pageSize: 10,
          },
        })
        .then((res) => {
          if (res.data.code == 200) {
            setResults(res.data.data);
          }
        });
    },
    [query]
  );

  useEffect(() => {
    getThreadByKeyword(query);
  }, [param]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-300 flex flex-col items-center mt-20">
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
            {results &&
              results.data.map((item, index) => (
                <SearchResultCard key={index} thread={item} />
              ))}
          </div>
          <div className="flex flex-col flex-1/5 gap-3">
            <div className="sticky top-5">
              <Selector />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Selector() {
  return (
    <>
      {/* 卡片 1：时间筛选 */}
      <Card
        className="!bg-slate-50"
        title={<span className="text-slate-700">时间筛选</span>}
        extra={
          <Button
            type="link"
            className="!p-0 text-[11px]"
            // onClick={handleResetTime}
          >
            重置
          </Button>
        }
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          {/* 时间预设 */}
          <Radio.Group
            className="w-full flex flex-wrap gap-y-1"
            // value={timePreset}
            // onChange={e => setTimePreset(e.target.value)}
          >
            <Radio.Button value="all" className="!text-[11px]">
              全部
            </Radio.Button>
            <Radio.Button value="1d" className="!text-[11px]">
              24 小时
            </Radio.Button>
            <Radio.Button value="7d" className="!text-[11px]">
              近 7 天
            </Radio.Button>
            <Radio.Button value="30d" className="!text-[11px]">
              近 30 天
            </Radio.Button>
          </Radio.Group>

          {/* 自定义时间区间 */}
          <DatePicker
            className="w-full"
            // value={customRange}
            // onChange={setCustomRange}
          />
        </Space>
      </Card>

      {/* 卡片 2：主题 / 板块筛选 */}
      <Card
        className="!bg-slate-50"
        title={<span className="text-slate-700">主题分类</span>}
        extra={
          <Button
            type="link"
            className="!p-0 text-[11px]"
            // onClick={handleResetTopic}
          >
            清空
          </Button>
        }
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Checkbox value="1">只看主题帖</Checkbox>
          <Select
            className="w-full"
            placeholder="选择主题"
            // value={topic}
            // onChange={setTopic}
            allowClear
          >
            <Select.Option value="all">全部主题</Select.Option>
            <Select.Option value="tech">技术讨论</Select.Option>
            <Select.Option value="qa">问答求助</Select.Option>
            <Select.Option value="share">经验分享</Select.Option>
            <Select.Option value="other">其他</Select.Option>
          </Select>

          {/* 如果你有标签/话题，可以在这里再加一个多选 */}
          {/* 
      <Select
        mode="tags"
        size="small"
        className="w-full"
        placeholder="关键字 / 标签"
        // value={tags}
        // onChange={setTags}
      />
      */}
        </Space>
      </Card>

      {/* 卡片 3：排序方式 */}
      <Card
        className="!bg-slate-50"
        title={<span className="text-slate-700">排序方式</span>}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Radio.Group
            className="w-full flex flex-col gap-1"
            // value={orderBy}
            // onChange={e => setOrderBy(e.target.value)}
          >
            <Radio value="relevance" className="text-[12px]">
              按相关度
            </Radio>
            <Radio value="time_desc" className="text-[12px]">
              按时间（最新优先）
            </Radio>
            <Radio value="time_asc" className="text-[12px]">
              按时间（最早优先）
            </Radio>
            <Radio value="hot" className="text-[12px]">
              按热度
            </Radio>
          </Radio.Group>
        </Space>
      </Card>
    </>
  );
}
