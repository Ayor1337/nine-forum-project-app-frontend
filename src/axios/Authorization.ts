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
};

export { getToken, storeSessionToken, storeLocalToken, removeToken };
