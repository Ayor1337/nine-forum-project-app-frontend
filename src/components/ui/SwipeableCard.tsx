import { UnorderedListOutlined } from "@ant-design/icons";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";

// 工具函数
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const getClientX = (e: any) =>
  e?.touches?.[0]?.clientX ??
  e?.changedTouches?.[0]?.clientX ??
  e?.clientX ??
  0;

type SwipeableRowProps = {
  actionWidth?: number; // 右侧操作区宽度
  actions: React.ReactNode; // 右侧操作区内容（按钮们）
  children: React.ReactNode; // 卡片主体（被拖动部分）
  className?: string;
  canSwipe?: boolean;
};

/** ---------- /SwipeableRow ---------- */

export default function SwipeableRow({
  actionWidth = 192,
  actions,
  canSwipe = true,
  children,
  className,
}: SwipeableRowProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [tx, setTx] = useState(0); // translateX，范围 [ -actionWidth, 0 ]
  const [dragging, setDragging] = useState<boolean>(false);
  const startXRef = useRef(0);
  const startTxRef = useRef(0);
  const threshold = actionWidth * 0.45; // 吸附阈值

  // 仅当按在“右侧手柄区域”或元素标记 data-drag-handle 时才允许开始拖动
  const isInHandle = (e: any) => {
    const t = (e?.target as HTMLElement) || null;
    if (!t) return false;
    // 方案1：标记元素
    if (t.closest("[data-drag-handle]")) return true;
    return false;
  };

  const snapTo = (to: number) => {
    const node = rowRef.current;
    if (!node) return;
    node.style.transition = "transform 180ms ease";
    setTx(to);
    const clear = () => (node.style.transition = "");
    node.addEventListener("transitionend", clear, { once: true });
  };

  const onStart = (e: any) => {
    if (!isInHandle(e)) return; // 关键：限制起手区域
    setDragging(true);
    startXRef.current = getClientX(e);
    startTxRef.current = tx;
  };

  const onMove = (e: any) => {
    if (!dragging) return;
    const dx = getClientX(e) - startXRef.current;
    setTx(clamp(startTxRef.current + dx, -actionWidth, 0));
  };

  const onEnd = () => {
    if (!dragging) return;
    setDragging(false);
    const opened = Math.abs(tx) > threshold;
    snapTo(opened ? -actionWidth : 0);
  };

  useEffect(() => {
    const up = () => dragging && onEnd();
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, [dragging, tx]);

  return (
    <div className={`relative select-none ${className ?? ""}`}>
      {/* 右侧操作区（固定） */}
      <div
        className="absolute right-0 top-0 h-full flex justify-end"
        style={{ width: actionWidth }}
      >
        {actions}
      </div>

      {/* 内容区（可拖动） */}
      <div
        ref={rowRef}
        className={`relative bg-white overflow-hidden will-change-transform ${
          dragging ? "cursor-grabbing" : "cursor-default"
        }`}
        style={{ transform: `translateX(${tx}px)` }}
        // 事件挂在容器上，但只有在手柄起手才会进入拖动态
        onMouseDown={onStart}
        onMouseMove={onMove}
        onMouseUp={onEnd}
        role="group"
        aria-label="向左滑动以显示操作"
      >
        {/* 右侧“拖动柄”：仅这块区域可拖动 */}
        {canSwipe && (
          <div
            data-drag-handle
            className="absolute inset-y-0 right-0 w-55
                     bg-gradient-to-l from-transparent to-transparent
                     flex items-center justify-center
                     cursor-grab active:cursor-grabbing select-none
                     text-neutral-300 hover:text-neutral-500 z-999"
            // 防止把内部点击冒泡成打开详情之类的点击
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute right-10">
              <UnorderedListOutlined />
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
