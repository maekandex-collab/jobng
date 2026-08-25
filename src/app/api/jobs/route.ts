/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getJobs, Apijustjob } from "@/lib/jobApi";

interface GlobalCache {
  items: Apijustjob[];
  timestamp: number;
}

const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes
let globalJobsCache: GlobalCache | null = null;

export function extractItems(data: any): Apijustjob[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

function filterJobs(
  items: Apijustjob[],
  search?: string,
  category?: string
): Apijustjob[] {
  let filtered = items;

  if (category) {
    const catTerm = category.toLowerCase().trim();
    filtered = filtered.filter((j) => {
      const jCat = j.category?.toLowerCase().trim() || "";
      const jTitle = j.job_title?.toLowerCase() || "";
      const jDesc = j.description?.toLowerCase() || "";
      return (
        jCat === catTerm ||
        jCat.includes(catTerm) ||
        jTitle.includes(catTerm) ||
        jDesc.includes(catTerm)
      );
    });
  }

  if (search) {
    const searchTerm = search.toLowerCase().trim();
    filtered = filtered.filter((j) => {
      const titleMatch = j.job_title?.toLowerCase().includes(searchTerm);
      const companyMatch = j.company_name?.toLowerCase().includes(searchTerm);
      const categoryMatch = j.category?.toLowerCase().includes(searchTerm);
      const descMatch = j.description?.toLowerCase().includes(searchTerm);
      return titleMatch || companyMatch || categoryMatch || descMatch;
    });
  }

  return filtered;
}

// Fetch all jobs from upstream (paginating until complete or reaching safety limit)
async function fetchAllUpstreamJobs(token?: string): Promise<Apijustjob[]> {
  const FETCH_PAGE_SIZE = 100;
  let page = 1;
  const allJobs: Apijustjob[] = [];
  let hasMore = true;

  // Try fetching with the user's token first
  while (hasMore && page <= 10) {
    const result = await getJobs({ page, page_size: FETCH_PAGE_SIZE }, token);

    if (!result.ok) {
      console.warn(`Upstream job fetch failed with status ${result.status} using token.`);
      break;
    }

    const items = extractItems(result.data);
    if (items.length === 0) break;

    allJobs.push(...items);
    if (items.length < FETCH_PAGE_SIZE) hasMore = false;
    else page++;
  }

  // Fallback: If token was invalid/expired or returned 0 items, retry publicly without token
  if (allJobs.length === 0 && token) {
    page = 1;
    hasMore = true;
    while (hasMore && page <= 10) {
      const result = await getJobs({ page, page_size: FETCH_PAGE_SIZE });
      if (!result.ok) break;

      const items = extractItems(result.data);
      if (items.length === 0) break;

      allJobs.push(...items);
      if (items.length < FETCH_PAGE_SIZE) hasMore = false;
      else page++;
    }
  }

  // Deduplicate by job_id
  const uniqueMap = new Map<string, Apijustjob>();
  for (const job of allJobs) {
    if (job.job_id) uniqueMap.set(job.job_id, job);
  }

  return Array.from(uniqueMap.values());
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

    const now = Date.now();

    // Refresh cache if missing or expired
    if (!globalJobsCache || now - globalJobsCache.timestamp > CACHE_TTL_MS) {
      const allJobs = await fetchAllUpstreamJobs(token);
      
      // ONLY update cache if upstream returned jobs (prevents caching empty state)
      if (allJobs.length > 0) {
        globalJobsCache = {
          items: allJobs,
          timestamp: now,
        };
      }
    }

    const sourceJobs = globalJobsCache?.items ?? [];

    // Apply exact filter over ALL cached jobs
    const filteredJobs = filterJobs(sourceJobs, search, category);

    const totalCount = filteredJobs.length;
    const startIdx = (page - 1) * pageSize;
    const pagedItems = filteredJobs.slice(startIdx, startIdx + pageSize);

    return NextResponse.json({
      ok: true,
      items: pagedItems,
      count: totalCount,
    });
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json(
      { ok: false, error: "An unexpected route error occurred." },
      { status: 500 }
    );
  }
}