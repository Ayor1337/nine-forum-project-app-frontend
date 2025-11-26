import request from "./request";

/**
 * 获取公告列表
 * @param topicId 话题ID
 */
export const getAnnouncements = (topicId: string | number) => {
  return request.get("/api/thread/info/announcement", {
    params: { topic_id: topicId },
  });
};

/**
 * 查看帖子 (增加阅读量)
 * @param threadId 帖子ID
 */
export const viewThread = (threadId: string | number) => {
  return request.post("/api/thread/view", {}, {
    params: { thread_id: threadId },
  });
};

/**
 * 获取帖子列表
 * @param params 分页及过滤参数
 */
export const getThreadList = (params: any) => {
  return request.get("/api/thread/info/list", { params });
};

/**
 * 发布新帖子
 * @param data 帖子数据
 */
export const createThread = (data: any) => {
  return request.post("/api/thread/post", data);
};
