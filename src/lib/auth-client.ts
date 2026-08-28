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
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PHONE_KEY);
};

export const authHeaders = (): Record<string, string> => {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Dispatch a browser event when a token is invalid/expired
export const notifyUnauthorized = (): void => {
  clearAuth();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
  }
};

// Optional: Client-side check if token is a standard JWT and expired
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    return payload.exp * 1000 < Date.now();
  } catch {
    return false; // If non-JWT token, defer validation to API (401 response)
  }
};

// Centralized authenticated fetch wrapper
export const fetchWithAuth = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const headers = new Headers(init?.headers || {});
  const token = getStoredToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(input, { ...init, headers });

  // Handle 401 Unauthorized (Expired or invalid token)
  if (response.status === 401) {
    notifyUnauthorized();
  }

  return response;
};