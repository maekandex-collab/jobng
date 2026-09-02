import sanitizeHtmlPackage from "sanitize-html";
import type { Apijustjob } from "@/lib/jobApi";

const BASE_SECTION_KEYWORDS = new Set<string>([
  // Core Job Overview & Details
  "JOB OVERVIEW",
  "JOB SUMMARY",
  "POSITION SUMMARY",
  "ROLE OVERVIEW",
  "ABOUT THE ROLE",
  "ABOUT THE POSITION",
  "JOB PURPOSE",
  "DEPARTMENT",
  "LOCATION",
  "WORK LOCATION",
  "WORK SCHEDULE:",
  "EMPLOYMENT TYPE",
  "JOB TYPE",
  "REPORTING TO",
  "REPORTS TO",

  // Responsibilities & Duties
  "KEY RESPONSIBILITIES",
  "KEY RESPONSIBILITIES:",
  "DUTIES AND RESPONSIBILITIES",
  "PRIMARY RESPONSIBILITIES",
  "CORE RESPONSIBILITIES",
  "MAIN DUTIES",
  "WHAT YOU'LL DO",
  "WHAT YOU WILL DO",
  "TASKS & RESPONSIBILITIES",

  // Qualifications, Skills & Education
  "KEY QUALIFICATIONS & REQUIREMENTS",
  "OTHER REQUIREMENTS, ABILITIES FOR THE POSITION:",
  "REQUIREMENTS FOR THE POSITION:",
  "REQUIREMENTS:",
  "MINIMUM QUALIFICATIONS",
  "REQUIRED QUALIFICATIONS",
  "PREFERRED QUALIFICATIONS",
  "DESIRED QUALIFICATIONS",
  "REQUIRED EDUCATION",
  "REQUIRED SKILLS",
  "DESIRED SKILLS",
  "TECHNICAL SKILLS",
  "SOFT SKILLS",
  "EXPERIENCE & SKILLS",
  "WHAT WE'RE LOOKING FOR",
  "WHAT WE ARE LOOKING FOR",
  "WHO YOU ARE",

  // Compensation, Benefits & Perks
  "SALARY:",
  "SALARY RANGE",
  "COMPENSATION",
  "BENEFITS",
  "PERKS & BENEFITS",
  "WHAT WE OFFER",
  "WHY JOIN US",
  "REMUNERATION",

  // Company Information & Diversity Statements
  "ABOUT THE COMPANY",
  "ABOUT US",
  "WHO WE ARE",
  "OUR MISSION",
  "EQUAL OPPORTUNITY EMPLOYER",
  "DIVERSITY & INCLUSION",

  // Application Instructions
  "HOW TO APPLY",
  "APPLICATION PROCESS",
  "NEXT STEPS",
  "METHOD OF APPLICATION",
]);

const dynamicKeywords = new Set<string>(BASE_SECTION_KEYWORDS);

/**
 * Minimum number of times a plain-text heading must appear
 * before we consider it a reliable heading.
 */
const MIN_OCCURRENCE_THRESHOLD = 2;

/**
 * Maximum/minimum length for learned headings.
 */
const MIN_HEADER_LENGTH = 3;
const MAX_HEADER_LENGTH = 60;

/* ============================================================================
   HEADER DETECTION
   ============================================================================ */

/**
 * Matches:
 *
 * REQUIREMENTS:
 * SALARY:
 * LOCATION:
 */
const HEADER_COLON_REGEX = /^[A-Za-z0-9\s&/'’().,-]+:$/i;

/**
 * Matches:
 *
 * JOB SUMMARY
 * KEY RESPONSIBILITIES
 * QUALIFICATIONS
 */
const HEADER_CAPS_REGEX = /^[A-Z0-9\s&/'’().,-]{4,60}$/;

/**
 * Matches title-style headings such as:
 *
 * Job Summary
 * Key Responsibilities
 * Required Qualifications
 *
 * We deliberately keep this conservative because normal sentences
 * can also look like title case.
 */
const HEADER_TITLE_REGEX =
  /^[A-Z][a-zA-Z0-9\s&/'’().,-]{3,59}$/;

/**
 * Normalize a possible keyword/header.
 *
 * This makes:
 *
 * " Job Summary "
 * "JOB SUMMARY"
 * "Job   Summary"
 *
 * all become:
 *
 * "JOB SUMMARY"
 */
function normalizeKeyword(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

/**
 * Check whether a plain-text line looks like a heading.
 */
function looksLikePlainTextHeader(line: string): boolean {
  const trimmed = line.trim();

  if (
    trimmed.length < MIN_HEADER_LENGTH ||
    trimmed.length > MAX_HEADER_LENGTH
  ) {
    return false;
  }

  // Do not treat obvious sentences as headings.
  if (trimmed.endsWith(".") || trimmed.endsWith("!") || trimmed.endsWith("?")) {
    return false;
  }

  return (
    HEADER_COLON_REGEX.test(trimmed) ||
    HEADER_CAPS_REGEX.test(trimmed) ||
    HEADER_TITLE_REGEX.test(trimmed)
  );
}

/**
 * Extract text from existing heading/formatting tags.
 *
 * We intentionally look at:
 *
 * h1
 * h2
 * h3
 * h4
 * h5
 * h6
 * strong
 * b
 *
 * Example:
 *
 * <h2>Key Responsibilities</h2>
 *
 * becomes:
 *
 * "KEY RESPONSIBILITIES"
 */
function extractFormattedKeywords(html: string): string[] {
  const keywords: string[] = [];

  /**
   * This regex finds:
   *
   * <h1>...</h1>
   * <h2>...</h2>
   * ...
   * <strong>...</strong>
   * <b>...</b>
   *
   * It also allows attributes:
   *
   * <h2 class="title">...</h2>
   */
  const formattedRegex =
    /<(h[1-6]|strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi;

  let match: RegExpExecArray | null;

  while ((match = formattedRegex.exec(html)) !== null) {
    const innerText = stripHtml(match[2]);

    if (
      innerText.length >= MIN_HEADER_LENGTH &&
      innerText.length <= MAX_HEADER_LENGTH
    ) {
      const normalized = normalizeKeyword(innerText);

      if (normalized) {
        keywords.push(normalized);
      }
    }
  }

  return keywords;
}

/**
 * Train the keyword model using job descriptions.
 *
 * The training engine learns from TWO places:
 *
 * 1. Existing HTML formatting:
 *
 *    <h2>Responsibilities</h2>
 *    <strong>Requirements</strong>
 *
 * 2. Plain-text headings:
 *
 *    RESPONSIBILITIES
 *    REQUIREMENTS:
 *
 * A formatted heading only needs to appear once because the HTML
 * itself is strong evidence that it is a heading.
 *
 * A plain-text heading must appear at least twice before it is learned.
 */
export function trainOnJobDescriptions(jobs: Apijustjob[]): void {
  /**
   * This map only lives during this training cycle.
   * That prevents unnecessary memory growth.
   */
  const candidateHeaderFrequency = new Map<string, number>();

  for (const job of jobs) {
    const description = job?.description;

    if (!description) continue;

    /* ------------------------------------------------------------------------
       A. Learn from existing HTML headings/strong/b tags
       ------------------------------------------------------------------------ */

    const formattedKeywords = extractFormattedKeywords(description);

    for (const keyword of formattedKeywords) {
      dynamicKeywords.add(keyword);
    }

    /* ------------------------------------------------------------------------
       B. Learn from plain-text headings
       ------------------------------------------------------------------------ */

    const plainText = stripHtml(description);

    if (!plainText) continue;

    const lines = plainText.split(/\r?\n/);

    for (const rawLine of lines) {
      const trimmed = rawLine.trim();

      if (!looksLikePlainTextHeader(trimmed)) {
        continue;
      }

      const normalized = normalizeKeyword(trimmed);

      if (!normalized) continue;

      const count =
        (candidateHeaderFrequency.get(normalized) || 0) + 1;

      candidateHeaderFrequency.set(normalized, count);

      /**
       * Only add plain-text headings after seeing them at least twice.
       */
      if (count >= MIN_OCCURRENCE_THRESHOLD) {
        dynamicKeywords.add(normalized);
      }
    }
  }
}

/**
 * Longer keywords are checked first.
 *
 * Example:
 *
 * REQUIRED QUALIFICATIONS
 * QUALIFICATIONS
 *
 * We want to check "REQUIRED QUALIFICATIONS" first.
 */
function getSortedKeywords(): string[] {
  return Array.from(dynamicKeywords).sort(
    (a, b) => b.length - a.length
  );
}

/* ============================================================================
   SECTION 2: HTML PARSING & SANITIZATION UTILITIES
   ============================================================================ */

function decodeHtmlEntities(html: string): string {
  if (!html) return "";

  return html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

/**
 * Detect whether the content already contains HTML.
 */
function containsHtmlTags(text: string): boolean {
  return /<[a-z][\s\S]*>/i.test(text);
}

/**
 * Remove HTML tags while keeping useful spacing.
 */
export function stripHtml(
  html: string | null | undefined
): string {
  if (!html) return "";

  const text = html
    // Preserve separation between block-level elements.
    .replace(
      /<\s*(br|\/p|\/div|\/li|\/h[1-6]|li)\s*\/?>/gi,
      "\n"
    )
    .replace(/<[^>]*>/g, "")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return decodeHtmlEntities(text);
}

/* ============================================================================
   SAFE TEXT HELPERS
   ============================================================================ */

/**
 * Escape text before putting it inside generated HTML.
 *
 * This is important because the parser creates HTML from external
 * job-description content.
 */
function escapeHtmlText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escape a string before using it inside a RegExp.
 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* ============================================================================
   SECTION 3: UNSTRUCTURED JOB TEXT PARSER
   ============================================================================ */

/**
 * Convert plain/unstructured job descriptions into clean HTML.
 *
 * Example input:
 *
 * JOB SUMMARY
 * We are looking for a developer.
 *
 * RESPONSIBILITIES:
 * • Write code
 * • Fix bugs
 *
 * REQUIREMENTS
 * React
 * JavaScript
 *
 * Output:
 *
 * <h2>JOB SUMMARY</h2>
 * <p>We are looking for a developer.</p>
 *
 * <h2>RESPONSIBILITIES:</h2>
 * <ul>
 *   <li>Write code</li>
 *   <li>Fix bugs</li>
 * </ul>
 *
 * <h2>REQUIREMENTS</h2>
 * <p>React</p>
 * <p>JavaScript</p>
 */
export function parseUnstructuredJobText(
  rawText: string
): string {
  if (!rawText) return "";

  let text = decodeHtmlEntities(rawText.trim());

  if (!text) return "";

  /**
   * Convert common bullet characters into a consistent marker.
   */
  text = text.replace(
    /^[ \t]*[•●▪◦‣–—-][ \t]*/gm,
    "* "
  );

  /**
   * We only perform heading detection on TEXT, not inside HTML tags.
   *
   * Since this function is primarily intended for unstructured text,
   * we strip existing HTML first if any accidentally arrives here.
   */
  if (containsHtmlTags(text)) {
    text = stripHtml(text);
  }

  const sortedKeywords = getSortedKeywords();

  /* --------------------------------------------------------------------------
     STEP 1: Turn known standalone keywords into headings
     -------------------------------------------------------------------------- */

  for (const keyword of sortedKeywords) {
    const escapedKeyword = escapeRegExp(keyword);

    /**
     * Match the keyword only when it occupies its own line.
     *
     * This is MUCH safer than replacing every occurrence of the word.
     *
     * Example:
     *
     * JOB SUMMARY
     *
     * becomes:
     *
     * <h2>JOB SUMMARY</h2>
     *
     * But:
     *
     * "This job summary explains..."
     *
     * is left alone.
     */
    const headingRegex = new RegExp(
      `^\\s*(${escapedKeyword})\\s*$`,
      "gim"
    );

    text = text.replace(
      headingRegex,
      "\n\n<h2 class=\"text-xl font-black text-gray-900 tracking-tight mt-6 mb-3\">$1</h2>\n"
    );
  }

  /* --------------------------------------------------------------------------
     STEP 2: Detect unknown colon headings
     -------------------------------------------------------------------------- */

  text = text.replace(
    /^(\s*)([A-Za-z0-9\s&/'’().,-]{3,60}:)\s*$/gm,
    (
      _match,
      _indent,
      heading: string
    ) => {
      const normalized = normalizeKeyword(heading);

      /**
       * Add the newly discovered heading to the model.
       *
       * This means the parser can immediately recognize it.
       */
      dynamicKeywords.add(normalized);

      return `\n\n<h2 class="text-xl font-black text-gray-900 tracking-tight mt-6 mb-3">${escapeHtmlText(
        heading.trim()
      )}</h2>\n`;
    }
  );

  /* --------------------------------------------------------------------------
     STEP 3: Convert bullet lines
     -------------------------------------------------------------------------- */

  text = text.replace(
    /^[ \t]*\*\s*/gm,
    "* "
  );

  /* --------------------------------------------------------------------------
     STEP 4: Build final HTML
     -------------------------------------------------------------------------- */

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  let htmlResult = "";
  let inList = false;

  const closeList = () => {
    if (inList) {
      htmlResult += "</ul>";
      inList = false;
    }
  };

  for (const line of lines) {
    /* ------------------------------------------------------------------------
       Heading
       ------------------------------------------------------------------------ */

    if (/^<h[1-6]\b/i.test(line)) {
      closeList();

      htmlResult += line;
      continue;
    }

    /* ------------------------------------------------------------------------
       Bullet
       ------------------------------------------------------------------------ */

    if (line.startsWith("* ")) {
      if (!inList) {
        htmlResult +=
          '<ul class="list-disc pl-5 my-3 space-y-1">';

        inList = true;
      }

      const bulletText = line.slice(2).trim();

      htmlResult += `<li>${escapeHtmlText(
        bulletText
      )}</li>`;

      continue;
    }

    /* ------------------------------------------------------------------------
       Normal paragraph
       ------------------------------------------------------------------------ */

    closeList();

    htmlResult += `<p class="mb-3 leading-relaxed">${escapeHtmlText(
      line
    )}</p>`;
  }

  closeList();

  return htmlResult;
}

/* ============================================================================
   SECTION 4: HTML SANITIZATION
   ============================================================================ */

export function sanitizeHtml(
  content?: string | null
): string {
  if (!content) return "";

  let processedContent = decodeHtmlEntities(content);

  /**
   * If the API returned plain text, convert it into structured HTML.
   *
   * If it already returned HTML, leave its structure intact.
   */
  if (!containsHtmlTags(processedContent)) {
    processedContent =
      parseUnstructuredJobText(processedContent);
  }

  /**
   * Final security pass.
   *
   * Anything outside this allowed HTML vocabulary gets removed.
   */
  return sanitizeHtmlPackage(processedContent, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",

      "p",
      "span",
      "div",
      "br",
      "hr",

      "ul",
      "ol",
      "li",

      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "sub",
      "sup",

      "a",

      "blockquote",
      "code",
      "pre",
    ],

    allowedAttributes: {
      a: [
        "href",
        "target",
        "rel",
        "class",
      ],

      "*": ["class"],
    },
  });
}
