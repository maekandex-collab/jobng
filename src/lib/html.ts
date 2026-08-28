import sanitizeHtmlPackage from "sanitize-html";
import type { Apijustjob } from "@/lib/jobApi";

/* ============================================================================
   SECTION 1: DYNAMIC KEYWORD MODEL & TRAINING ENGINE
   ============================================================================ */

const BASE_SECTION_KEYWORDS = new Set<string>([
  "OTHER REQUIREMENTS, ABILITIES FOR THE POSITION:",
  "KEY QUALIFICATIONS & REQUIREMENTS",
  "REQUIREMENTS FOR THE POSITION:",
  "ABOUT THE COMPANY",
  "KEY RESPONSIBILITIES:",
  "KEY RESPONSIBILITIES",
  "REQUIRED EDUCATION",
  "REQUIRED SKILLS",
  "WORK SCHEDULE:",
  "JOB OVERVIEW",
  "JOB SUMMARY",
  "DEPARTMENT",
  "LOCATION",
  "SALARY:",
  "BENEFITS",
  "WHAT WE OFFER",
  "HOW TO APPLY",
  "DUTIES AND RESPONSIBILITIES",
  "MINIMUM QUALIFICATIONS",
]);

const dynamicKeywords = new Set<string>(BASE_SECTION_KEYWORDS);

// Single compiled regex pattern for fast header detection
const HEADER_COLON_REGEX = /^[A-Za-z0-9\s&/-]+:$/i;
const HEADER_CAPS_REGEX = /^[A-Z0-9\s&/-]{4,40}$/;
const HEADER_TITLE_REGEX = /^[A-Z][a-zA-B0-9\s&/-]{3,35}$/;

export function trainOnJobDescriptions(jobs: Apijustjob[]): void {
  const MIN_OCCURRENCE_THRESHOLD = 2;
  // Local map per training cycle to prevent unbounded memory leaks
  const candidateHeaderFrequency = new Map<string, number>();

  for (let i = 0; i < jobs.length; i++) {
    const desc = jobs[i]?.description;
    if (!desc) continue;

    const lines = desc.split(/\r?\n/);
    for (let j = 0; j < lines.length; j++) {
      const trimmed = lines[j].trim();
      if (trimmed.length < 3 || trimmed.length > 50) continue;

      const isHeader =
        HEADER_COLON_REGEX.test(trimmed) ||
        HEADER_CAPS_REGEX.test(trimmed) ||
        (HEADER_TITLE_REGEX.test(trimmed) && !trimmed.endsWith("."));

      if (isHeader) {
        const normalized = trimmed.toUpperCase();
        const count = (candidateHeaderFrequency.get(normalized) || 0) + 1;
        candidateHeaderFrequency.set(normalized, count);

        if (count >= MIN_OCCURRENCE_THRESHOLD) {
          dynamicKeywords.add(normalized);
        }
      }
    }
  }
}

function getSortedKeywords(): string[] {
  return Array.from(dynamicKeywords).sort((a, b) => b.length - a.length);
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

function containsHtmlTags(text: string): boolean {
  return /<[a-z][\s\S]*>/i.test(text);
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  const text = html
    .replace(/<\s*(br|\/p|\/div|\/li)\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return decodeHtmlEntities(text);
}

export function parseUnstructuredJobText(rawText: string): string {
  if (!rawText) return "";

  let text = rawText.trim();
  const sortedKeywords = getSortedKeywords();

  sortedKeywords.forEach((keyword) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|\\n|\\s{2,})(${escaped})`, "gi");
    text = text.replace(regex, "\n\n<h3>$2</h3>\n");
  });

  text = text.replace(/(^|\n)([A-Z0-9\s&/-]{3,45}:)(?=\s|\n|$)/g, "\n\n<h3>$2</h3>\n");
  text = text.replace(/•\s*/g, "\n* ");

  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  let htmlResult = "";
  let inList = false;

  for (const line of lines) {
    if (line.startsWith("<h3>")) {
      if (inList) {
        htmlResult += "</ul>";
        inList = false;
      }
      htmlResult += line;
    } else if (line.startsWith("* ")) {
      if (!inList) {
        htmlResult += "<ul class='list-disc pl-5 my-3 space-y-1'>";
        inList = true;
      }
      htmlResult += `<li>${line.replace("* ", "")}</li>`;
    } else {
      if (inList) {
        htmlResult += "</ul>";
        inList = false;
      }
      htmlResult += `<p class='mb-3 leading-relaxed'>${line}</p>`;
    }
  }

  if (inList) htmlResult += "</ul>";

  return htmlResult;
}

export function sanitizeHtml(content?: string | null): string {
  if (!content) return "";

  let processedContent = decodeHtmlEntities(content);

  if (!containsHtmlTags(processedContent)) {
    processedContent = parseUnstructuredJobText(processedContent);
  }

  return sanitizeHtmlPackage(processedContent, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "span", "div", "br", "hr",
      "ul", "ol", "li",
      "strong", "b", "em", "i", "u", "s", "sub", "sup",
      "a", "blockquote", "code", "pre"
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "class"],
      "*": ["class"],
    },
  });
}