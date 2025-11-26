import request from "./request";

/**
 * 获取系统通知
 */
export const getSystemMessages = (params: any) => {
  return request.get("/api/message/system", { params });
};

/**
 * 获取回复我的消息
 */
export const getReplyMessages = (params: any) => {
  return request.get("/api/message/reply", { params });
};

/**
 * 获取私信列表
 */
export const getWhisperList = () => {
  return request.get("/api/message/whisper/list");
};

/**
 * 获取具体私信内容
 * @param whisperId 私信ID
 */
export const getWhisperDetail = (whisperId: string | number) => {
  return request.get(`/api/message/whisper/${whisperId}`);
};

/**
 * 发送私信
 * @param data 私信数据
 */
export const sendWhisper = (data: any) => {
  return request.post("/api/message/whisper/send", data);
};
