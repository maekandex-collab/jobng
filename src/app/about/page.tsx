import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FiUsers, FiBriefcase, FiAward, FiSmartphone, FiArrowRight } from "react-icons/fi";
import AboutStats from "@/components/about/AboutStats";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about JobNG, Nigeria's premier job discovery platform.",
};

const stats = [
  { label: "Active Job Seekers", value: "120K+" },
  { label: "Nations Covered", value: "Worldwide" },
];

const values = [
  {
    icon: FiUsers,
    title: "People First",
    description: "We prioritize the needs of Nigerian job seekers and employers, ensuring every feature serves a real purpose.",
    iconBg: "bg-emerald-500/10 text-[#00A651]",
  },
  {
    icon: FiBriefcase,
    title: "Quality Matches",
    description: "We focus on connecting the right talent with the right opportunities, reducing noise in the hiring process.",
    iconBg: "bg-[#8DC63F]/15 text-[#00863F]",
  },
  {
    icon: FiAward,
    title: "Trust & Integrity",
    description: "We vet our employers and job listings to ensure a safe, scam-free, and reliable platform for all users.",
    iconBg: "bg-emerald-500/10 text-[#00A651]",
  },
  {
    icon: FiSmartphone,
    title: "Accessible Tech",
    description: "From our web portal to our *7098# USSD service, we ensure everyone can find a job regardless of device or internet access.",
    iconBg: "bg-[#8DC63F]/15 text-[#00863F]",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 select-none">
      {/* Hero Section */}
      <section className=" text-white pt-28 sm:pt-36 pb-24 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-linear-to-br from-[#8DC63F] via-[#00A651] to-[#00863F] pointer-events-none" 
          aria-hidden
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10 text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] max-w-4xl mx-auto text-slate-50">
            Nigeria&apos;s No. 1 job aggregator platform built for every Nigerian
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            We aggregate verified opportunities across 100+ job portals across all 36 states of Nigeria and the Federal Capital Territory.
          </p>
        </div>
      </section>

      {/* Floating Glass Stats Panel */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 -mt-12 sm:-mt-16 relative z-20">
        <div className="bg-white/95 backdrop-blur-xl border border-emerald-100/80 shadow-2xl shadow-emerald-950/5 rounded-3xl p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <AboutStats />
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-2 text-center pt-4 md:pt-2">
                <div className="text-3xl sm:text-4xl font-black text-[#00A651] tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-500 text-xs sm:text-sm font-extrabold uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 mt-20 sm:mt-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="w-12 h-1.5 bg-linear-to-r from-[#8DC63F] via-[#00A651] to-[#00863F] rounded-full mb-6" />
            <h2 className="!text-gray-900 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              Empowering careers through technology
            </h2>
            
            <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed">
              <p>
                Founded in 2023, <strong className="text-[#00A651] font-bold">JobNG</strong> was built out of frustration with existing job portals that were overly complex, riddled with unverified listings, or inaccessible to millions without high-speed internet.
              </p>
              <p>
                We believe finding employment should be simple, transparent, and fair. That&apos;s why we created a unified platform that works just as smoothly on a laptop in Lagos as it does on a basic feature phone in Kano via our <strong className="text-[#00A651] font-bold">*7098# USSD service</strong>.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-linear-to-r from-[#00A651] via-[#009247] to-[#00863F] hover:from-[#009247] hover:to-[#007034] text-white font-extrabold text-base transition-all duration-200 shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Browse Open Jobs</span>
                <FiArrowRight className="text-lg" />
              </Link>
            </div>
          </div>

          {/* Image Frame with Glass Accent */}
          <div className="relative">
            <div className="relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden border border-emerald-100 shadow-2xl group">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format"
                alt="JobNG Team Collaboration"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
            </div>

            {/* Floating Info Pill */}
            <div className="absolute -bottom-6 -left-2 sm:left-6 bg-white/95 backdrop-blur-md border border-emerald-100 p-4 sm:p-5 rounded-2xl shadow-xl hidden sm:flex items-center gap-4 max-w-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#00A651] font-black text-lg shrink-0">
                🇳🇬
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-slate-900">100% Built for Nigeria</p>
                <p className="text-slate-500 font-normal">Bridge the gap between opportunity and talent.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 mt-28">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-black !text-slate-900 tracking-tight">
            Our Core Values
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            The principles guiding every engineering decision and feature we build.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ icon: Icon, title, description, iconBg }, i) => (
            <div
              key={i}
              className="group bg-white border border-slate-200/80 hover:border-emerald-300 rounded-3xl p-8 shadow-xs hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-6 shadow-xs group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="text-2xl" aria-hidden="true" />
                </div>
                
                <h3 className="text-xl font-extrabold text-slate-900 mb-3 tracking-tight group-hover:text-[#00A651] transition-colors duration-200">
                  {title}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}