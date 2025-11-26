import { Input } from "antd";
import { useEffect, useState } from "react";
import NewTopicCard from "./NewTopicCard";
import { CheckOutlined } from "@ant-design/icons";
import request from "@/api/request";
import useApp from "antd/es/app/useApp";

interface defineProps {
  handleRefresh: () => void;
}

export default function NewThemeCard({ handleRefresh }: defineProps) {
  const [title, setTitle] = useState<string>("新主题");
  const [isTitleEdit, setTitleEdit] = useState<boolean>(false);
  const { message } = useApp();

  const uploadTheme = async () => {
    if (title == "新主题") {
      message.warning("请输入新的主题后再添加");
    } else {
      await request
        .put("/api/theme/insert", {
          title: title,
        })
        .then((res) => {
          if (res.data.code == 200) {
            message.success("添加成功");
            handleRefresh();
          }
        });
    }
  };

  useEffect(() => {
    if (title == "" && !isTitleEdit) {
      setTitle("新标题");
    }
  }, [title]);

  return (
    <>
      <div
        className="relative rounded-2xl overflow-hidden transition shadow-lg bg-gradient-to-t from-white to-slate-400"
        onClick={() => setTitleEdit(true)}
      >
        <div>
          {isTitleEdit ? (
            <Input
              className="text-2xl! z-2 py-3! pl-4! text-neutral-700! text-shadow-lg!  font-bold! outline-hidden! bg-transparent! border-transparent! shadow-none!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onPressEnter={() => setTitleEdit(false)}
            />
          ) : (
            <div className="text-2xl py-3 pl-4 text-white text-shadow-lg  font-bold">
              {title}
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-5 my-3 mx-3 pointer-events-none opacity-30">
          <NewTopicCard themeId="0" handleRefresh={() => {}} />
        </div>
        <div className="absolute top-4 right-4">
          <div
            className="flex justify-center items-center size-8 rounded-full bg-white transition hover:bg-blue-500 hover:text-white! cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              uploadTheme();
            }}
          >
            <CheckOutlined />
          </div>
        </div>
      </div>

      {isTitleEdit && (
        <div
          className="size-2000 fixed z-1 left-0 top-0"
          onClick={() => {
            if (isTitleEdit) {
              setTitleEdit(false);
            }
          }}
        />
      )}
    </>
  );
}
