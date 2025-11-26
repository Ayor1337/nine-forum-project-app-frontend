import request from "./request";

/**
 * 搜索帖子
 * @param params 搜索参数 (query, page, size 等)
 */
export const searchThreads = (params: any) => {
  return request.get("/api/search/search", { params });
};
