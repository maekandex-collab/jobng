/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getJobs, Apijustjob } from "@/lib/jobApi";
import { trainOnJobDescriptions } from "@/lib/html";

// Cache duration: 5 minutes stale threshold, Background update
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheStore {
  items: Apijustjob[];
  timestamp: number;
  isUpdating: boolean;
}

let globalJobsCache: CacheStore | null = null;

function extractItems(data: any): Apijustjob[] {
  if (Array.isArray(data)) return data;
  if (data?.items && Array.isArray(data.items)) return data.items;
  if (data?.data && Array.isArray(data.data)) return data.data;
  if (data?.results && Array.isArray(data.results)) return data.results;
  return [];
}

function filterJobs(
  items: Apijustjob[],
  search?: string,
  category?: string
): Apijustjob[] {
  if (!search && !category) return items;

  const catTerm = category?.toLowerCase().trim();
  const searchTerm = search?.toLowerCase().trim();

  return items.filter((j) => {
    const jCat = j.category?.toLowerCase() || "";
    const jTitle = j.job_title?.toLowerCase() || "";
    const jDesc = j.description?.toLowerCase() || "";
    const jCompany = j.company_name?.toLowerCase() || "";

    if (catTerm) {
      const catMatch =
        jCat === catTerm ||
        jCat.includes(catTerm) ||
        jTitle.includes(catTerm) ||
        jDesc.includes(catTerm);
      if (!catMatch) return false;
    }

    if (searchTerm) {
      const searchMatch =
        jTitle.includes(searchTerm) ||
        jCompany.includes(searchTerm) ||
        jCat.includes(searchTerm) ||
        jDesc.includes(searchTerm);
      if (!searchMatch) return false;
    }

    return true;
  });
}

/**
 * Optimized upstream fetch using parallel requests (Promise.all)
 */
async function fetchAllUpstreamJobs(token?: string): Promise<Apijustjob[]> {
  const FETCH_PAGE_SIZE = 100;
  const MAX_PAGES = 10;

  // 1. Fetch Page 1 first
  const page1Result = await getJobs({ page: 1, page_size: FETCH_PAGE_SIZE }, token);
  if (!page1Result.ok) return [];

  const page1Items = extractItems(page1Result.data);
  if (page1Items.length === 0) return [];

  const allJobs: Apijustjob[] = [...page1Items];

  // 2. Fetch remaining pages 2..10 concurrently if Page 1 was full
  if (page1Items.length === FETCH_PAGE_SIZE) {
    const pagePromises = [];
    for (let page = 2; page <= MAX_PAGES; page++) {
      pagePromises.push(getJobs({ page, page_size: FETCH_PAGE_SIZE }, token));
    }

    const results = await Promise.allSettled(pagePromises);

    for (const res of results) {
      if (res.status === "fulfilled" && res.value.ok) {
        const items = extractItems(res.value.data);
        if (items.length > 0) allJobs.push(...items);
      }
    }
  }

  // Deduplicate items
  const uniqueMap = new Map<string, Apijustjob>();
  for (const job of allJobs) {
    if (job.job_id) uniqueMap.set(job.job_id, job);
  }

  const uniqueJobs = Array.from(uniqueMap.values());

  // Asynchronously schedule training so it doesn't block CPU on request
  setImmediate(() => {
    trainOnJobDescriptions(uniqueJobs);
  });

  return uniqueJobs;
}

/**
 * Revalidates cache in background without blocking current user request
 */
async function revalidateCacheInBackground(token?: string) {
  if (!globalJobsCache || globalJobsCache.isUpdating) return;
  globalJobsCache.isUpdating = true;

  try {
    const freshJobs = await fetchAllUpstreamJobs(token);
    if (freshJobs.length > 0) {
      globalJobsCache = {
        items: freshJobs,
        timestamp: Date.now(),
        isUpdating: false,
      };
    }
  } catch (err) {
    console.error("Background cache revalidation failed:", err);
  } finally {
    if (globalJobsCache) globalJobsCache.isUpdating = false;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || undefined;
    const category = searchParams.get("category")?.trim().toLowerCase() || undefined;

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.max(1, Number(searchParams.get("page_size")) || 15);

    const authHeader = req.headers.get("authorization") ?? undefined;
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return NextResponse.json(
        {
          ok: false,
          requiresAuth: true,
          error: "Sign in to browse jobs.",
          items: [],
          count: 0,
        },
        { status: 401 },
      );
    }

    const now = Date.now();
    const isCacheExpired =
      !globalJobsCache || now - globalJobsCache.timestamp > CACHE_TTL_MS;

    // Cold boot: Must wait for initial fetch
    if (!globalJobsCache) {
      const initialJobs = await fetchAllUpstreamJobs(token);
      // Do not poison cache with empty upstream failures
      if (initialJobs.length > 0) {
        globalJobsCache = {
          items: initialJobs,
          timestamp: now,
          isUpdating: false,
        };
      } else {
        return NextResponse.json({
          ok: true,
          items: [],
          count: 0,
        });
      }
    } else if (isCacheExpired) {
      // Stale cache available: Serve stale instantly & refresh in background
      revalidateCacheInBackground(token);
    }

    const sourceJobs = globalJobsCache.items;
    const filteredJobs = filterJobs(sourceJobs, search, category);

    const totalCount = filteredJobs.length;
    const startIdx = (page - 1) * pageSize;
    const pagedItems = filteredJobs.slice(startIdx, startIdx + pageSize);

    return NextResponse.json(
      {
        ok: true,
        items: pagedItems,
        count: totalCount,
      },
      {
        headers: {
          "Cache-Control": "private, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json(
      { ok: false, error: "An unexpected route error occurred." },
      { status: 500 }
    );
  }
}