// =================== Actions.tsx ===================
import {
  TagOutlined,
  AlertOutlined,
  StarOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Popconfirm, Popover, Button, Input, Select } from "antd";
import useApp from "antd/es/app/useApp";
import { useEffect, useState } from "react";
import service from "@/axios";

interface Option {
  value: number;
  label: string;
}

export default function ThreadActions({
  thread,
  topicId,
  tag,
}: {
  thread: Thread;
  topicId: number;
  tag: Tag;
}) {
  const { message } = useApp();
  const [options, setOptions] = useState<Option[]>([]);
  const [optionValue, setOptionValue] = useState<number | null>(tag.tagId);
  const [newTag, setNewTag] = useState("");

  /** 拉取标签 */
  const fetchTagByTopicId = async () => {
    const res = await service.get("/api/tag/info/list_by_topic", {
      params: { topic_id: topicId },
    });
    if (res.data.code === 200) {
      const list = res.data.data.map((t: Tag) => ({
        value: t.tagId,
        label: t.tag,
      }));
      setOptions(list);
    }
  };

  /** 修改 / 添加 / 移除 标签 */
  const updateThreadTag = async (tagId: number) => {
    const res = await service.post("/api/thread/perm/update_tag", {
      tagId,
      topicId,
      threadId: thread.threadId,
    });
    res.data.code === 200
      ? message.success("修改成功")
      : message.warning(res.data.message);
  };
  const insertNewTag = async () => {
    if (!newTag) return message.warning("请输入新标签");
    const res = await service.put("/api/tag/perm/insert_new_tag", {
      topicId,
      tag: newTag,
    });
    if (res.data.code === 200) {
      message.success("添加新标签成功");
      fetchTagByTopicId();
      setNewTag("");
    } else message.warning(res.data.message);
  };
  const removeThreadTag = async () => {
    const res = await service.post("/api/thread/perm/delete_tag", {
      topicId: thread.threadId,
    });
    if (res.data.code === 200) {
      message.success("移除成功");
      setOptionValue(null);
    } else message.warning(res.data.message);
  };

  /** 公告 / 精选 / 删除 */
  const setAnnouncement = async () => {
    const res = await service.post("/api/thread/perm/set_announcement", {
      threadId: thread.threadId,
      topicId,
    });
    res.data.code === 200
      ? message.success("设置公告成功")
      : message.warning(res.data.message);
  };
  const setFeatured = async () => {
    const res = await service.post("/api/thread/perm/set_featured", {
      threadId: thread.threadId,
      topicId,
    });
    res.data.code === 200
      ? message.success("设置精选成功")
      : message.warning(res.data.message);
  };
  const removeThread = async () => {
    const res = await service.post("/api/thread/perm/remove_thread", {
      threadId: thread.threadId,
      topicId,
    });
    res.data.code === 200
      ? message.success("删除成功")
      : message.warning(res.data.message);
  };

  useEffect(() => {
    fetchTagByTopicId();
  }, []);

  /** 弹出内容：标签编辑 */
  const TagEdit = (
    <div className="flex flex-col gap-1 w-40">
      <Select
        value={optionValue ?? undefined}
        placeholder="选择标签"
        options={options}
        onChange={(v) => {
          setOptionValue(v);
          updateThreadTag(v);
        }}
      />
      <Input
        placeholder="新的标签..."
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
      />
      <Button size="small" onClick={insertNewTag}>
        添加标签
      </Button>
      {optionValue && (
        <Popconfirm
          title="确认移除标签？"
          okText="确认"
          cancelText="取消"
          onConfirm={removeThreadTag}
        >
          <Button size="small" danger>
            移除标签
          </Button>
        </Popconfirm>
      )}
    </div>
  );

  /** 核心操作区：放在 SwipeableRow actions 里 */
  return (
    <div className="flex h-full">
      <Popover
        placement="left"
        title="编辑标签"
        content={TagEdit}
        arrow={false}
      >
        <button className="w-16 bg-amber-500 text-white flex flex-col items-center justify-center hover:opacity-90">
          <TagOutlined />
          <span className="text-xs mt-1">标签</span>
        </button>
      </Popover>

      <Popconfirm
        title="设为公告？"
        okText="确认"
        cancelText="取消"
        onConfirm={setAnnouncement}
      >
        <button className="w-16 bg-sky-500 text-white flex flex-col items-center justify-center hover:opacity-90">
          <AlertOutlined />
          <span className="text-xs mt-1">公告</span>
        </button>
      </Popconfirm>

      <Popconfirm
        title="设为精选？"
        okText="确认"
        cancelText="取消"
        onConfirm={setFeatured}
      >
        <button className="w-16 bg-indigo-500 text-white flex flex-col items-center justify-center hover:opacity-90">
          <StarOutlined />
          <span className="text-xs mt-1">精选</span>
        </button>
      </Popconfirm>

      <Popconfirm
        title="确认删除？"
        okText="确认"
        cancelText="取消"
        onConfirm={removeThread}
      >
        <button className="w-16 bg-rose-600 text-white flex flex-col items-center justify-center hover:opacity-90">
          <DeleteOutlined />
          <span className="text-xs mt-1">删除</span>
        </button>
      </Popconfirm>
    </div>
  );
}
