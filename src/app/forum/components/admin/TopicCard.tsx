import request from "@/api/request";
import {
  convertImageToBase64,
  getBase64WithType,
  getImageUrl,
} from "@/api/utils/image";
import {
  CheckOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Image, Input, Popconfirm, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import useApp from "antd/es/app/useApp";
import { ReactNode, useEffect, useState } from "react";

interface defineProps {
  topic: Topic;
  hanldeRefresh: () => void;
}

export default function TopicCard({ topic, hanldeRefresh }: defineProps) {
  const [title, setTitle] = useState(topic.title);
  const [desc, setDesc] = useState(topic.description);
  const [preview, setPreview] = useState(topic.coverUrl);
  const [coverFile, setCoverFile] = useState<File | null>();
  const { message } = useApp();
  const [isChange, setChange] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  const [isTitleEdit, setTitleEdit] = useState<boolean>(false);
  const [isDescEdit, setDescEdit] = useState<boolean>(false);

  const customRequest = (file: File) => {
    getBase64WithType(file).then((url) => {
      setPreview(url);
    });
    setCoverFile(file);
  };

  const updateTopic = async () => {
    let base64 = preview;

    if (coverFile) {
      await convertImageToBase64(coverFile).then((base64) => {
        base64 = base64;
      });
    }

    service
      .put("/api/topic/update", {
        topicId: topic.topicId,
        title: title,
        cover: {
          base64: base64,
          fileName: coverFile ? coverFile.name : preview,
        },
        description: desc,
      })
      .then((res) => {
        if (res.data.code == 200) {
          message.success("成功上传");
          hanldeRefresh();
          setChange(false);
        }
      });
  };

  const deleteTopic = async () => {
    await request
      .delete(`/api/topic/delete`, {
        params: {
          topic_id: topic.topicId,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          message.success("删除成功");
          hanldeRefresh();
        } else {
          message.warning(res.data.message);
        }
      });
  };

  const previewMask: ReactNode = (
    <>
      <div className="flex size-full">
        <div
          className="flex gap-1 flex-1/2 h-full justify-center items-center"
          onClick={() => setVisible(true)}
        >
          <EyeOutlined />
          <span className="text-sm">预览</span>
        </div>
        <div className="h-1/3 w-[1px] bg-white/45 my-auto" />
        <div className="flex gap-1 flex-1/2 h-full justify-center items-center">
          <ImgCrop aspect={13 / 8}>
            <Upload
              showUploadList={false}
              customRequest={({ file }) => {
                customRequest(file as File);
              }}
            >
              <UploadOutlined className="text-white!" />
              <span className="text-sm text-white">上传</span>
            </Upload>
          </ImgCrop>
        </div>
      </div>
    </>
  );

  useEffect(() => {
    if (
      title != topic.title ||
      desc != topic.description ||
      preview != topic.coverUrl
    ) {
      setChange(true);
    } else {
      setChange(false);
    }
  }, [title, desc, coverFile, preview]);

  return (
    <>
      <div
        key={topic.topicId}
        className="flex px-3 py-3 bg-slate-100 transition hover:bg-slate-300 rounded-2xl shadow-sm hover:shadow-lg"
      >
        <div className="flex-1/3">
          <Image
            src={getImageUrl(preview)}
            className="object-cover shadow-lg rounded-2xl"
            width={130}
            height={80}
            preview={{
              visible: visible,
              mask: previewMask,
              onVisibleChange: (visible) => {
                if (!visible) {
                  setVisible(visible);
                }
              },
            }}
          />
        </div>
        <div className="flex flex-2/3 ml-3 flex-col">
          <div>
            {isTitleEdit ? (
              <div>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onPressEnter={() => setTitleEdit(false)}
                  className="z-2"
                />
              </div>
            ) : (
              <div onClick={() => setTitleEdit(true)}>{title}</div>
            )}
          </div>
          <div>
            {isDescEdit ? (
              <div>
                <Input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  onPressEnter={() => setDescEdit(false)}
                  className="z-2"
                />
              </div>
            ) : (
              <div onClick={() => setDescEdit(true)}>{desc}</div>
            )}
          </div>
        </div>
        <div className="flex items-center ml-auto">
          <div className="group cursor-pointer">
            {isChange ? (
              <Popconfirm
                title="确认修改?"
                okText="确认"
                cancelText="取消"
                onConfirm={() => updateTopic()}
              >
                <div className="rounded-full size-7 flex justify-center items-center bg-white group-hover:bg-blue-500 transition">
                  <CheckOutlined className="group-hover:text-white!" />
                </div>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="确认删除"
                okText="确认"
                cancelText="取消"
                onConfirm={() => deleteTopic()}
              >
                <div className="rounded-full size-7 flex justify-center items-center bg-white group-hover:bg-red-500 transition">
                  <DeleteOutlined className="group-hover:text-white!" />
                </div>
              </Popconfirm>
            )}
          </div>
        </div>
      </div>

      {(isTitleEdit || isDescEdit) && (
        <div
          className="size-2000 fixed z-1 left-0 top-0"
          onClick={() => {
            if (isTitleEdit) {
              setTitleEdit(false);
            }
            if (isDescEdit) {
              setDescEdit(false);
            }
          }}
        />
      )}
    </>
  );
}
