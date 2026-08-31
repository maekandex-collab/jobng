"use client";

import { useEffect, useState } from "react";
import CountUp from "../shared/CountUp";
import { authHeaders } from "@/lib/auth-client";

const fetchJobsCount = async (): Promise<number> => {
  try {
    const res = await fetch("/api/total-jobs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      cache: "no-store",
    });

    if (res.status === 401 || !res.ok) {
      return;
    }

    const payload = await res.json();
    
    // Extract total_jobs from { ok: true, data: { total_jobs: 474 } }
    const count = payload?.data?.total_jobs ?? payload?.total_jobs;

    return typeof count === "number" && count > 0
      ? count
      : "";
  } catch {
    return;
  }
};

export default function AboutStats() {
  const [targetCount, setTargetCount] = useState<number | null>(null);

  useEffect(() => {
    let canceled = false;

    fetchJobsCount().then((nextCount) => {
      if (!canceled) {
        setTargetCount(nextCount);
      }
    });

    return () => {
      canceled = true;
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-2 text-center">
      <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-1 min-h-[44px] flex items-center justify-center">
        {targetCount === null ? (
          <span className="inline-block w-20 h-8 rounded-lg bg-emerald-100/60 animate-pulse" />
        ) : (
          <CountUp target={targetCount} suffix="+" className="inline text-[#00A651]" />
        )}
      </div>
      <div className="text-slate-500 text-xs sm:text-sm font-extrabold uppercase tracking-widest">
        Active Listings
      </div>
    </div>
  );
}
