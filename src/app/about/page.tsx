// app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

/** ========= 类型定义 ========= */
type Member = {
  id: string;
  name: string;
  role: string;
  avatar?: string; // 图片地址，可为空显示占位
  links?: { label: string; href: string }[];
};

type Tech = {
  name: string;
  url?: string;
};

type Todo = {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
};

/** ========= 示例数据 ========= */
const TEAM: Member[] = [
  {
    id: "m1",
    name: "胡俊涛",
    role: "全栈工程师",
    avatar: "/wakaba.jpg", // 为空则显示占位
    links: [{ label: "GitHub", href: "https://github.com/Ayor1337" }],
  },
];

const TECHS: Tech[] = [
  { name: "React 19", url: "https://react.dev" },
  { name: "Next.js 15", url: "https://nextjs.org" },
  { name: "TypeScript", url: "https://www.typescriptlang.org" },
  { name: "TailwindCSS", url: "https://tailwindcss.com" },
  { name: "Spring Boot 3", url: "https://spring.io/projects/spring-boot" },
  { name: "Docker", url: "https://www.docker.com" },
  { name: "MySQL", url: "https://www.mysql.com" },
  { name: "Redis", url: "https://www.redis.io" },
];

const LS_KEY = "site-todos-v1";

/** 小工具：生成ID */
const uid = () => Math.random().toString(36).slice(2, 10);

export default function Page() {
  /** ========= ToDo 状态 ========= */
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");
  const [mounted, setMounted] = useState(false); // 防止SSR水合闪烁
  const inputRef = useRef<HTMLInputElement | null>(null);

  /** ========= 初始加载 / 持久化 ========= */
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setTodos(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(LS_KEY, JSON.stringify(todos));
  }, [todos, mounted]);

  const filtered = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.done);
    if (filter === "done") return todos.filter((t) => t.done);
    return todos;
  }, [todos, filter]);

  const leftCount = useMemo(() => todos.filter((t) => !t.done).length, [todos]);

  /** ========= ToDo 行为 ========= */
  const addTodo = (title: string) => {
    const t = title.trim();
    if (!t) return;
    setTodos((prev) => [
      { id: uid(), title: t, done: false, createdAt: Date.now() },
      ...prev,
    ]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const toggleTodo = (id: string) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

  const removeTodo = (id: string) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  const clearDone = () => setTodos((prev) => prev.filter((t) => !t.done));

  const renameTodo = (id: string, title: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));

  /** ========= 页面 ========= */
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-lg text-semibold hover:text-neutral-500"
            >
              Nine
            </Link>
            <span>·</span>
            <span>关于我们</span>
          </div>
          <ul className="hidden md:flex items-center gap-6 text-sm">
            <li>
              <a className="hover:text-slate-600" href="#team">
                团队
              </a>
            </li>
            <li>
              <a className="hover:text-slate-600" href="#tech">
                技术
              </a>
            </li>
            <li>
              <a className="hover:text-slate-600" href="#plan">
                功能计划
              </a>
            </li>
            <li>
              <a href="#plan" className="hover:text-slate-600">
                Todo
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          我们的开发团队与技术蓝图
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          这里透明展示谁在构建、用什么构建、打算构建什么。承诺写在
          ToDo，进度留在本地浏览器。
        </p>
      </section>

      {/* 团队 */}
      <section id="team" className="mx-auto max-w-6xl px-4 pb-6">
        <h2 className="text-2xl font-semibold">开发团队</h2>
        <p className="mt-2 text-slate-600">小而专注，乐于交付可验证价值。</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {TEAM.map((m) => (
            <article
              key={m.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* 头像 */}
              {m.avatar ? (
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-slate-100 shadow mb-4"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-slate-200 to-slate-100 ring-4 ring-slate-100 shadow mb-4 flex items-center justify-center text-slate-500 text-sm select-none">
                  头像
                </div>
              )}

              <h3 className="text-lg font-semibold">{m.name}</h3>
              <p className="text-sm text-slate-600">{m.role}</p>

              {m.links && m.links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      className="text-xs rounded-full border border-slate-300 px-3 py-1 hover:bg-slate-100"
                      target="_blank"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* 技术栈 */}
      <section id="tech" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold">使用技术</h2>
        <p className="mt-2 text-slate-600">前后端与基础设施，可按需扩展。</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {TECHS.map((t) => (
            <a
              key={t.name}
              href={t.url || "#"}
              target="_blank"
              className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm hover:bg-slate-100"
            >
              {t.name}
            </a>
          ))}
        </div>
      </section>

      {/* 功能计划 / ToDo */}
      <section id="plan" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">网站预计功能列表</h2>
            </div>
            <div className="text-sm text-slate-600">
              未完成：
              <span className="font-medium text-slate-800">{leftCount}</span> /
              总计：
              <span className="font-medium text-slate-800">{todos.length}</span>
            </div>
          </div>

          {/* 输入框 */}
          <div className="mt-6 flex gap-3">
            <input
              ref={inputRef}
              type="text"
              placeholder="输入功能，例如：用户注册、OAuth 登录、个人资料页…"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  addTodo((e.target as HTMLInputElement).value);
              }}
            />
            <button
              className="rounded-xl flex-1/10 bg-slate-900 px-5 py-3 text-white hover:opacity-90"
              onClick={() => addTodo(inputRef.current?.value || "")}
            >
              添加
            </button>
          </div>

          {/* 过滤器 */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              {(["all", "active", "done"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  className={`rounded-full px-3 py-1 border text-sm ${
                    filter === k
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {k === "all" ? "全部" : k === "active" ? "未完成" : "已完成"}
                </button>
              ))}
            </div>
            <button
              className="text-sm rounded-full border border-slate-300 px-3 py-1 hover:bg-slate-100"
              onClick={clearDone}
            >
              清除已完成
            </button>
          </div>

          {/* ToDo 列表 */}
          <ul className="mt-4 divide-y divide-slate-200">
            {filtered.length === 0 && (
              <li className="py-6 text-center text-slate-500">
                暂无任务，添加一个目标吧 🚀
              </li>
            )}
            {filtered.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleTodo(t.id)}
                  className="h-5 w-5 accent-slate-900"
                />
                <EditableTitle
                  value={t.title}
                  onChange={(v) => renameTodo(t.id, v)}
                  className={`flex-1 text-slate-800 ${
                    t.done ? "line-through text-slate-400" : ""
                  }`}
                />
                <button
                  onClick={() => removeTodo(t.id)}
                  className="text-sm rounded-xl border border-red-200 px-3 py-1 text-red-600 hover:bg-red-50"
                >
                  删除
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Nine · Dev Team
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <a className="hover:text-slate-900" href="#team">
              团队
            </a>
            <a className="hover:text-slate-900" href="#tech">
              技术
            </a>
            <a className="hover:text-slate-900" href="#plan">
              功能
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** 标题可编辑组件（回车/失焦提交，Esc 取消） */
function EditableTitle({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const input = useRef<HTMLInputElement | null>(null);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (editing) input.current?.focus();
  }, [editing]);

  const commit = () => {
    const v = draft.trim();
    if (v && v !== value) onChange(v);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (!editing) {
    return (
      <button
        className={`text-left ${className || ""}`}
        onClick={() => setEditing(true)}
        title="点击编辑"
      >
        {value}
      </button>
    );
  }

  return (
    <input
      ref={input}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") cancel();
      }}
      onBlur={commit}
      className={`flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 outline-none focus:ring-2 focus:ring-slate-400 ${
        className || ""
      }`}
    />
  );
}
