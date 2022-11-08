import { useCallback, useEffect, useState } from "react";

let logoutTimer: NodeJS.Timeout;

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState<Date>();
  const [userId, setUserId] = useState<string | boolean>(false); 

  const login = useCallback(
    (uid: string, token: string, expirationDate?: Date) => {
      setToken(token);
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uid,
          token,
          expiration: tokenExpirationDate.toISOString(),
        })
      );
      setUserId(uid);
    },
    []
  );
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(undefined);
    setUserId(false);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (
      Object.keys(storedData).length > 0 &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    }else{
      clearTimeout(logoutTimer);
    }
  }, [token, tokenExpirationDate]);

  return {userId, token, login, logout};
}