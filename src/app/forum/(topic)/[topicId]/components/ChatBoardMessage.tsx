import { getImageUrl } from "@/api/utils/image";
import { formatDate } from "@/func/DateConvert";
import { Button } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef, useState, memo } from "react";

interface defineProps {
  chatboardHistory: ChatboardHistory;
  disabled: boolean;
}

const ChatBoardMessage = ({
  chatboardHistory,
  disabled,
}: defineProps) => {
  const [isAvatarHover, serAvatarHover] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence initial={false}>
      <motion.div
        className="flex relative h-6 pointer-events-none"
        animate={{ height: isAvatarHover ? "60px" : "" }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <motion.div
          className={
            "absolute left-3 bg-white rounded-2xl overflow-hidden z-5 " +
            (disabled ? "pointer-events-none" : "pointer-events-auto")
          }
          onMouseEnter={() => serAvatarHover(true)}
          onMouseLeave={() => serAvatarHover(false)}
          animate={{
            width: isAvatarHover ? "800px" : "auto",
            height: isAvatarHover ? "60px" : "auto",
            zIndex: isAvatarHover ? 9999 : "",
          }}
          transition={{ duration: 0.18, type: "tween", ease: "easeOut" }}
        >
          <motion.img
            animate={{
              scale: isAvatarHover ? 2 : 1,
              x: isAvatarHover ? 3 : 0,
              y: isAvatarHover ? 2 : 0,
            }}
            transition={{ duration: 0.2 }}
            className="size-7 z-5 rounded-full border border-white bg-blue-300 origin-top-left"
            src={getImageUrl(chatboardHistory.avatarUrl)}
          />
          <motion.img
            animate={{
              width: isAvatarHover ? "460px" : "auto",
              height: isAvatarHover ? "70px" : "auto",
            }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 top-0 object-cover -z-1 opacity-45 mask-l-from-20%"
            src={getImageUrl(chatboardHistory.bannerUrl)}
          />
          <motion.div
            animate={{
              left: isAvatarHover ? "72px" : "0",
              opacity: isAvatarHover ? 1 : 0,
            }}
            transition={{ duration: 0.22 }}
            className="absolute top-1/2  -translate-y-1/2 font-bold pointer-events-none"
          >
            {chatboardHistory.nickname}
          </motion.div>
          <motion.div
            animate={{
              left: isAvatarHover ? "680px" : "0",
              opacity: isAvatarHover ? 1 : 0,
            }}
            transition={{ duration: 0.22 }}
            className="absolute top-1/2 -translate-y-1/2 font-bold"
          >
            <Button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/space/${chatboardHistory.accountId}`);
              }}
            >
              前往主页
            </Button>
          </motion.div>
        </motion.div>
        <div className="truncate z-4 absolute left-10 ml-2 pointer-events-none">
          {chatboardHistory.content}
        </div>
        <motion.div
          key="time"
          animate={{ opacity: isAvatarHover ? 0 : 1 }}
          className="absolute right-5 text-xs top-1/2 -translate-y-1/2"
        >
          {formatDate(chatboardHistory.createTime)}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(ChatBoardMessage);
