import { createContext } from "react";

interface Context {
  isLoggedIn: boolean;
  token: any;
  userId: string | boolean;
  login: (uid: string, token: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<Context>({
  isLoggedIn: false,
  token: undefined,
  userId: '',
  login: (uid)=>{},
  logout:()=>{},
})