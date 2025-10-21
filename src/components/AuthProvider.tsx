"use client";

import service from "@/axios";
import { getToken, removeToken, storeLocalToken } from "@/axios/Authorization";
import { App, FormProps } from "antd";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  login: (formdata: FormType) => void;
  logout: () => void;
  refreshUserInfo: () => void;
  currentUser: UserInfo | null;
  permissionVerify: (behavior?: string, topicId?: number) => boolean;
  isLogin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLogin, setLogin] = useState<boolean>(false);
  const { message } = App.useApp();
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    if (token) {
      setToken(token);
      getUserInfo(token);
      setLogin(true);
    }
  }, [token, isLogin]);

  const getUserInfo = async (token: string | null) => {
    if (token != null) {
      await service.get("/api/user/info").then((res) => {
        if (res.data.code == 200) {
          setUserInfo(res.data.data);
          setLogin(true);
        } else {
          message.warning(res.data.message);
        }
      });
    }
  };

  const login: FormProps<FormType>["onFinish"] = async (formData) => {
    await service
      .post(
        "/api/auth/login",
        {
          username: formData.username,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        if (res.data.code == 200) {
          message.info("登录成功");
          storeLocalToken(res.data.data.token);
          setLogin(true);
          router.push("/forum");
        } else message.warning(res.data.message || "登录异常");
      })
      .catch((res) => {
        message.error(res.data.message || "登录失败");
      });
  };

  const logout = async () => {
    await service.post("api/auth/logout").then((res) => {
      if (res.data.code == 200) {
        message.info("退出成功");
        logoutLocal();
      } else {
        logoutLocal();
      }
    });
  };

  const permissionVerify = (behavior?: string, topicId?: number) => {
    if (userInfo) {
      if (userInfo.permission.roleName == "OWNER") {
        return true;
      }
      if (userInfo.permission.roleName == "MODERATOR") {
        if (userInfo.permission.topicId) {
          if (userInfo.permission.topicId == topicId) {
            return true;
          }
        }
      }
    }

    return false;
  };

  const refreshUserInfo = () => {
    getUserInfo(token);
  };

  const logoutLocal = () => {
    setToken(null);
    setLogin(false);
    removeToken();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: userInfo,
        login,
        logout,
        isLogin,
        refreshUserInfo,
        permissionVerify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth 必须在 AuthProvider 内使用");
  return context;
};
