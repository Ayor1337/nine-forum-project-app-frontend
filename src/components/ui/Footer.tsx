export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
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
  );
}
