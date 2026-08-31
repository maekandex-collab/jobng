import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How JobNG collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect account details you provide (such as phone number and PIN), profile information used for job applications, usage data (pages viewed, jobs browsed or applied to), and technical data (device type, browser, approximate location) needed to operate and secure the service — including web and *7098# USSD access.",
  },
  {
    title: "2. How We Use Your Information",
    body: "We use your information to create and manage your account, show relevant job listings, process applications you submit, send service messages (including SMS related to login, PIN reset, or subscriptions), improve JobNG, prevent fraud, and meet legal or regulatory obligations.",
  },
  {
    title: "3. Sharing With Employers",
    body: "We only share your profile or contact details with an employer when you apply to their listing or otherwise explicitly take an action that requires sharing. We do not sell your phone number to third parties for marketing.",
  },
  {
    title: "4. Cookies and Similar Technologies",
    body: "We use cookies and similar storage to keep you signed in, remember preferences, and understand how the site is used. You can control cookies in your browser settings; some features may not work if they are disabled.",
  },
  {
    title: "5. Data Security",
    body: "We use reasonable technical and organisational measures to protect your data, including encryption in transit where supported. No online service is completely secure; please keep your PIN private and do not share it.",
  },
  {
    title: "6. Your Rights",
    body: "Depending on applicable law, you may request access to, correction of, or deletion of your personal data, or ask questions about how we process it. Contact us using the details below. You can also manage account access via the website or by dialling *7098#.",
  },
  {
    title: "7. Retention",
    body: "We keep your account and application-related data for as long as your account is active or as needed to provide the service, resolve disputes, and comply with legal requirements. Inactive accounts may be removed or anonymised after a reasonable period.",
  },
  {
    title: "8. Contact",
    body: "For privacy questions or requests, reach us through the Contact page on JobNG or the support channels published on justjobng.online. We will respond as soon as reasonably possible.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 select-none">
      <section className="bg-linear-to-br from-[#8DC63F] via-[#00A651] to-[#00863F] text-white pt-28 sm:pt-36 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10 text-center">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12] max-w-3xl mx-auto text-white">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/85 max-w-xl mx-auto font-normal leading-relaxed">
            How JobNG handles your data across the website and USSD service.
          </p>
          <p className="mt-3 text-sm text-white/70">Last updated: August 2026</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 -mt-10 relative z-20">
        <div className="bg-white border border-emerald-100/80 shadow-xl shadow-emerald-950/5 rounded-3xl p-6 sm:p-10 space-y-7">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-base sm:text-lg font-black text-slate-900 mb-2">
                {s.title}
              </h2>
              <p className="text-[15px] leading-relaxed text-slate-600">{s.body}</p>
            </div>
          ))}

          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-bold text-white bg-[#00A651] hover:bg-[#00863F] transition-colors"
            >
              Contact support
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
