/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  clearAuth,
  getStoredPhone,
  getStoredToken,
  isTokenExpired,
  saveAuth,
} from "@/lib/auth-client";

interface AuthContextValue {
  token: string | null;
  phone: string | null;
  isAuthenticated: boolean;
  setSession: (token: string, phone: string) => void;
  logout: () => void;
  ready: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setPhone(null);
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login?expired=true";
    }
  }, []);

  useEffect(() => {
    const storedToken = getStoredToken();

    // Check if token is already expired locally (if JWT)
    if (storedToken && isTokenExpired(storedToken)) {
      logout();
    } else {
      setToken(storedToken);
      setPhone(getStoredPhone());
    }
    setReady(true);

    // Global listener for 401 Unauthorized API responses
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [logout]);

  const setSession = useCallback((newToken: string, newPhone: string) => {
    saveAuth(newToken, newPhone);
    setToken(newToken);
    setPhone(newPhone);
  }, []);

  const value = useMemo(
    () => ({
      token,
      phone,
      isAuthenticated: Boolean(token),
      setSession,
      logout,
      ready,
    }),
    [token, phone, setSession, logout, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}