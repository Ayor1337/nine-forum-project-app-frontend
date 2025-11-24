import Footer from "@/components/ui/Footer";
import SearchHeader from "./components/SearchHeader";

interface defineProps {
  children: Readonly<React.ReactNode>;
}

export default function SearchLayout({ children }: defineProps) {
  return (
    <div className="bg-gradient-to-b fromwhite to-slate-100 min-h-200">
      <div className="absolute top-0 w-full z-9999">
        <SearchHeader />
      </div>
      <div>{children}</div>
      <div className="fixed bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
}
