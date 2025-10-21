import Footer from "@/components/ui/Footer";
import ForumBreadcrumb from "@/components/ui/ForumBreadcrumb";
import HeaderNav from "@/components/ui/HeaderNav";

export default function ForumLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full bg-gradient-to-b from-white to-slate-50">
      <div className="sticky top-0 z-999 w-full flex justify-center">
        <div className="w-full">
          <HeaderNav width={1200} />
        </div>
      </div>

      <div className="pb-20 w-[1200px] min-h-dvh mx-auto">
        {/* Breadcrumb Start */}
        <div className="py-5 pl-2">
          <ForumBreadcrumb />
        </div>
        {/* Breadcrumb End */}

        <div>{children}</div>
      </div>

      <Footer />
    </div>
  );
}
