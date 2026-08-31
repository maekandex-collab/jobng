"use client";

import { useState, useId } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiX,
  FiMessageSquare,
} from "react-icons/fi";

interface FAQItemProps {
  q: string;
  a: string;
}

const faqData = [
  {
    category: "For Job Seekers",
    items: [
      {
        q: "How do I apply for jobs via USSD?",
        a: "Dial *7098# on your MTN line, select 'Find Jobs', and follow the prompts. You can browse by category or location and submit your profile directly.",
      },
      {
        q: "Is the USSD service free?",
        a: "Browsing job titles is free. To view full details or apply, you need an active subscription which costs ₦100/day.",
      },
      {
        q: "Do I need a CV to apply?",
        a: "For USSD applications, we use your built-in profile as your CV. For website applications, some employers may request an external CV upload.",
      },
    ],
  },
  {
    category: "Account & Privacy",
    items: [
      {
        q: "I forgot my 4-digit PIN. How do I reset it?",
        a: "Click on 'Forgot PIN' on the login page, enter your phone number, and we'll send you an SMS to reset it. You can also dial *7098# and select 'Account'.",
      },
      {
        q: "Is my personal data safe?",
        a: "Yes. We use enterprise-grade encryption for all data. We never share your phone number with employers unless you explicitly apply to their job.",
      },
    ],
  },
];

function FAQItem({ q, a }: FAQItemProps) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="jj-card mb-3.5 overflow-hidden border border-(--border) rounded-(--radius-sm) bg-(--surface-elevated) transition-all duration-200 hover:border-(--gold)/40">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={contentId}
        className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 bg-transparent border-none cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-(--gold)"
      >
        <span className="text-base sm:text-lg font-extrabold  leading-snug">
          {q}
        </span>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
            open
              ? "bg-(--gold) text-white rotate-180 shadow-sm"
              : "bg-(--surface) text-(--text-muted)"
          }`}
        >
          <FiChevronDown size={18} />
        </div>
      </button>

      {open && (
        <div
          id={contentId}
          className="px-5 sm:px-6 pb-6 pt-1 bg-(--gold-muted)/30 border-t border-[rgba(0,166,81,0.15) animate-fade-in-up"
        >
          <p className=" text-sm sm:text-[15px] leading-relaxed pt-3 opacity-90">
            {a}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const categories = ["All", "For Job Seekers", "Account & Privacy"];

  const filteredData = faqData
    .map((section) => ({
      category: section.category,
      items: section.items.filter(
        (item) =>
          (item.q.toLowerCase().includes(search.toLowerCase()) ||
            item.a.toLowerCase().includes(search.toLowerCase())) &&
          (activeTab === "All" || activeTab === section.category),
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="min-h-screen bg-(--surface) pb-20 animate-fade-in-up">
      {/* Hero */}
      <section className="bg-(--ink) pt-[calc(var(--nav-height,80px)+2.5rem) pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_100%_0%,rgba(0,166,81,0.12)_0%,transparent_60%),radial-gradient(ellipse_40%_60%_at_0%_100%,rgba(141,198,63,0.08)_0%,transparent_50%) pointer-events-none" />

        <div className="container-xl relative text-center max-w-[720px] mx-auto">
          <h1 className="text-[clamp(2rem,5vw,3.25rem) font-extrabold text-white mb-3 -tracking-[0.02em] leading-[1.15]">
            Frequently Asked Questions
          </h1>
          <p className="text-white/75 text-base sm:text-lg max-w-[560px] mx-auto mb-8 font-normal leading-relaxed">
            Everything you need to know about using JustJobNG on the web or via
            *7098#.
          </p>

          {/* Search Box */}
          <div className="max-w-[520px] mx-auto relative group">
            <FiSearch
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-faint) group-focus-within:text-(--gold) transition-colors"
            />
            <input
              type="text"
              placeholder="Search for questions or topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-4 pr-11 pl-12 rounded-(--radius-sm) border border-transparent bg-white  placeholder-(--text-faint) text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-(--gold) transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--text-faint) hover: p-1 rounded-full transition-colors"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="container-xl mt-10 mb-8 px-4">
        <div className="flex gap-2.5 flex-wrap justify-center">
          {categories.map((cat) => {
            const isActive = activeTab === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2.5 text-sm font-bold rounded-(--radius-sm) cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-(--gold) text-white shadow-(--shadow-gold) scale-[1.02]"
                    : "bg-(--surface-elevated)  border border-(--border) hover:bg-(--surface) hover:border-(--gold)/30"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Accordions */}
      <section className="container-xl max-w-[800px] mx-auto px-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-16 bg-(--surface-elevated) rounded-(--radius-md) border border-(--border) my-4 p-8">
            <div className="w-14 h-14 rounded-full bg-(--surface) text-(--text-muted) flex items-center justify-center mx-auto mb-4">
              <FiSearch size={28} />
            </div>
            <h3 className="text-xl font-extrabold  mb-1.5">No results found</h3>
            <p className="text-sm text-(--text-muted) max-w-[360px] mx-auto">
              We couldn&apos;t find any questions matching &quot;{search}&quot;.
              Try adjusting your keywords or category filters.
            </p>
          </div>
        ) : (
          filteredData.map((section) => (
            <div key={section.category} className="mb-10">
              <h2 className="text-lg sm:text-xl font-extrabold  mb-4 flex items-center gap-2.5">
                <span className="w-1.5 h-5 bg-(--gold) rounded-full inline-block" />
                {section.category}
              </h2>
              <div>
                {section.items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      {/* CTA */}
      <section className="container-xl max-w-[800px] mx-auto px-4 mt-12">
        <div className="bg-(--ink) py-12 px-6 sm:px-10 text-center rounded-(--radius-md) relative overflow-hidden shadow-xl border border-white/5">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-(--gold)/10 rounded-full blur-2xl pointer-events-none" />

          <div className="w-12 h-12 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center mx-auto mb-4 border border-white/10">
            <FiMessageSquare size={22} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 -tracking-[0.02em]">
            Still have questions?
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-[440px] mx-auto mb-8 font-normal leading-relaxed">
            Our support team is ready to assist you with any questions or
            account inquiries.
          </p>
          {/* <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 font-bold text-sm bg-linear-to-r from-(--gold-light) via-(--gold) to-(--gold-hover)  shadow-(--shadow-gold) rounded-(--radius-sm) py-3.5 px-8 transition-all duration-200 hover:shadow-[0_12px_30px_rgba(0,166,81,0.3) hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Contact Support
          </Link> */}
        </div>
      </section>
    </div>
  );
}
