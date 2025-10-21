import service from "@/axios";
import { getBase64WithType, getImageUrl } from "@/axios/ImageService";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Input, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import useApp from "antd/es/app/useApp";
import { useState } from "react";

interface defineProps {
  themeId: string;
  handleRefresh: () => void;
}

export default function NewTopicCard({ themeId, handleRefresh }: defineProps) {
  const [title, setTitle] = useState("待输入标题");
  const [desc, setDesc] = useState("待输入描述");
  const [preview, setPreview] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>();
  const { message } = useApp();

  const [isTitleEdit, setTitleEdit] = useState<boolean>(false);
  const [isDescEdit, setDescEdit] = useState<boolean>(false);

  const uploadTheme = async () => {
    if (title == "待输入标题") {
      message.warning("请输入标题");
    }
    if (coverFile) {
      await getBase64WithType(coverFile).then((url) => {
        if (desc == "待输入描述") {
          setDesc("");
        }
        service
          .put("/api/topic/insert", {
            title: title,
            description: desc,
            cover: {
              base64: url,
              fileName: coverFile.name,
            },
            themeId: themeId,
          })
          .then((res) => {
            if (res.data.code == 200) {
              message.success("添加成功");
              resetForm();
              handleRefresh();
            } else {
              message.warning(res.data.message);
            }
          });
      });
    } else {
      message.warning("还未上传图片");
    }
  };

  const resetForm = () => {
    setTitle("待输入标题");
    setDesc("待输入描述");
    setPreview("");
    setCoverFile(null);
  };

  const customRequest = (file: File) => {
    getBase64WithType(file).then((url) => {
      setPreview(url);
    });
    setCoverFile(file);
  };

  return (
    <>
      <div className="flex px-3 py-3 bg-slate-100 transition hover:bg-slate-300 rounded-2xl shadow-sm hover:shadow-lg ">
        <div className="flex-1/3">
          <ImgCrop aspect={13 / 8}>
            <Upload
              customRequest={({ file }) => customRequest(file as File)}
              showUploadList={false}
            >
              <Image
                src={preview ? preview : getImageUrl()}
                className="object-cover shadow-lg"
                width={130}
                height={80}
                preview={false}
              />
            </Upload>
          </ImgCrop>
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
          <div className="group cursor-pointer" onClick={() => uploadTheme()}>
            <div className="rounded-full size-7 flex justify-center items-center bg-white group-hover:bg-blue-500 transition">
              <PlusOutlined className="group-hover:text-white!" />
            </div>
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
