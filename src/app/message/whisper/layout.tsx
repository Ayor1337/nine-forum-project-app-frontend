import WhisperTabs from "./components/WhisperTabs";

interface defineProps {
  children: Readonly<React.ReactNode>;
}
export default function WhisperLayout({ children }: defineProps) {
  return (
    <div className="h-180 flex">
      <div className="flex-2/7">
        <WhisperTabs />
      </div>
      <div className="flex-5/7 ml-2">{children}</div>
    </div>
  );
}
