import axios from "axios";
import { getToken } from "./Authorization";
const service = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
});

// 配置请求拦截器
service.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = "Bearer " + getToken();
    return config;
  },
  (error) => {
    return error;
  }
);

// 配置响应拦截器
service.interceptors.response.use(
  (resp) => {
    return resp;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
