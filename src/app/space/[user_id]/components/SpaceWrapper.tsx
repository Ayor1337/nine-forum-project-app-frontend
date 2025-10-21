"use client";

import { useEffect, useState } from "react";
import service from "@/axios";
import SpaceBanner from "./props/SpaceBanner";
import { useAuth } from "@/components/AuthProvider";
import StatisticsWrapper from "./props/StatisticsWrapper";
import UserContentWrapper from "./props/content/UserContentWrapper";
import Footer from "@/components/ui/Footer";

export default function SpaceWrapper({ user_id }: { user_id: string }) {
  const [isSelf, setSelf] = useState<boolean>(false);

  const [userInfo, setUserInfo] = useState<UserInfo>();
  const { currentUser } = useAuth();

  const fetchUserInfoById = async () => {
    await service
      .get(`/api/user/info/by_user_id`, {
        params: {
          user_id: user_id,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          setUserInfo(res.data.data);
        }
      });
  };

  useEffect(() => {
    fetchUserInfoById();
    if (currentUser && currentUser.accountId == Number(user_id)) {
      setSelf(true);
    }
  }, [currentUser, user_id]);

  return userInfo ? (
    <div className="w-full">
      <SpaceBanner userInfo={userInfo} isSelf={isSelf} />

      {/* 主体区域 */}
      <div className="relative mx-auto w-[1200px] px-4 mt-15 ">
        {/* <div className="absolute flex justify-center top-0 left-0 size-full bg-white/70  backdrop-blur-md shadow-sm z-997 ">
          <div className="flex text-4xl">待完善</div>
        </div> */}
        {/* 顶部快捷操作 */}
        <StatisticsWrapper />
        <UserContentWrapper userId={user_id} />
        <div className="mt-4">
          <Footer />
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
