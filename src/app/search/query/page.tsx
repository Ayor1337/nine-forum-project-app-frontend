"use client";

import { use } from "react";
import SearchWrapper from "./components/SearchWrapper";

interface defineProps {
  searchParams: Promise<SearchParams>;
}

export default function SearchQueryPage({ searchParams }: defineProps) {
  const params = use(searchParams);

  return (
    <div>
      <SearchWrapper param={params} />
    </div>
  );
}
