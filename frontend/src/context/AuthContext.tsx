import { AxiosResponse } from 'axios';
import { setCookie, destroyCookie } from 'nookies';
import { createContext, ReactNode, useState } from 'react';
import { api } from '../providers/api';
import { decode, DecodeOptions } from 'jsonwebtoken';
import { JwtPayload } from '@types/jsonwebtoken';

type LoginCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  login(credentials: LoginCredentials): Promise<void>;
  logout(): Promise<void>;
  refresh(): Promise<void>;
  isAuthenticated: boolean;
  user?: UserData;
  accessToken: string;
  refreshToken: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

type UserData = {
  id: string;
  name: string;
  email: string;
};

interface AuthJwtPayload extends JwtPayload {
  userId?: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  // const [user, setUser] = UseState()
  const [accessToken, setAcessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [user, setUser] = useState({} as UserData);
  const isAuthenticated = !!refreshToken;

  async function logout() {
    setUser({} as UserData);
    setRefreshToken('');
    setAcessToken('');
    destroyCookie(undefined, 'pdfapp.accessToken');
    destroyCookie(undefined, 'pdfapp.refreshToken');
    return;
  }

  async function fetchUserData(id?: string) {
    const userId = id ? id : user.id;
    try {
      console.log(`fetchUserData(${userId})`);
    } catch (err) {
      console.log('ERRO: fetchUserData()');
    }
  }

  function decodeToken(token: string, options?: DecodeOptions): AuthJwtPayload {
    const decoded = decode(accessToken);

    if (!decoded) {
      throw new Error('Failed to decode JWT Token');
    }
    if (typeof decoded === 'string' || decoded instanceof String) {
      throw new Error('Failed to decode JWT Token');
    }
    if (decoded.userId) {
      return decoded;
    }
    throw new Error('Failed to decode JWT Token');
  }

  async function refresh() {
    // const decodedToken = decode(accessToken, {});
    const decodedToken = decodeToken(accessToken);

    console.log(decodedToken);
    const timestamp = new Date();
    const expiresIn: Date = new Date(Number(decodedToken?.exp) * 1000);
    console.log(timestamp, ' < ', expiresIn);
    console.log(timestamp <= expiresIn);
    try {
      const response: AxiosResponse<LoginResponse> = await api.get(
        'auth/refresh',
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );
      const { accessToken } = response.data;
      saveCookies({ accessToken });
    } catch (err) {
      // Logout apenas quando for status não autorizado ??
      logout();
      console.log(err);
    }
  }

  function saveCookies({ accessToken, refreshToken }: LoginResponse) {
    if (accessToken) {
      // console.log(decode(accessToken));
      setAcessToken(accessToken);
      setCookie(undefined, 'pdfapp.accessToken', accessToken, {
        maxAge: 60 * 3,
        path: '/',
      });
    }
    if (refreshToken) {
      setRefreshToken(refreshToken);
      setCookie(undefined, 'pdfapp.refreshToken', refreshToken, {
        maxAge: 60 * 10,
        path: '/',
      });
    }
  }

  async function login({ email, password }: LoginCredentials) {
    console.log({ email, password });
    try {
      const respose: AxiosResponse<LoginResponse> = await api.post(
        'auth/login',
        { email, password }
      );
      const { accessToken, refreshToken } = respose.data;
      saveCookies({ accessToken, refreshToken });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        refresh,
        logout,
        user,
        isAuthenticated,
        accessToken,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
