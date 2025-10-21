"use client";

import service from "@/axios";
import { getBase64WithType, getImageUrl } from "@/axios/ImageService";
import { useAuth } from "@/components/AuthProvider";
import { UploadOutlined } from "@ant-design/icons";
import { Avatar, Button, Image, Modal, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { useEffect, useState } from "react";

interface defineProps {
  isOpen: boolean;
  onClose: () => void;
  avatarUrl: string;
}

export default function AvatarUploadModal({
  avatarUrl,
  onClose,
  isOpen,
}: defineProps) {
  const [preview, setPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File>();
  const beforeUpload = () => {};

  const { refreshUserInfo } = useAuth();

  const customRequest = (file: File) => {
    getBase64WithType(file).then((url) => {
      setPreview(url);
    });
    setAvatarFile(file);
  };

  const uplodaAvatar = async () => {
    if (avatarFile) {
      await getBase64WithType(avatarFile).then((res) => {
        service
          .put("/api/user/update_avatar", {
            base64: res,
            fileName: avatarFile.name,
          })
          .then((res) => {
            if (res.data.code == 200) {
              onClose();
              refreshUserInfo();
            }
          });
      });
    }
  };

  useEffect(() => {
    setPreview(getImageUrl(avatarUrl));
  }, []);

  return (
    <>
      <Modal
        open={isOpen}
        okText="上传"
        cancelText="取消"
        onOk={uplodaAvatar}
        onCancel={onClose}
      >
        <div className="py-3">
          {preview && (
            <div className="flex flex-col items-center">
              <div className="text-xl my-5">头像预览</div>
              <div className="flex items-end justify-center gap-5 px-10">
                <Image src={preview} width={200} />
                <Avatar src={preview} size={100} />
                <Avatar src={preview} size={50} />
              </div>
            </div>
          )}

          <div className="flex justify-center mt-10 gap-5">
            <ImgCrop>
              <Upload
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={({ file }) => {
                  customRequest(file as File);
                }}
              >
                <Button type="link">
                  <div>上传头像</div>
                  <div>
                    <UploadOutlined />
                  </div>
                </Button>
              </Upload>
            </ImgCrop>
          </div>
        </div>
      </Modal>
    </>
  );
}
