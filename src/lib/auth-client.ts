const TOKEN_KEY = "job_token";
const PHONE_KEY = "job_phone";

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const getStoredPhone = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PHONE_KEY);
};

export const saveAuth = (token: string, phone: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(PHONE_KEY, phone);
};

export const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PHONE_KEY);
};

export const authHeaders = (): Record<string, string> => {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};