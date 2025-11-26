"use client";

import request from "@/api/request";
import { getBase64WithType } from "@/api/utils/image";
import { useAuth } from "@/components/AuthProvider";
import { Button, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import useApp from "antd/es/app/useApp";
import { useState } from "react";

export default function BannerUploadModal() {
  const { message } = useApp();

  const uploadBanner = async (file: File) => {
    if (file) {
      await getBase64WithType(file).then((res) => {
        service
          .put("/api/user/update_banner", {
            base64: res,
            fileName: file.name,
          })
          .then((res) => {
            if (res.data.code == 200) {
              message.success("更改成功");
            }
          });
      });
    }
  };

  const customRequest = (file: File) => {
    uploadBanner(file);
  };

  return (
    <>
      <ImgCrop aspect={21 / 9} quality={1}>
        <Upload
          showUploadList={false}
          customRequest={({ file }) => {
            customRequest(file as File);
          }}
        >
          <div className="text-lg cursor-pointer text-white! hover:text-blue-300! text-shadow-2xs hover:text-shadow-sm">
            修改资料背景
          </div>
        </Upload>
      </ImgCrop>
    </>
  );
}
