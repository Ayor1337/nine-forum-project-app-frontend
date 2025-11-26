import request from "./request";

/**
 * 根据用户ID获取用户信息
 * @param userId 用户ID
 */
export const getUserInfoById = (userId: string | number) => {
  return request.get("/api/user/info/by_user_id", {
    params: { user_id: userId },
  });
};

/**
 * 获取用户统计信息
 * @param userId 用户ID
 */
export const getUserStatistics = (userId: string | number) => {
  return request.get("/api/user/info/statistics", {
    params: { user_id: userId },
  });
};

/**
 * 修改用户信息
 * @param data 用户信息数据
 */
export const updateUserInfo = (data: any) => {
  return request.post("/api/user/info/edit", data);
};
