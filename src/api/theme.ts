import request from "./request";

/**
 * 获取话题列表
 */
export const getThemeList = () => {
  return request.get("/api/theme/info/list");
};

/**
 * 管理员获取话题列表
 */
export const getAdminThemeList = () => {
  return request.get("/api/theme/admin/list");
};

/**
 * 新增话题
 * @param data 话题数据
 */
export const createTheme = (data: any) => {
  return request.post("/api/theme/admin/add", data);
};

/**
 * 删除话题
 * @param themeId 话题ID
 */
export const deleteTheme = (themeId: number) => {
  return request.delete(`/api/theme/admin/delete/${themeId}`);
};
