"use client";

import { Button, Card } from "antd";
import Link from "next/link";
import "@ant-design/v5-patch-for-react-19";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <div>
      {/* 主页Banner start */}
      <div className="relative w-full h-120">
        <div className="h-120 overflow-hidden">
          <img src="/banner.png" className="size-full object-cover " alt="" />
        </div>
        {/* 登录按钮 start */}
        <div className="absolute bottom-0 flex flex-col items-center w-full group ">
          <Link
            href={"/forum"}
            className="group group-pointer w-full text-center z-10"
          >
            <div className="px-20 py-7 bg-transparent  group-hover:bg-blue-600 transition-all">
              <div className="group-hover:text-blue-300 text-shadow-lg transition-all text-4xl text-white">
                进入论坛
              </div>
            </div>
          </Link>
          <Link
            className="text-sm! w-full! text-center bg-transparent! py-4 text-neutral-600! hover:text-neutral-800! hover:font-bold! transition-all! absolute top-full group group-hover:-translate-0! group-hover:bg-neutral-700/15! -translate-y-15! -z-10! group-hover:z-999!"
            href={"/register"}
          >
            没有账号？去注册一个
          </Link>
        </div>
        {/* 登录按钮 end */}
      </div>
      {/* 主页Banner end */}

      {/* 主页主要内容 start */}
      <div className="relative w-full flex flex-col items-center gap-20 py-20 px-5">
        {/* 特色介绍 */}
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card title="讨论区" className="shadow-xl rounded-2xl">
            <p>和大家一起分享观点，交流想法。</p>
          </Card>
          <Card title="学习资源" className="shadow-xl rounded-2xl">
            <p>获取课程资料、代码示例、学习笔记。</p>
          </Card>
          <Card title="成长记录" className="shadow-xl rounded-2xl">
            <p>记录学习和项目进展，见证自己的成长。</p>
          </Card>
        </div>

        {/* 最新帖子预览 */}
        {/* <div className="max-w-5xl w-full">
          <h2 className="text-2xl font-bold mb-5">最新帖子</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              title="如何入门 Spring Boot?"
              extra={<Link href="/forum/1">查看</Link>}
            >
              <p>讨论 Spring Boot 的基本配置与项目实践。</p>
            </Card>
            <Card
              title="前端动画最佳实践"
              extra={<Link href="/forum/2">查看</Link>}
            >
              <p>探索 React / Next.js 动画实现技巧。</p>
            </Card>
          </div>
        </div> */}

        {/* CTA 按钮 */}
        <div className="flex gap-5">
          <Link href="/forum">
            <Button type="primary" size="large">
              进入论坛
            </Button>
          </Link>
          <Link href="/register">
            <Button size="large">注册账号</Button>
          </Link>
        </div>
      </div>
      {/* 主页主要内容 end */}

      {/* 页脚 */}
      <Footer />
    </div>
  );
}
