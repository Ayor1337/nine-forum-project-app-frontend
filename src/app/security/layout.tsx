import Footer from "@/components/ui/Footer";
import HeaderNav from "@/components/ui/HeaderNav";

interface defineProps {
  children: React.ReactNode;
}

export default function SecurityLayout({ children }: defineProps) {
  return (
    <div className="min-h-screen relative">
      <div className="sticky top-0 z-999 w-full flex justify-center">
        <div className="w-full">
          <HeaderNav />
        </div>
      </div>
      <div>{children}</div>
      <div className="absolute bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
}
