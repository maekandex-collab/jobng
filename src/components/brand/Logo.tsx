"use client";

import Image from "next/image";
import Link from "next/link";

export interface LogoProps {
  /** Show text wordmark beside the icon mark */
  showText?: boolean;
  /** light = light text for dark backgrounds, dark = dark text for light backgrounds */
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  /** Enable subtle hover micro-animations */
  animated?: boolean;
}

const sizes = {
  sm: {
    mark: 32,
    text: "text-lg",
    gap: "gap-2",
  },
  md: {
    mark: 40,
    text: "text-xl sm:text-2xl",
    gap: "gap-2.5",
  },
  lg: {
    mark: 48,
    text: "text-2xl sm:text-3xl",
    gap: "gap-3",
  },
} as const;

export default function Logo({
  showText = true,
  variant = "light",
  size = "md",
  href = "/",
  className = "",
  animated = true,
}: LogoProps) {
  const s = sizes[size] ?? sizes.md;
  const textColor = variant === "light" ? "text-white" : "text-slate-900";

  const content = (
    <span
      className={`group inline-flex items-center ${s.gap} select-none cursor-pointer focus:outline-none ${className}`}
    >
      {/* Icon Mark */}
      <span className="relative flex items-center justify-center shrink-0">
        {animated && (
          <span
            className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#8DC63F] to-[#00A651] opacity-0 blur-sm group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
            aria-hidden="true"
          />
        )}
        <Image
          src="/logo.png"
          width={s.mark}
          height={s.mark}
          alt="JustJobNG mark"
          className={`relative z-10 object-contain ${
            animated ? "transition-transform duration-300 group-hover:scale-105" : ""
          }`}
          priority
        />
      </span>

      {/* Wordmark Text */}
      {showText && (
        <span className="flex items-baseline font-black tracking-tight leading-none">
          <span
            className={`${s.text} ${textColor} transition-colors duration-200`}
          >
            JustJob
          </span>
          <span
            className={`${s.text} text-[#00A651] transition-transform duration-200 group-hover:translate-x-0.5`}
          >
            NG
          </span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-block no-underline rounded-xl focus-visible:ring-2 focus-visible:ring-[#00A651] focus-visible:ring-offset-2 focus:outline-none"
        aria-label="JustJobNG Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}