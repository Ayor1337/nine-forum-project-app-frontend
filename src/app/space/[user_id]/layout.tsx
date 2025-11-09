"use client";

import Footer from "@/components/ui/Footer";
import HeaderNav from "@/components/ui/HeaderNav";

export default function SpaceLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <div className="bg-gradient-to-b from-white to-slate-300 min-h-dvh">
      <div className="fixed top-0 z-999 w-full flex justify-center">
        <div className="w-full">
          <HeaderNav />
        </div>
      </div>
      <div className="w-full flex justify-center">{children}</div>
      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
}
