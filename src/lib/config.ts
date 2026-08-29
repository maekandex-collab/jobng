/**
 * Job API base URL.
 * Production (Coolify): https://mtn.lenhub.net
 * Staging (local / viaspark only): https://mtnstaging.lenhub.net
 */
export const API_BASE_URL =
  process.env.JUSTJOB_API_BASE_URL ??
  process.env.job_API_BASE_URL ??
  "https://mtn.lenhub.net";
