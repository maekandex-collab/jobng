/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { 
  FiInstagram, 
  FiLinkedin, 
  FiFacebook, 
  FiArrowUpRight,
  FiPhoneCall
} from "react-icons/fi";
import Logo from "@/components/brand/Logo";

const FOOTER_LINKS = {
  explore: [
    { label: "Browse Jobs", href: "/jobs" },
    { label: "Forgot PIN", href: "/forgot-password" },
  ],
  company: [
    // { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
} as const;

const SOCIAL_LINKS = [
  { icon: FiInstagram, href: "https://www.instagram.com/maekandex_communication_/", label: "Instagram" },
  { icon: FiLinkedin, href: "https://ng.linkedin.com/company/maekandexcommunication", label: "LinkedIn" },
  { icon: FiFacebook, href: "https://facebook.com", label: "Facebook" },
] as const;

// Framer Motion Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  },
};

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  // Prevent SSR hydration mismatch for dynamic date
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,#CDEBB0_0%,#8DC63F_35%,#00A651_70%,#006831_100%)] text-ink overflow-hidden select-none">
      
      {/* Subtle Wave Top Separator */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none pointer-events-none -translate-y-[98%]">
        <svg
          className="relative block w-full h-12 sm:h-16 md:h-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z"
            className="fill-[#8DC63F]/20"
          />
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-[#00A651]"
          />
        </svg>
      </div>

      {/* Top Accent Glow Line */}
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent origin-center"
      />

      {/* Main Grid Content Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-16 pb-12 relative z-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand Info Column */}
          <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-5 flex flex-col items-start pr-0 lg:pr-8">
              <Logo variant="dark" size="md" />
            
            <p className="mt-5 text-[15px] leading-relaxed text-ink/85 max-w-md font-normal">
              Nigeria&apos;s leading job discovery platform. Stay connected, explore verified job listings, and kickstart your career anywhere.
            </p>

            {/* USSD Quick Action Badge */}
            <div className="mt-6 flex items-center gap-3 p-2.5 px-4 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-md shadow-xs transition-transform duration-200 hover:scale-[1.02]">
              <div className="w-8 h-8 rounded-full bg-[#055A2B] text-white flex items-center justify-center shrink-0 shadow-xs">
                <FiPhoneCall size={14} />
              </div>
              <div className="text-xs">
                <span className="block text-ink/70 font-medium">Quick Dial Subscription</span>
                <span className="text-sm font-black text-[#055A2B] tracking-wide">*7098#</span>
              </div>
            </div>
          </motion.div>

          {/* Explore Links Column */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-ink/90 mb-5 flex items-center gap-2">
              Explore
              <span className="w-8 h-[2px] bg-[#055A2B]/40 rounded-full inline-block" />
            </h3>
            <ul className="flex flex-col gap-2.5 p-0 m-0 list-none">
              {FOOTER_LINKS.explore.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="group inline-flex items-center gap-1.5 text-[15px] text-ink/80 font-medium no-underline py-1 transition-all duration-200 hover:text-white hover:translate-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/50 rounded-xs"
                  >
                    <span>{link.label}</span>
                    <FiArrowUpRight size={14} className="opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links Column */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-ink/90 mb-5 flex items-center gap-2">
              Company
              <span className="w-8 h-[2px] bg-[#055A2B]/40 rounded-full inline-block" />
            </h3>
            <ul className="flex flex-col gap-2.5 p-0 m-0 list-none">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="group inline-flex items-center gap-1.5 text-[15px] text-ink/80 font-medium no-underline py-1 transition-all duration-200 hover:text-white hover:translate-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/50 rounded-xs"
                  >
                    <span>{link.label}</span>
                    <FiArrowUpRight size={14} className="opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </motion.div>

      {/* Bottom Legal & Social Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="border-t border-black/10 bg-black/5 backdrop-blur-xs relative z-10"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-ink/80 m-0 text-center sm:text-left font-medium">
            &copy; {year ?? "2026"} jobNG. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-2.5">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a 
                key={label} 
                href={href} 
                aria-label={label} 
                target="_blank"             
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 text-ink/90 border border-white/20 transition-all duration-300 hover:bg-[#055A2B] hover:text-white hover:border-[#055A2B] hover:-translate-y-1 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/50"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </motion.div>

    </footer>
  );
}