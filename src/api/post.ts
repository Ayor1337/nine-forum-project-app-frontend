import request from "./request";

/**
 * 发表回复
 * @param data 回复内容
 */
export const createPost = (data: { content: string | null; threadId: string | number }) => {
  return request.post("/api/post/post", data);
};

/**
 * 获取回复列表
 * @param params 分页参数
 */
export const getPostList = (params: any) => {
  return request.get("/api/post/info/list", { params });
};

/**
 * 点赞
 * @param postId 回复ID
 */
export const likePost = (postId: number) => {
  return request.post(`/api/post/like/${postId}`);
};

/**
 * 收藏
 * @param postId 回复ID
 */
export const collectPost = (postId: number) => {
  return request.post(`/api/post/collect/${postId}`);
};
