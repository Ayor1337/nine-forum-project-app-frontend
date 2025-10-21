import Footer from "@/components/ui/Footer";
import SpaceWrapper from "./components/SpaceWrapper";

export default async function SpacePage({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await params;

  return (
    <>
      <SpaceWrapper user_id={user_id} />
    </>
  );
}
