"use client";

import { Button, Card } from "antd";
import Link from "next/link";
import "@ant-design/v5-patch-for-react-19";
import Footer from "@/components/ui/Footer";
import { getImageUrl } from "@/axios/ImageService";
import { useRouter } from "next/navigation";
import service from "@/axios";
import { 
  CommentOutlined, 
  CloudDownloadOutlined, 
  LineChartOutlined,
  CheckCircleFilled,
  ArrowRightOutlined
} from "@ant-design/icons";

export default function Home() {
  const router = useRouter();

  const handleEnter = async () => {
    await service
      .get("/")
      .then((res) => {
        router.push("/forum");
      })
      .catch((err) => {
        router.push("/error/network");
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* ======================================= */}
      {/* 1. 主页Banner (完全保留你的原始代码) */}
      {/* ======================================= */}
      <div className="relative w-full h-120">
        <div className="h-120 overflow-hidden relative">
          <img
            src={getImageUrl("nineforum/static/banner.png")}
            className="size-full object-cover absolute bottom-0"
            alt=""
          />
        </div>
        {/* 登录按钮 start */}
        <div className="absolute bottom-0 flex flex-col items-center w-full group ">
          <div
            onClick={handleEnter}
            className="group group-pointer w-full text-center z-10 cursor-pointer"
          >
            <div className="px-20 py-7 bg-transparent group-hover:bg-blue-600 transition-all">
              <div className="text-shadow-lg transition-all text-4xl text-white">
                进入论坛
              </div>
            </div>
          </div>
          <Link
            className="text-sm! w-full! text-center bg-transparent! py-4 text-neutral-600! hover:text-neutral-800! hover:font-bold! transition-all! absolute top-full group group-hover:-translate-0! group-hover:bg-neutral-700/15! -translate-y-15! -z-10! group-hover:z-999!"
            href={"/register"}
          >
            没有账号？去注册一个
          </Link>
        </div>
        {/* 登录按钮 end */}
      </div>
      {/* Banner End */}

      {/* ======================================= */}
      {/* 2. 核心特性展示 (Feature Highlights) */}
      {/* ======================================= */}
      <div className="w-full py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          {/* 标题区 */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
              探索、分享、共同进步
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              NineForum 致力于为开发者提供一个纯粹的技术交流平台，在这里你可以找到你需要的一切。
            </p>
          </div>

          {/* 卡片区 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* 特性 1: 讨论 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 group">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <CommentOutlined className="text-3xl text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">深度技术探讨</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                拒绝水贴。这里聚集了热爱技术的伙伴，无论是框架原理还是架构设计，都能找到深度共鸣。
              </p>
            </div>

            {/* 特性 2: 资源 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors duration-300">
                <CloudDownloadOutlined className="text-3xl text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">精选学习资源</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                从入门教程到实战源码，整合全网优质资源。不再为找不到学习资料而发愁，一键获取。
              </p>
            </div>

            {/* 特性 3: 成长 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 group">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                <LineChartOutlined className="text-3xl text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">可视化成长</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                你的每一次发帖、每一个项目、每一天的打卡，都会被系统记录，见证你从小白到大牛的蜕变。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================= */}
      {/* 3. 为什么选择我们 (Value Props) */}
      {/* ======================================= */}
      <div className="w-full py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              构建更友好的<br/> <span className="text-blue-600">开发者社区生态</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircleFilled className="text-blue-600 text-xl mt-1" />
                <div>
                  <h4 className="font-bold text-slate-700">开源与分享精神</h4>
                  <p className="text-sm text-slate-500">我们鼓励开源，提倡无私的技术分享。</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleFilled className="text-blue-600 text-xl mt-1" />
                <div>
                  <h4 className="font-bold text-slate-700">纯净的阅读体验</h4>
                  <p className="text-sm text-slate-500">无广告打扰，专注于内容本身，支持 Markdown 完美渲染。</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleFilled className="text-blue-600 text-xl mt-1" />
                <div>
                  <h4 className="font-bold text-slate-700">友好的互助氛围</h4>
                  <p className="text-sm text-slate-500">无论是新手还是专家，在这里都能受到尊重。</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧装饰性区域 */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-sm aspect-square bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full flex items-center justify-center animate-pulse-slow">
               {/* 这里用文字代替图片，保持简洁 */}
               <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl">
                  <div className="text-5xl font-bold text-blue-600 mb-2">100+</div>
                  <div className="text-slate-500">每日新增话题</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================= */}
      {/* 4. 底部 CTA (Call to Action) */}
      {/* ======================================= */}
      <div className="w-full py-20 bg-slate-900 text-center px-4">
        <h2 className="text-3xl font-bold text-white mb-6">准备好开始了吗？</h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          加入 NineForum，开启你的技术分享之旅。现在注册，立即参与讨论。
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            type="primary" 
            size="large" 
            className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-500 border-none"
            onClick={handleEnter}
          >
            进入论坛
          </Button>
          <Link href="/register">
            <Button 
              ghost 
              size="large" 
              className="h-12 px-8 text-lg text-white border-white hover:text-blue-400 hover:border-blue-400"
            >
              注册账号 <ArrowRightOutlined />
            </Button>
          </Link>
        </div>
      </div>

      {/* 页脚 */}
      <Footer />
    </div>
  );
}