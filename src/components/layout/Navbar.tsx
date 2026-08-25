/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiLogIn,
  FiLogOut,
  FiLock,
  FiChevronDown,
  FiUser,
  FiHome,
  FiBriefcase,
  FiInfo,
  FiUserPlus,
} from "react-icons/fi";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/brand/Logo";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/", icon: FiHome },
  { label: "Find Jobs", href: "/jobs", icon: FiBriefcase },
  { label: "About Us", href: "/about", icon: FiInfo },
];

function formatPhoneNumber(phone?: string | null) {
  if (!phone) return "Account Member";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  if (cleaned.length === 13 && cleaned.startsWith("234")) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
}

function getInitials(phone?: string | null) {
  if (!phone) return "U";
  const digits = phone.replace(/\D/g, "");
  return digits ? digits.slice(-2) : "U";
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  const { isAuthenticated, logout, phone, ready, avatarUrl } = useAuth() as {
    isAuthenticated: boolean;
    logout: () => void;
    phone?: string | null;
    ready: boolean;
    avatarUrl?: string | null;
  };

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    setProfileOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    window.location.href = "/";
  };

  const Avatar = ({ size = 36 }: { size?: number }) =>
    avatarUrl ? (
      <Image
        src={avatarUrl}
        alt="User Avatar"
        className="rounded-full object-cover border border-slate-200 shrink-0 shadow-xs"
        width={size}
        height={size}
      />
    ) : (
      <div
        className="rounded-full bg-linear-to-tr from-[#044420] to-[#067337] text-white flex items-center justify-center font-bold tracking-wider uppercase shrink-0 shadow-xs border border-white/20"
        style={{ width: size, height: size, fontSize: Math.max(12, size * 0.36) }}
      >
        {phone ? getInitials(phone) : <FiUser size={size * 0.45} />}
      </div>
    );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 flex items-center bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] transition-all duration-200">
        <div className="container-xl flex items-center justify-between gap-6 w-full px-4 sm:px-6">
          <div className="flex items-center shrink-0">
            {isAuthenticated ? (
              <Logo variant="dark" size="md" href="/jobs" />
            ) : (
              <Logo variant="dark" size="md" />
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-50/80 p-1.5 rounded-full border border-slate-200/60">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-xs font-semibold no-underline transition-all duration-200 ${
                    active
                      ? "bg-white text-ink shadow-xs border border-slate-200/80 font-bold"
                      : "text-text-muted hover:text-ink hover:bg-white/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/prep-interview/practice"
              className={`px-4 py-2 rounded-full text-xs font-semibold no-underline transition-all duration-200 flex items-center gap-2 ${
                isActive("/prep-interview")
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs font-bold"
                  : "text-emerald-700 hover:bg-emerald-50/60"
              }`}
            >
              <FaWandMagicSparkles className="text-emerald-600 w-3.5 h-3.5 shrink-0 animate-pulse" />
              <span>Prep Interview</span>
            </Link>
          </nav>

          {/* Right Action Menu */}
          <div className="hidden lg:flex items-center gap-3">
            {ready && isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  title="Profile menu"
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-full bg-slate-50 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/70 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                >
                  <Avatar size={34} />
                  <span className="text-xs font-bold text-ink max-w-[130px] truncate">
                    {formatPhoneNumber(phone)}
                  </span>
                  <FiChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      profileOpen ? "rotate-180 text-ink" : "text-text-muted"
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-72 bg-white rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-4 bg-linear-to-br from-slate-50 to-white border-b border-slate-100 flex items-center gap-3.5">
                      <Avatar size={42} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-ink truncate tracking-tight">
                          {formatPhoneNumber(phone)}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[11px] font-medium text-text-muted">
                            Active Account
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 space-y-1">
                      <Link
                        href="/change-password"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-ink no-underline hover:bg-slate-100/70 transition-colors group"
                      >
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 shrink-0 group-hover:scale-105 transition-transform">
                          <FiLock size={15} />
                        </span>
                        Change Password
                      </Link>

                      <div className="h-px bg-slate-100 my-1" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50/80 transition-colors group text-left cursor-pointer"
                      >
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100/60 text-rose-600 shrink-0 group-hover:scale-105 transition-transform">
                          <FiLogOut size={15} />
                        </span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/signup"
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-text-muted hover:text-ink hover:bg-slate-100 transition-all duration-200"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-bg-slate-800 bg-white shadow-xs hover:shadow transition-all duration-200 flex items-center gap-2"
                >
                  <FiLogIn size={14} /> Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="lg:hidden p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-ink transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </header>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[49] transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-[50] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <Logo variant="dark" size="sm" />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <FiX size={18} />
          </button>
        </div>

        {ready && isAuthenticated && (
          <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center gap-3.5">
            <Avatar size={42} />
            <div className="min-w-0">
              <p className="text-xs font-bold text-ink truncate">
                {formatPhoneNumber(phone)}
              </p>
              <p className="text-[11px] font-medium text-emerald-700 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Verified Member
              </p>
            </div>
          </div>
        )}

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "text-ink bg-slate-100/90 font-bold"
                    : "text-slate-600 hover:text-ink hover:bg-slate-50"
                }`}
              >
                <span
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    active ? "bg-white shadow-xs text-ink" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Icon size={17} />
                </span>
                {link.label}
              </Link>
            );
          })}

          {/* Prep Interview Highlighted Mobile Link */}
          <Link
            href="/prep-interview/practice"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              isActive("/prep-interview")
                ? "bg-emerald-500/10 text-emerald-900 border-emerald-500/30 font-bold shadow-xs"
                : "bg-emerald-50/60 text-emerald-800 border-emerald-200/60 hover:bg-emerald-100/60"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <FaWandMagicSparkles size={16} className="animate-pulse" />
              </span>
              <span>Prep Interview</span>
            </div>
          </Link>

          {ready && isAuthenticated && (
            <Link
              href="/change-password"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-ink hover:bg-slate-50 transition-all border-t border-slate-100 pt-3.5 mt-2"
            >
              <span className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                <FiLock size={17} />
              </span>
              Change Password
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          {ready && isAuthenticated ? (
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100/80 transition-colors cursor-pointer"
              onClick={handleLogout}
            >
              <FiLogOut size={16} /> Sign Out
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-slate-900 bg-white border border-slate-200 transition-colors shadow-xs"
              >
                <FiLogIn size={16} /> Login
              </Link>

              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-black transition-colors"
              >
                <FiUserPlus size={16} /> Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}