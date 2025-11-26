"use client";

import request from "@/api/request";
import { ClockCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SearchPage() {
  const BASE_SEARCH_HEIGHT = 48;

  const [query, setQuery] = useState("");
  const [isInput, setIsInput] = useState(false);
  const router = useRouter();
  const [history, setHistory] = useState<Array<string>>([]);
  const [hotkeywords, setHotkeywords] = useState<Array<Hotkeyword>>([]);

  const fetchSerachHistory = useCallback(async () => {
    await request
      .get("/api/search/history")
      .then((res) => {
        if (res.data.code == 200) {
          setHistory(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const fetchHotkeys = useCallback(async () => {
    await request
      .get("/api/search/info/hot_keyword", {
        params: {
          size: 10,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          console.log(res.data.data);

          setHotkeywords(res.data.data);
        }
      });
  }, []);

  const removeSearchHistory = useCallback(async (key: string) => {
    await request
      .delete("/api/search/history", {
        params: {
          query: key,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          fetchSerachHistory();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSearch = () => {
    if (query.trim() == "") {
      return;
    }
    router.push(`/search/query?q=${query}`);
  };

  function searchHistoryHeight() {
    if (history == null) {
      return 48;
    }
    if (history.length >= 0) {
      return 38 * history.length + 52;
    } else {
      return 48;
    }
  }

  useEffect(() => {
    fetchSerachHistory();
    fetchHotkeys();
  }, []);

  return (
    <div className="w-full relative h-200 flex justify-center items-center">
      <div className="flex w-full flex-col items-center">
        <div className="text-4xl font-bold mb-3">
          Search what you looking for
        </div>
        <div className="relative w-full h-12">
          <AnimatePresence initial={false}>
            <motion.div
              animate={{ height: isInput ? searchHistoryHeight() : 48 }}
              className="absolute left-1/2 -translate-x-1/2 min-h-12 overflow-hidden w-200 bg-neutral-100 rounded-3xl "
            >
              <div className="relative overflow-hidden">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="border-0 ring-0 outline-none py-3 pr-40 pl-10 w-full"
                  onFocus={() => setIsInput(true)}
                  onBlur={() => setIsInput(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                <SearchOutlined className="absolute left-5 top-1/2 -translate-y-1/2" />
                <AnimatePresence initial={false}>
                  <motion.div
                    className="absolute right-5 top-1/2 -translate-y-1/2  text-neutral-300"
                    animate={{ x: query ? 0 : 100 }}
                  >
                    <div
                      className="cursor-pointer transition hover:scale-120"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSearch();
                      }}
                    >
                      按回车搜索
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex flex-col items-center origin-center w-full h-full">
                <motion.div
                  animate={{
                    scaleX: isInput && history.length > 0 ? 1 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                  className="w-19/20 h-[1px] bg-black/35 mb-1"
                />
                {history.map((item, index) => (
                  <SearchHistoryItem
                    key={index}
                    query={item}
                    onDelete={removeSearchHistory}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="text-neutral-200">
          Search Powered by Elasticsearch 9.2.1
        </div>
      </div>
    </div>
  );
}

function SearchHistoryItem({
  query,
  onDelete,
}: {
  query: string;
  onDelete: (keyword: string) => void;
}) {
  const router = useRouter();

  return (
    <div
      className="flex transition-all w-full px-5 cursor-pointer hover:bg-neutral-200 py-2"
      onClick={() => {
        router.push(`/search/query?q=${query}`);
      }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      <div className="w-5">
        <ClockCircleOutlined />
      </div>
      <div>{query}</div>
      <div
        className="ml-auto hover:text-blue-500 hover:underline text-neutral-600 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(query);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      >
        清除
      </div>
    </div>
  );
}
