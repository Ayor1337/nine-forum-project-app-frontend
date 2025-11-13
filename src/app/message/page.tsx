"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MessagePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/message/reply");
  }, []);

  return <></>;
}
