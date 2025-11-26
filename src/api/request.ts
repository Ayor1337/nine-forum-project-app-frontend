import axios from "axios";
import { getToken } from "./utils/auth";

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
});

// 配置请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 配置响应拦截器
request.interceptors.response.use(
  (resp) => {
    return resp;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
