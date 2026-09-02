"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiPhone, FiChevronDown } from "react-icons/fi";

const countryCodes = [
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
];

export function PhoneInput({
  value,
  onChange,
  countryCode,
  onCountryChange,
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  countryCode: string;
  onCountryChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = countryCodes.find((c) => c.code === countryCode) ?? countryCodes[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="jj-login-field relative" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="jj-login-field__cc"
      >
        <span>{selected.flag}</span>
        <span>{selected.code}</span>
        <FiChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="jj-login-field__dropdown animate-fade-in-up z-20">
          {countryCodes.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                onCountryChange(c.code);
                setOpen(false);
              }}
              className={`jj-login-field__option ${
                countryCode === c.code ? "jj-login-field__option--active" : ""
              }`}
            >
              <span>{c.flag}</span>
              <span className="font-semibold">{c.code}</span>
              <span className="jj-login-field__option-name">{c.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="jj-login-field__input-wrap">
        <FiPhone size={16} className="jj-login-field__icon" />
        <input
          type="tel"
          value={value}
          disabled={disabled}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/\D/g, "").replace(/^0+/, "");
            onChange(cleaned);
          }}
          placeholder="806 000 0000"
          maxLength={10}
          className="!text-gray-700 jj-login-field__input font-mono"
        />
      </div>
    </div>
  );
}