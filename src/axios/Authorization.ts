type getTokenResult = string | null;

const TOKEN_KEY = "Authorization";

const getToken = (): getTokenResult => {
  const strToken =
    localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

  return strToken;
};

const storeSessionToken = (token: string) => {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
};

const storeLocalToken = (token: string) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  // 清除 Cookie
  document.cookie =
    "Authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

const authAndSetCookie = () => {
  const token = getToken();
  if (token === null) {
    return;
  }

  if (!document.cookie.includes("Authorization")) {
    document.cookie = `Authorization=${encodeURIComponent(
      token
    )}; path=/; SameSite=Strict`;
  }
};

export {
  getToken,
  storeSessionToken,
  storeLocalToken,
  removeToken,
  authAndSetCookie,
};
