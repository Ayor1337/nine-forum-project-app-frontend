"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { Avatar } from "antd";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getImageUrl } from "@/api/utils/image";
import { useRouter } from "next/navigation";

export default function SearchHeader() {
  const { currentUser, isLogin, logout } = useAuth();
  const [isActive, setActive] = useState<boolean>(false);
  const router = useRouter();

  return (
    <div className="z-999 w-full">
      <div className=" mx-auto flex justify-between items-center px-15">
        {/* 左侧导航 */}
        <nav className="flex gap-6">
          <Link href="/" className="header-nav-link">
            主页
          </Link>
          <Link href="/forum" className="header-nav-link">
            论坛
          </Link>
          <Link href="/about" className="header-nav-link">
            联系我们
          </Link>
        </nav>

        {/* 右侧操作 */}
        {isLogin ? (
          <div className="relative">
            <AnimatePresence initial={false}>
              <div className="flex items-center gap-5">
                <motion.div
                  key="avatar"
                  initial={{ scale: 1, y: 0 }}
                  animate={{ scale: isActive ? 3 : 1, y: isActive ? 40 : 0 }}
                  exit={{ scale: 1, y: 0 }}
                  transition={{ duration: 0.15, bounce: 0.5 }}
                  className="z-99"
                  onMouseEnter={() => setActive(true)}
                  onMouseLeave={() => setActive(false)}
                >
                  <Avatar src={getImageUrl(currentUser?.avatarUrl)} />
                </motion.div>
              </div>
              <motion.div
                key="user-dropdown"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isActive ? 1 : 0,
                  pointerEvents: isActive ? "auto" : "none",
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={() => setActive(true)}
                onMouseLeave={() => setActive(false)}
                className="absolute -right-10 top-13 w-60 min-h-50 bg-white shadow "
              >
                <div className="pt-1 pb-5 px-2 w-full h-full flex flex-col items-center">
                  <div className="mb-10 self-start text-lg">
                    {currentUser?.nickname}
                  </div>
                  <div
                    className="flex flex-col
                   items-center flex-1 justify-between w-full gap-2 "
                  >
                    <Link
                      href={"/space/" + currentUser?.accountId}
                      className="hover:bg-neutral-100! text-black! w-9/10 py-2 rounded-2xl text-center transition-all cursor-pointer"
                    >
                      个人信息
                    </Link>
                    <div
                      className="hover:bg-neutral-100 w-9/10 py-2 rounded-2xl text-center transition-all cursor-pointer"
                      onClick={() => router.push("/security")}
                    >
                      安全设置
                    </div>
                    <div
                      className="hover:bg-neutral-100 w-9/10 py-2 rounded-2xl text-center transition-all cursor-pointer"
                      onClick={logout}
                    >
                      退出登录
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <Link href="/login" className="header-nav-link">
              登录
            </Link>
            <Link href="/register" className="header-nav-link">
              注册
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
