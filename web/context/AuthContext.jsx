'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as authService from '@/services/authService';

const AuthContext = createContext(null);

const emptyAuth = { token: null, user: null };

export function AuthProvider({ children }) {
  const [{ token, user }, setAuth] = useState(emptyAuth);

  useEffect(() => {
    try {
      const t = localStorage.getItem('nziza_token');
      const u = localStorage.getItem('nziza_user');
      setAuth({ token: t, user: u ? JSON.parse(u) : null });
    } catch {
      setAuth(emptyAuth);
    }
  }, []);

  const saveAuth = useCallback((authData) => {
    localStorage.setItem('nziza_token', authData.token);
    localStorage.setItem('nziza_user', JSON.stringify(authData.user));
    setAuth(authData);
  }, []);

  const login = useCallback(async (payload) => {
    const data = await authService.login(payload);
    saveAuth(data);
  }, [saveAuth]);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    saveAuth(data);
  }, [saveAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('nziza_token');
    localStorage.removeItem('nziza_user');
    setAuth({ token: null, user: null });
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
    }),
    [token, user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;

