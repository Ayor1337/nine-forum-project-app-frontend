import service from "@/axios";
import {
  EllipsisOutlined,
  TagOutlined,
  DeleteOutlined,
  AlertOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Button, Input, Popconfirm, Popover, Select } from "antd";
import useApp from "antd/es/app/useApp";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Option {
  value: number;
  label: string;
}

interface defineProps {
  thread: Thread;
  topicId: number;
  tag?: Tag;
}

export default function EditTool({ thread, topicId, tag }: defineProps) {
  const [isEditHover, setEditHover] = useState<boolean>(false);

  const [options, setOptions] = useState<Option[]>();
  const [optionValue, setOptionValue] = useState<number | null>(null);

  const [newTag, setNewTag] = useState<string>();

  const { message } = useApp();

  const fetchTagByTopicId = async () => {
    await service
      .get(`/api/tag/info/list_by_topic`, {
        params: {
          topic_id: topicId,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          let tags: Tag[] = res.data.data;

          let op: Option[] = [];

          tags?.forEach((tag) => {
            op.push({
              value: tag.tagId,
              label: tag.tag,
            });
          });

          setOptions(op);
        }
      });
  };

  const updateThreadTag = async (tagId: number) => {
    await service
      .post("/api/thread/perm/update_tag", {
        tagId: tagId,
        topicId: topicId,
        threadId: thread.threadId,
      })
      .then((res) => {
        if (res.data.code == 200) {
          message.success("修改成功");
        } else {
          message.warning(res.data.message);
        }
      });
  };

  const removeThreadTag = async () => {
    await service
      .post(`/api/thread/perm/delete_tag`, {
        topicId: thread.threadId,
      })
      .then((res) => {
        if (res.data.code == 200) {
          message.success("修改成功");
          setOptionValue(null);
        } else {
          message.warning(res.data.message);
        }
      });
  };

  const setAnnouncement = async () => {
    await service
      .post(`/api/thread/perm/set_announcement`, {
        threadId: thread.threadId,
        topicId: topicId,
      })
      .then((res) => {
        if (res.data.code == 200) {
          message.info("设置成功");
        } else {
          message.warning(res.data.message);
        }
      });
  };

  const removeThread = async () => {
    await service
      .post("/api/thread/perm/remove_thread", {
        threadId: thread.threadId,
        topicId: topicId,
      })
      .then((res) => {
        if (res.data.code == 200) {
          message.info("删除成功");
        } else {
          message.warning(res.data.message);
        }
      });
  };

  const insertNewTag = async () => {
    if (newTag) {
      await service
        .put("/api/tag/perm/insert_new_tag", {
          topicId: topicId,
          tag: newTag,
        })
        .then((res) => {
          if (res.data.code == 200) {
            message.info("插入新标签成功");
            fetchTagByTopicId();
            setNewTag("");
          } else {
            message.warning(res.data.message);
          }
        });
    } else {
      message.warning("请先输入新的标签");
    }
  };

  const TagEdit = (
    <div className="flex flex-col gap-1">
      <Select
        value={optionValue}
        placeholder="请选择一个标签"
        className="w-full"
        options={options}
        onChange={(e) => {
          setOptionValue(e);
          updateThreadTag(e);
        }}
      />
      <Input
        placeholder="新的标签..."
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
      />
      <Button onClick={() => insertNewTag()}>添加新的标签</Button>
      {optionValue && (
        <div className="">
          <Popconfirm
            title="确认移除标签"
            className="w-full"
            okText="确认"
            cancelText="取消"
            onConfirm={() => {
              removeThreadTag();
            }}
          >
            <Button danger>移除标签</Button>
          </Popconfirm>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    fetchTagByTopicId();
    if (tag) {
      setOptionValue(tag.tagId);
    }
  }, []);

  return (
    <div
      className="absolute right-30 top-5"
      style={{ zIndex: isEditHover ? 100 : "" }}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          className="absolute text-center shadow-2xl rounded-2xl border border-black/5 overflow-hidden"
          animate={{
            background: isEditHover ? "white" : "transparent",
            border: isEditHover ? "" : "none",
            boxShadow: isEditHover ? "" : "none",
            top: isEditHover ? "100%" : "",
          }}
          onMouseEnter={() => setEditHover(true)}
          onMouseLeave={() => setEditHover(false)}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="relative">
            <EllipsisOutlined />
            <motion.div
              animate={{
                width: isEditHover ? 60 : 0,
                opacity: isEditHover ? 1 : 0,
              }}
              className="absolute left-1/2 -translate-x-1/2 px-5 bottom-0  h-[1px] bg-black/15"
            />
          </div>

          <motion.div
            className="flex flex-col overflow-hidden w-25 mt-1"
            animate={{
              height: isEditHover ? "" : 0,
              opacity: isEditHover ? 1 : 0,
            }}
          >
            <Popover
              title="修改标签"
              arrow={false}
              placement="right"
              content={TagEdit}
              className="z-101!"
            >
              <div className="flex gap-2 py-2 w-full items-center justify-center hover:bg-slate-300 transition ">
                <TagOutlined />
                <span className="text-xs text-neutral-900">编辑标签</span>
              </div>
            </Popover>
            <div className="flex gap-2 py-2 w-full items-center justify-center hover:bg-slate-300 transition ">
              <Popconfirm
                title="确认设为公告"
                className="w-full z-101!"
                okText="确认"
                cancelText="取消"
                onConfirm={() => setAnnouncement()}
              >
                <div>
                  <AlertOutlined />
                  <span className="text-xs text-neutral-900">设为公告</span>
                </div>
              </Popconfirm>
            </div>
            <div className="flex gap-2 py-2 w-full items-center justify-center hover:bg-slate-300 transition ">
              <Popconfirm
                title="确认设为精选"
                className="w-full z-101!"
                okText="确认"
                cancelText="取消"
              >
                <div>
                  <StarOutlined />
                  <span className="text-xs text-neutral-900">设为精选</span>
                </div>
              </Popconfirm>
            </div>
            <div className="flex gap-2 py-2 w-full items-center justify-center hover:bg-slate-300 transition ">
              <Popconfirm
                title="确认删除"
                className="w-full z-101!"
                okText="确认"
                cancelText="取消"
                onConfirm={() => removeThread()}
              >
                <div>
                  <DeleteOutlined />
                  <span className="text-xs text-neutral-900">删除</span>
                </div>
              </Popconfirm>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
