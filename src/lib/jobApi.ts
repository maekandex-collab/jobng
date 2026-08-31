import { API_BASE_URL } from "./config";
import { Question, JobRole } from "@/types/interview";
import { fetchWithAuth, getStoredToken, notifyUnauthorized } from "@/lib/auth-client";

interface ApiQuestion {
  question: string;
  options: string[];
  answer: number;
}

interface ProxyResponse {
  questions: ApiQuestion[];
}

export interface Apijustjob {
  job_id: string;
  job_title: string | null;
  job_url: string | null;
  created_at: string;
  company_name: string;
  company_website: string | null;
  category: string | null;
  description: string | null;
  is_active?: boolean;
  status?: string;
}

export interface PagedJobsResponse {
  items: Apijustjob[];
  count: number;
}

export interface AuthSuccessData {
  access?: string;
  token?: string;
  access_token?: string;
  message?: string;
  detail?: string;
  data?: Record<string, unknown>;
}

export interface ApiResult<T = Record<string, unknown>> {
  ok: boolean;
  status: number;
  data: T;
  datalength?: number;
}

export interface UpdateApiResult {
  ok: boolean;
  status: number;
  message: string;
}

export interface TotalJobsData {
  total_jobs: number;
  "Area service": string;
}

export interface GetTotalJobsResponse {
  ok: boolean;
  status: number;
  data?: TotalJobsData;
  message?: string;
}

export function extractItems(data: Record<string, unknown>): Apijustjob[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

export function extractError(
  data: Record<string, unknown> | null | undefined | unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!data || typeof data !== "object") return fallback;

  const record = data as Record<string, unknown>;

  // 1. Direct string properties
  if (typeof record.detail === "string") return record.detail;
  if (typeof record.error === "string") return record.error;
  if (typeof record.message === "string") return record.message;

  // 2. FastAPI / Pydantic validation array (`detail: [{ msg: "..." }]`)
  if (Array.isArray(record.detail) && record.detail.length > 0) {
    const first = record.detail[0];
    if (typeof first === "string") return first;
    if (
      typeof first === "object" &&
      first !== null &&
      "msg" in first &&
      typeof first.msg === "string"
    ) {
      return first.msg;
    }
  }

  // 3. Field validation object maps
  for (const value of Object.values(record)) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
    if (Array.isArray(value) && value.length > 0) {
      if (typeof value[0] === "string") return value[0];
      if (
        typeof value[0] === "object" &&
        value[0] !== null &&
        "message" in value[0] &&
        typeof value[0].message === "string"
      ) {
        return value[0].message;
      }
    }
  }

  return fallback;
}

export function extractToken(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;

  const tokenKeys = [
    "access",
    "access_token",
    "accessToken",
    "token",
    "jwt",
    "authToken",
    "key",
  ];

  for (const key of tokenKeys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return sanitizeToken(value);
    }
  }

  const wrapperKeys = ["data", "auth", "result", "tokens", "payload"];
  for (const wrapperKey of wrapperKeys) {
    const nested = record[wrapperKey];
    if (nested && typeof nested === "object") {
      const extracted = extractToken(nested);
      if (extracted) return extracted;
    }
  }

  return null;
}

function sanitizeToken(token: string): string {
  return token
    .trim()
    .replace(/^Bearer\s+/i, "")
    .trim();
}

/**
 * Helper to build headers with automatic Auth token injection
 */
/**
 * Upstream justjob list/detail expect Bearer AND a session cookie:
 *   <user_id>="{\"session_id\":\"…\",\"access_token\":\"…\"}"
 * Login sets that cookie on mtn.lenhub.net, which the Next.js BFF never
 * receives — rebuild it from the JWT so /api/jobs stops returning empty.
 */
function buildAuthHeaders(
  token?: string,
  extraHeaders: Record<string, string> = {},
): Record<string, string> {
  const activeToken = token || getStoredToken();
  const headers: Record<string, string> = { ...extraHeaders };
  if (!activeToken) return headers;

  headers.Authorization = `Bearer ${activeToken}`;

  try {
    const parts = activeToken.split(".");
    if (parts.length >= 2) {
      const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
      const payload = JSON.parse(
        Buffer.from(padded, "base64").toString("utf-8"),
      ) as { user_id?: string; session_id?: string };

      if (payload.user_id && payload.session_id) {
        const body = JSON.stringify({
          session_id: payload.session_id,
          access_token: activeToken,
        });
        headers.Cookie = `${payload.user_id}=${JSON.stringify(body)}`;
      }
    }
  } catch {
    // Bearer-only fallback
  }

  return headers;
}

/**
 * Helper to check 401 status and trigger local storage purging + re-login
 */
function checkUnauthorized(status: number): void {
  if (status === 401) {
    notifyUnauthorized();
  }
}

async function parseJson<T = Record<string, unknown>>(
  res: Response,
): Promise<T> {
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (typeof data === "string") {
      return { message: data } as unknown as T;
    }
    return data as T;
  } catch {
    return {
      message: text || res.statusText || "An unexpected error occurred",
    } as unknown as T;
  }
}

export async function registerUser(body: {
  number: string;
  pin: string;
  confirm_pin: string;
}): Promise<ApiResult<AuthSuccessData>> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/justjob/create/user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return {
    ok: res.ok,
    status: res.status,
    data: await parseJson<AuthSuccessData>(res),
  };
}

export async function loginUser(body: {
  number: string;
  pin: string;
}): Promise<ApiResult<AuthSuccessData>> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/justjob/login/user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return {
    ok: res.ok,
    status: res.status,
    data: await parseJson<AuthSuccessData>(res),
  };
}

export async function forgotPassword(body: {
  phone_number: string;
}): Promise<ApiResult> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/justjob/forgot/password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status, data: await parseJson(res) };
}

export async function changePassword(
  body: { new_pin: string; old_pin: string },
  token?: string,
): Promise<ApiResult> {
  const headers = buildAuthHeaders(token, { "Content-Type": "application/json" });

  const res = await fetchWithAuth(`${API_BASE_URL}/api/justjob/change/password/`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  checkUnauthorized(res.status);

  return { ok: res.ok, status: res.status, data: await parseJson(res) };
}

export async function resetPassword(body: {
  phone_number: string;
  pin: string;
}): Promise<ApiResult> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/justjob/reset/password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status, data: await parseJson(res) };
}

export async function updatePassword({
  number,
  pin,
  confirm_pin,
}: {
  number: string;
  pin: string;
  confirm_pin: string;
}): Promise<UpdateApiResult> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/justjob/update/password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ number, pin, confirm_pin }),
  });

  const data = await parseJson(res);
  const message = res.ok
    ? (data.message as string) ||
      (data.detail as string) ||
      "PIN updated successfully."
    : extractError(data);

  return {
    ok: res.ok,
    status: res.status,
    message,
  };
}

export async function getTotalJobs(): Promise<GetTotalJobsResponse> {
  try {
    const result = await fetchWithAuth(`${API_BASE_URL}/api/justjob/total_jobs`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await parseJson<Record<string, unknown>>(result);

    if (!result.ok) {
      return {
        ok: false,
        status: result.status,
        message: extractError(data) || "Failed to fetch total jobs data.",
      };
    }

    const rawTotalJobs = data.total_jobs;
    const totalJobsNumber =
      typeof rawTotalJobs === "number"
        ? rawTotalJobs
        : typeof rawTotalJobs === "string"
          ? parseInt(rawTotalJobs, 10) || 0
          : 0;

    const rawAreaService = data["Area service"];
    const areaServiceString =
      typeof rawAreaService === "string" ? rawAreaService : "";

    return {
      ok: true,
      status: result.status,
      data: {
        total_jobs: totalJobsNumber,
        "Area service": areaServiceString,
      },
    };
  } catch (error) {
    console.error("Total Jobs Error:", error);
    return {
      ok: false,
      status: 500,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected network error occurred.",
    };
  }
}

export async function getJobs(
  params: {
    search?: string;
    category?: string;
    page?: number;
    page_size?: number;
  },
  token?: string,
): Promise<ApiResult<PagedJobsResponse>> {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.category) qs.set("category", params.category.toLowerCase());
  if (params.page) qs.set("page", String(params.page));
  if (params.page_size) qs.set("page_size", String(params.page_size));

  const headers = buildAuthHeaders(token);

  try {
    const res = await fetchWithAuth(
      `${API_BASE_URL}/api/justjob/jobs/${qs.toString() ? `?${qs.toString()}` : ""}`,
      { headers, cache: "no-store" },
    );

    checkUnauthorized(res.status);

    const rawData = await parseJson<Record<string, unknown>>(res);
    const items = extractItems(rawData);

    const count =
      typeof rawData.count === "number"
        ? rawData.count
        : typeof rawData.total === "number"
          ? rawData.total
          : items.length;

    const data: PagedJobsResponse = { items, count };

    return { ok: res.ok, status: res.status, data, datalength: count };
  } catch (error) {
    console.error("getJobs error:", error);
    return {
      ok: false,
      status: 500,
      data: { items: [], count: 0 },
      datalength: 0,
    };
  }
}

export async function getSingleJob(
  justjobId: string,
  token?: string,
): Promise<ApiResult<Apijustjob | null>> {
  if (!justjobId) {
    return { ok: false, status: 400, data: null };
  }

  const qs = new URLSearchParams();
  qs.set("job_id", justjobId);

  const headers = buildAuthHeaders(token);

  try {
    const res = await fetchWithAuth(
      `${API_BASE_URL}/api/justjob/single/job/?${qs.toString()}`,
      { headers, next: {revalidate: 60} },
    );

    checkUnauthorized(res.status);

    const rawData = await parseJson(res);

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        data: null,
      };
    }

    let unwrappedJob: Record<string, unknown> = rawData;
    if (rawData && typeof rawData === "object") {
      if (
        "data" in rawData &&
        rawData.data &&
        typeof rawData.data === "object"
      ) {
        unwrappedJob = rawData.data as Record<string, unknown>;
      } else if (
        "job" in rawData &&
        rawData.job &&
        typeof rawData.job === "object"
      ) {
        unwrappedJob = rawData.job as Record<string, unknown>;
      } else if (
        "items" in rawData &&
        Array.isArray(rawData.items) &&
        rawData.items.length > 0
      ) {
        unwrappedJob = rawData.items[0];
      }
    }

    return {
      ok: true,
      status: res.status,
      data: unwrappedJob as unknown as Apijustjob,
    };
  } catch (error) {
    console.error("getSingleJob error:", error);
    return {
      ok: false,
      status: 500,
      data: null,
    };
  }
}

export async function fetchQuestionsFromApi(
  category: JobRole | string,
  number: number,
  token?: string
): Promise<Question[]> {
  const headers = buildAuthHeaders(token, { "Content-Type": "application/json" });

  try {
    const url = `${API_BASE_URL}/api/maekandex/academy?number=${number}&category=${encodeURIComponent(category)}`;
    const response = await fetchWithAuth(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      checkUnauthorized(response.status);

      const errorText = await response.text().catch(() => "");
      console.error(`API Error (${response.status}): ${errorText || response.statusText}`);

      if (response.status === 401 || response.status === 403) {
        throw new Error("Unauthorized access. Token expired or invalid. Redirecting to login...");
      } else if (response.status === 404) {
        throw new Error("We couldn't find any questions for this category.");
      } else if (response.status >= 500) {
        throw new Error("We are currently experiencing issues. Please try again later.");
      } else {
        throw new Error("Unable to load questions right now.");
      }
    }

    const data: ProxyResponse = await response.json();

    if (!data || !Array.isArray(data.questions)) {
      console.error('Invalid response structure: "questions" array was not returned.', data);
      throw new Error("Questions are not available for this.");
    }

    return data.questions.map((q, index) => ({
      id: `q-${Date.now()}-${index}`,
      category: category,
      jobRole: category as JobRole,
      questionText: q.question,
      options: q.options,
      correctOptionIndex: q.answer,
    }));
  } catch (error) {
    console.error("Error fetching questions:", error);
    if (error instanceof Error) throw error;
    throw new Error("Unable to connect. Please check your internet connection.");
  }
}