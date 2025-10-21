import HeaderNav from "@/components/ui/HeaderNav";

interface defineProps {
  children: Readonly<React.ReactNode>;
}

export default function AdminLayout({ children }: defineProps) {
  return (
    <div>
      <HeaderNav width={1200} />
      <div className="flex justify-center">
        <div className="w-[1200px] rounded-xl border border-black/5 bg-white shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
