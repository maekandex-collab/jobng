"use client";

import Link from "next/link";
import { FiBriefcase, FiCalendar, FiExternalLink, FiArrowUpRight } from "react-icons/fi";
import { stripHtml } from "@/lib/html";
import { Apijustjob } from "@/lib/jobApi";
import { useSearchParams } from "next/navigation";

// Labels that should never be shown as work types/categories
const DISALLOWED_CATEGORIES = ["feature", "featured", "internship"];

function formatDate(iso?: string | null) {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return iso;
    return date.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function companyInitial(name?: string | null) {
  return name?.trim().charAt(0).toUpperCase() || "J";
}

interface JobCardProps {
  job: Apijustjob;
  variant?: "list" | "grid";
}

export default function JobCard({ job, variant = "list" }: JobCardProps) {
  const searchParams = useSearchParams();

  function resolveWorkType(category?: string | null): string {
    const rawQueryCategory = searchParams.get("category")?.trim();
    const rawJobCategory = category?.trim();

    // Helper to check if a string is forbidden (e.g. "feature", "featured", "internship")
    const isForbidden = (val?: string) =>
      !val || DISALLOWED_CATEGORIES.includes(val.toLowerCase());

    // 1. If an active URL category param exists and is valid, use it
    if (rawQueryCategory && !isForbidden(rawQueryCategory)) {
      return rawQueryCategory;
    }

    // 2. Otherwise check the job's returned category from API
    if (rawJobCategory && !isForbidden(rawJobCategory)) {
      return rawJobCategory;
    }

    // 3. Fallback: Default directly to "On-site" instead of "Feature"
    return "On-site";
  }

  const title = job.job_title ?? "Untitled Job";
  const company = job.company_name ?? "Unknown Company";
  const workType = resolveWorkType(job.category);
  const plainDescription = stripHtml(job.description ?? "");

  const avatar = (
    <div className="jj-job-card__avatar w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-100 text-[#00A651] font-bold text-lg flex items-center justify-center shrink-0">
      {companyInitial(company)}
    </div>
  );

  if (variant === "grid") {
    return (
      <div className="job-card jj-job-card jj-job-card--grid bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-col justify-between hover:shadow-md transition-shadow h-full">
        <div>
          <div className="jj-job-card__top flex items-start gap-3 mb-3">
            {avatar}
            <div className="jj-job-card__info min-w-0 flex-1">
              <Link
                href={`/jobs/${job.job_id}`}
                className="jj-job-card__title font-bold !text-[#00A651] text-base line-clamp-2 transition-colors"
              >
                {title}
              </Link>
              <p className="jj-job-card__company text-xs sm:text-sm text-gray-500 truncate mt-0.5">
                {company}
              </p>
            </div>
          </div>

          <div className="jj-job-card__meta flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
            <span className="jj-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#00A651] font-medium capitalize">
              <FiBriefcase size={12} /> {workType}
            </span>
            <span className="jj-job-card__date inline-flex items-center gap-1 text-gray-400">
              <FiCalendar size={12} /> {formatDate(job.created_at)}
            </span>
          </div>

          {plainDescription && (
            <p className="jj-job-card__excerpt text-xs sm:text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
              {plainDescription}
            </p>
          )}
        </div>

        <Link
          href={`/jobs/${job.job_id}`}
          className="jj-job-card__cta inline-flex items-center justify-between w-full pt-3 border-t border-gray-100 text-sm font-semibold text-[#00A651] hover:text-[#00863F] transition-colors mt-auto"
        >
          <span>View Job</span>
          <FiArrowUpRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="job-card jj-job-card jj-job-card--list bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 w-full sm:w-auto">
        {avatar}
        <div className="sm:hidden flex-1 min-w-0">
          <Link
            href={`/jobs/${job.job_id}`}
            className="jj-job-card__title font-bold !text-[#00A651] text-base line-clamp-2"
          >
            {title}
          </Link>
          <p className="jj-job-card__company text-xs text-gray-500 truncate">{company}</p>
        </div>
      </div>

      <div className="jj-job-card__body flex-1 min-w-0 w-full">
        <Link
          href={`/jobs/${job.job_id}`}
          className="jj-job-card__title jj-job-card__title--lg hidden sm:block font-bold !text-[#00A651] text-lg transition-colors"
        >
          {title}
        </Link>
        <p className="jj-job-card__company hidden sm:block text-sm text-gray-500 mt-0.5">{company}</p>

        <div className="jj-job-card__meta flex flex-wrap items-center gap-2 text-xs text-gray-500 my-2">
          <span className="jj-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#00A651] font-medium capitalize">
            <FiBriefcase size={12} /> {workType}
          </span>
          <span className="jj-job-card__date inline-flex items-center gap-1 text-gray-400">
            <FiCalendar size={12} /> {formatDate(job.created_at)}
          </span>
        </div>

        {plainDescription && (
          <p className="jj-job-card__excerpt jj-job-card__excerpt--list text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {plainDescription}
          </p>
        )}
      </div>

      <div className="jj-job-card__actions flex items-center sm:flex-col justify-between sm:justify-start w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 shrink-0">
        <Link
          href={`/jobs/${job.job_id}`}
          className="jj-btn jj-btn--ghost min-h-[38px] px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200 text-center flex-1 sm:flex-initial transition-colors"
        >
          View
        </Link>
        {job.job_url && (
          <a
            href={job.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[38px] inline-flex items-center justify-center gap-1 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#00A651] hover:bg-[#00863F] rounded-lg flex-1 sm:flex-initial transition-colors"
          >
            Apply <FiExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}