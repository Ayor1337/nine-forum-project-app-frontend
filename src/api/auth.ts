import request from "./request";

/**
 * 注册验证 - 发送邮箱验证码
 * @param email 邮箱地址
 */
export const registerVerify = (email: string) => {
  return request.post("/api/auth/register_verify", { email });
};

/**
 * 注册
 * @param data 注册信息
 */
export const register = (data: any) => {
  return request.post("/api/auth/register", data);
};

/**
 * 登录
 * @param data 登录信息
 */
export const login = (data: any) => {
  return request.post("/api/auth/login", data);
};

/**
 * 获取当前登录用户信息
 */
export const getCurrentUser = () => {
  return request.get("/api/auth/me");
};

/**
 * 退出登录
 */
export const logout = () => {
  return request.get("/api/auth/logout");
};
