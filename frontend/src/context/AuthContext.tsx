import { AxiosResponse } from 'axios';
import { setCookie, destroyCookie } from 'nookies';
import { createContext, ReactNode, useState } from 'react';
import { api } from '../providers/api';
import { decode } from 'jsonwebtoken';

type LoginCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  login(credentials: LoginCredentials): Promise<void>;
  isAuthenticated: boolean;
  accessToken: string;
  refreshToken: string;
  refresh(): Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  // const [user, setUser] = UseState()
  const [accessToken, setAcessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const isAuthenticated = !!refreshToken;

  async function refresh() {
    try {
      const response: AxiosResponse<LoginResponse> = await api.get(
        'auth/refresh',
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );
      const { accessToken } = response.data;
      saveCookies({ accessToken });
    } catch (err) {
      setAcessToken('');
      setRefreshToken('');
      destroyCookie(undefined, 'pdfapp.accessToken');
      destroyCookie(undefined, 'pdfapp.refreshToken');
      console.log(err);
    }
  }

  function saveCookies({ accessToken, refreshToken }: LoginResponse) {
    if (accessToken) {
      console.log(decode(accessToken));
      setAcessToken(accessToken);
      setCookie(undefined, 'pdfapp.accessToken', accessToken, {
        maxAge: 60 * 3,
        path: '/',
      });
    }
    if (refreshToken) {
      setRefreshToken(refreshToken);
      setCookie(undefined, 'pdfapp.refreshToken', refreshToken, {
        maxAge: 60 * 3,
        path: '/',
      });
    }
  }

  async function login({ email, password }: LoginCredentials) {
    console.log({ email, password });
    try {
      const respose: AxiosResponse<LoginResponse> = await api.post(
        'auth/login'
      );
      const { accessToken, refreshToken } = respose.data;
      saveCookies({ accessToken, refreshToken });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider
      value={{ login, isAuthenticated, accessToken, refreshToken, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}
