import { getImageUrl } from "@/axios/ImageService";
import { Avatar, Button } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import AvatarUploadModal from "./AvatarUploadModal";
import BannerUploadModal from "./BannerUploadModal";

export default function SpaceBanner({
  userInfo,
  isSelf,
}: {
  userInfo: UserInfo;
  isSelf: boolean;
}) {
  const [isProfileHover, setProfileHover] = useState<boolean>(false);
  const [isAvatarHover, setAvatarHover] = useState<boolean>(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);

  const handleAvatarHover = (state: boolean) => {
    if (isSelf) setAvatarHover(state);
  };

  const handleProfileHover = (state: boolean) => {
    if (isSelf) setProfileHover(state);
  };

  return (
    <>
      {/* Banner start */}
      <div className="banner relative w-full h-130 bg-red-500 overflow-hidden shadow-xl ">
        <img
          src={getImageUrl(userInfo.bannerUrl)}
          alt="avatar"
          className="object-cover size-full absolute top-1/2 -translate-y-1/2 z-1"
        />
        {/* 遮罩 start */}
        <div className="mask w-full h-2/5 absolute bottom-0 bg-gradient-to-t from-black/60 to-transparent z-2" />
        {/* 遮罩 end */}
        <div
          className="userInfo absolute bottom-3 left-1/2 -translate-x-1/2 z-30"
          onMouseEnter={() => handleProfileHover(true)}
          onMouseLeave={() => handleProfileHover(false)}
        >
          <div className="flex flex-col items-center">
            <AnimatePresence initial={false}>
              <motion.div
                key="profile"
                animate={{ y: isProfileHover ? -30 : 0 }}
                className="mb-3 relative overflow-hidden"
                onMouseEnter={() => handleAvatarHover(true)}
                onMouseLeave={() => handleAvatarHover(false)}
              >
                {isSelf && (
                  <motion.div
                    key="avatarChange"
                    animate={{ opacity: isAvatarHover ? 1 : 0 }}
                    className="absolute size-full rounded-full bg-black/50 z-50 flex justify-center items-center cursor-pointer"
                    onClick={() => setAvatarModalOpen(true)}
                  >
                    <div className="text-lg text-white text-shadow-2xs ">
                      修改头像
                    </div>
                  </motion.div>
                )}
                <motion.div
                  key="avatar"
                  animate={{ filter: isAvatarHover ? "blur(2px)" : "none" }}
                >
                  <Avatar size={140} src={getImageUrl(userInfo?.avatarUrl)} />
                </motion.div>
              </motion.div>
              <motion.div
                animate={{ y: isProfileHover ? -30 : 0 }}
                className="text-4xl text-white text-shadow-xs"
              >
                {userInfo?.nickname}
              </motion.div>
              <motion.div
                key="change"
                animate={{
                  opacity: isProfileHover ? 1 : 0,
                  y: -20,
                }}
                className="flex flex-col gap-3 items-center"
                style={{ pointerEvents: isSelf ? "auto" : "none" }}
              >
                <Link
                  href={"/"}
                  className="text-lg text-white! hover:text-blue-300! text-shadow-2xs hover:text-shadow-sm"
                >
                  修改个人资料
                </Link>
                <BannerUploadModal />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AvatarUploadModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        avatarUrl={userInfo.avatarUrl}
      />
      {/* Banner end */}
    </>
  );
}
