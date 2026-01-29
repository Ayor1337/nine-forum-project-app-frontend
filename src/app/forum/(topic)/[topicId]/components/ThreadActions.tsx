// =================== Actions.tsx ===================
import {
  Tag,
  Megaphone,
  Star,
  Trash2,
} from "lucide-react";
import { Popconfirm, Popover, Button, Input, Select, Divider } from "antd";
import useApp from "antd/es/app/useApp";
import { useState } from "react";
import request from "@/api/request";

interface Option {
  value: number;
  label: string;
}

export default function ThreadActions({
  thread,
  topicId,
  tag,
  options,
  refresh,
}: {
  thread: Thread;
  topicId: number;
  tag: Tag;
  options: Option[];
  refresh: () => void;
}) {
  const { message } = useApp();
  const [optionValue, setOptionValue] = useState<number | null>(tag.tagId);
  const [newTag, setNewTag] = useState("");

  const updateThreadTag = async (tagId: number) => {
    const res = await request.post("/api/thread/perm/update_tag", {
      tagId,
      topicId,
      threadId: thread.threadId,
    });
    if (res.data.code === 200) {
      message.success("修改成功");
    } else {
      message.warning(res.data.message);
    }
  };
  const insertNewTag = async () => {
    if (!newTag) return message.warning("请输入新标签");
    const res = await request.put("/api/tag/perm/insert_new_tag", {
      topicId,
      tag: newTag,
    });
    if (res.data.code === 200) {
      message.success("添加新标签成功");
      refresh();
      setNewTag("");
    } else {
      message.warning(res.data.message);
    }
  };
  const removeThreadTag = async () => {
    const res = await request.post("/api/thread/perm/delete_tag", {
      topicId: thread.threadId,
    });
    if (res.data.code === 200) {
      message.success("移除成功");
      setOptionValue(null);
    } else {
      message.warning(res.data.message);
    }
  };

  /** 公告 / 精选 / 删除 */
  const setAnnouncement = async () => {
    const res = await request.post("/api/thread/perm/set_announcement", {
      threadId: thread.threadId,
      topicId,
    });
    if (res.data.code === 200) {
      message.success("设置公告成功");
    } else {
      message.warning(res.data.message);
    }
  };
  const setFeatured = async () => {
    const res = await request.post("/api/thread/perm/set_featured", {
      threadId: thread.threadId,
      topicId,
    });
    if (res.data.code === 200) {
      message.success("设置精选成功");
    } else {
      message.warning(res.data.message);
    }
  };
  const removeThread = async () => {
    const res = await request.post("/api/thread/perm/remove_thread", {
      threadId: thread.threadId,
      topicId,
    });
    if (res.data.code === 200) {
      message.success("删除成功");
    } else {
      message.warning(res.data.message);
    }
  };

  /** 弹出内容：标签编辑 */
  const TagEdit = (
    <div className="flex flex-col gap-3 w-56 p-1">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 font-medium ml-1">选择现有标签</span>
        <Select
          className="w-full"
          value={optionValue ?? undefined}
          placeholder="请选择标签"
          options={options}
          onChange={(v) => {
            setOptionValue(v);
            updateThreadTag(v);
          }}
        />
        {optionValue && (
            <Button size="small" danger type="text" onClick={removeThreadTag} className="self-end text-xs">
              移除当前标签
            </Button>
        )}
      </div>
      
      <Divider style={{ margin: "4px 0" }} />

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-500 font-medium ml-1">创建新标签</span>
        <div className="flex gap-2">
          <Input
            className="flex-1"
            placeholder="输入新标签名"
            size="small"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <Button type="primary" size="small" onClick={insertNewTag}>
            添加
          </Button>
        </div>
      </div>
    </div>
  );

  /** 核心操作区：放在 SwipeableRow actions 里 */
  return (
    <div className="flex h-full w-full">
      <Popover
        placement="top"
        title={null}
        content={TagEdit}
        trigger="click"
        arrow={false}
      >
        <button className="flex-1 bg-amber-500 text-white flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-amber-600 active:bg-amber-700">
          <Tag size={20} strokeWidth={2} />
          <span className="text-[10px] font-medium mt-1">标签</span>
        </button>
      </Popover>

      <Popconfirm
        title="设为公告"
        description="确定要将此帖子设为公告吗？"
        okText="确认"
        cancelText="取消"
        onConfirm={setAnnouncement}
      >
        <button className="flex-1 bg-sky-500 text-white flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-sky-600 active:bg-sky-700">
          <Megaphone size={20} strokeWidth={2} />
          <span className="text-[10px] font-medium mt-1">公告</span>
        </button>
      </Popconfirm>

      <Popconfirm
        title="设为精选"
        description="确定要将此帖子设为精选吗？"
        okText="确认"
        cancelText="取消"
        onConfirm={setFeatured}
      >
        <button className="flex-1 bg-indigo-500 text-white flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-indigo-600 active:bg-indigo-700">
          <Star size={20} strokeWidth={2} />
          <span className="text-[10px] font-medium mt-1">精选</span>
        </button>
      </Popconfirm>

      <Popconfirm
        title="删除帖子"
        description="此操作无法撤销，确定删除吗？"
        okText="删除"
        okType="danger"
        cancelText="取消"
        onConfirm={removeThread}
      >
        <button className="flex-1 bg-rose-600 text-white flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-rose-700 active:bg-rose-800">
          <Trash2 size={20} strokeWidth={2} />
          <span className="text-[10px] font-medium mt-1">删除</span>
        </button>
      </Popconfirm>
    </div>
  );
}
