"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  FiPhone,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiChevronDown,
  FiArrowRight,
  FiUserPlus,
  FiLogIn,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/brand/Logo";

const PIN_LENGTH = 4;

const countryCodes = [
  { code: "+234", flag: "🇳🇬", name: "NG" },
  { code: "+1", flag: "🇺🇸", name: "US" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+27", flag: "🇿🇦", name: "ZA" },
  { code: "+254", flag: "🇰🇪", name: "KE" },
];

function PhoneInput({
  value,
  onChange,
  countryCode,
  onCountryChange,
}: {
  value: string;
  onChange: (v: string) => void;
  countryCode: string;
  onCountryChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected =
    countryCodes.find((c) => c.code === countryCode) ?? countryCodes[0];

  return (
    <div className="jj-login-field">
      <button
        type="button"
        className="jj-login-field__cc"
        onClick={() => setOpen(!open)}
      >
        <span>{selected.flag}</span>
        <span>{selected.code}</span>
        <FiChevronDown
          size={12}
          className={open ? "jj-login-field__chev--open" : ""}
        />
      </button>
      {open && (
        <div className="jj-login-field__dropdown">
          {countryCodes.map((c) => (
            <button
              key={c.code}
              type="button"
              className={`jj-login-field__option ${countryCode === c.code ? "jj-login-field__option--active" : ""}`}
              onClick={() => {
                onCountryChange(c.code);
                setOpen(false);
              }}
            >
              <span>{c.flag}</span>
              <span>{c.code}</span>
              <span className="jj-login-field__option-name">{c.name}</span>
            </button>
          ))}
        </div>
      )}
      <div className=" jj-login-field__input-wrap">
        <FiPhone size={15} className="jj-login-field__icon" />
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
          placeholder="806 000 0000"
          maxLength={11}
          className="!text-gray-800 jj-login-field__input"
        />
      </div>
    </div>
  );
}

function PinInput({
  value,
  onChange,
  placeholder = "••••",
  hint = "4-digit PIN",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div className="jj-login-field jj-login-field--pin">
        <input
          required
          type={show ? "text" : "password"}
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={(e) =>
            onChange(e.target.value.replace(/\D/g, "").slice(0, PIN_LENGTH))
          }
          placeholder={placeholder}
          maxLength={PIN_LENGTH}
          className="!text-gray-800 jj-login-field__input jj-login-field__input--pin"
          autoComplete="one-time-code"
        />
        <button
          type="button"
          className="jj-login-field__toggle"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide PIN" : "Show PIN"}
        >
          {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      </div>
      {hint && <p className="jj-login-pin-hint">{hint}</p>}
    </div>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/jobs";
  const { setSession } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("+234");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const isLogin = mode === "login";

  const canSubmit =
    phone.length >= 7 &&
    pin.length === PIN_LENGTH &&
    (isLogin || (confirmPin.length === PIN_LENGTH && pin === confirmPin)) &&
    !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (pin.length !== PIN_LENGTH) {
      setError("PIN must be 4 digits.");
      return;
    }

    if (!isLogin && pin !== confirmPin) {
      setError("PINs do not match.");
      return;
    }

    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin, countryCode: country }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(
          data.error ??
            (isLogin ? "Invalid phone or PIN." : "Failed to create account."),
        );
        return;
      }

      setSession(data.token, data.phone);
      setSuccess(true);
      setTimeout(() => router.push(callbackUrl), 800);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    setError("");
    setConfirmPin("");
  };

  if (success) {
    return (
      <div className="jj-login-page">
        <div className="jj-login-card jj-login-card--success">
          <div className="jj-login-success-icon !text-emerald-500">
            <FiCheckCircle size={32} />
          </div>
          <h2 className="jj-login-success-title !text-emerald-400">
            {isLogin ? "You're in!" : "Account created!"}
          </h2>
          <p className="jj-login-success-sub">
            {isLogin
              ? "Welcome back. Redirecting you to jobs…"
              : "Welcome to job. Redirecting you to jobs…"}
          </p>
          <Link
            href="/jobs"
            className="jj-btn !bg-emerald-500 hover:!bg-emerald-600 !text-white"
            style={{ padding: "12px 28px" }}
          >
            Browse Jobs <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="jj-login-page">
      <div className="jj-login-split">
        {/* Left panel — brand */}
        <div className="jj-login-panel jj-login-panel--brand">
          <div className="jj-login-panel__grid" aria-hidden />
          <div className="jj-login-panel__content">
            <Logo variant="dark" size="lg" href="/" />
            <h1 className="jj-login-panel__title">
              Find your next Job
              <br />
              <span className="!text-emerald-400">in Nigeria.</span>
            </h1>
            <p className="jj-login-panel__sub">
              Access curated jobs using your phone number and 4-digit PIN, or
              register directly via USSD.
            </p>
            <div className="jj-login-panel__ussd">
              <span className="jj-login-panel__ussd-code *!text-emerald-400">
                *7098#
              </span>
              <span className="jj-login-panel__ussd-label">
                Subscribe on any network
              </span>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="jj-login-panel jj-login-panel--form">
          <div className="jj-login-form-wrap">
            {/* Tab Switcher */}
            <div
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.05)",
                padding: "4px",
                borderRadius: "10px",
                marginBottom: "24px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <button
                type="button"
                onClick={() => switchMode("login")}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "7px",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: isLogin
                    ? "1px solid rgba(16, 185, 129, 0.4)"
                    : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor: isLogin
                    ? "rgba(16, 185, 129, 0.15)"
                    : "transparent",
                  color: isLogin ? "#34d399" : "rgba(255,255,255,0.5)",
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode("signup")}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "7px",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: !isLogin
                    ? "1px solid rgba(16, 185, 129, 0.4)"
                    : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor: !isLogin
                    ? "rgba(16, 185, 129, 0.15)"
                    : "transparent",
                  color: !isLogin ? "#34d399" : "rgba(255,255,255,0.5)",
                }}
              >
                Sign Up
              </button>
            </div>

            <div className="jj-login-form-head">
              <h2 className="!text-emerald-400">
                {isLogin ? "Welcome back" : "Create an account"}
              </h2>
              <p>
                {isLogin
                  ? "Enter your phone number and 4-digit PIN"
                  : "Set up your phone number and a 4-digit PIN"}
              </p>
            </div>

            {error && <div className="jj-login-error">{error}</div>}

            <form onSubmit={handleSubmit} className="jj-login-form">
              <div className="jj-login-form-group">
                <label className="jj-login-label">Phone number</label>
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  countryCode={country}
                  onCountryChange={setCountry}
                />
              </div>

              <div className="jj-login-form-group">
                <label className="jj-login-label">
                  {isLogin ? "PIN" : "Create 4-Digit PIN"}
                </label>
                <PinInput
                  value={pin}
                  onChange={setPin}
                  hint={
                    isLogin
                      ? "4-digit PIN from your account or *7098# subscription"
                      : "Choose a secure 4-digit numeric PIN"
                  }
                />
              </div>

              {!isLogin && (
                <div className="jj-login-form-group">
                  <label className="jj-login-label">Confirm 4-Digit PIN</label>
                  <PinInput
                    value={confirmPin}
                    onChange={setConfirmPin}
                    hint="Re-enter your 4-digit PIN to confirm"
                  />
                </div>
              )}

              {isLogin && (
                <div className="jj-login-form-row">
                  <label className="jj-login-checkbox">
                    <input type="checkbox" defaultChecked />
                    Keep me signed in
                  </label>
                  <Link
                    href="/forgot-password"
                    className="jj-login-forgot hover:!text-emerald-400"
                  >
                    Forgot PIN?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="jj-btn !bg-emerald-500 hover:!bg-emerald-600 disabled:!bg-emerald-500/50 !text-white jj-login-submit"
              >
                {loading ? (
                  <>
                    <span className="jj-login-spinner" />{" "}
                    {isLogin ? "Signing in…" : "Creating account…"}
                  </>
                ) : (
                  <>
                    {isLogin ? "Sign in" : "Create account"}{" "}
                    <FiArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="jj-login-subscribe">
              <p className="jj-login-subscribe__title">
                Prefer USSD Registration?
              </p>
              <p className="jj-login-subscribe__text">
                Dial <strong>*7098#</strong> directly on your mobile phone to
                subscribe and create your account instantly via SMS/USSD.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="jj-login-page"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className="jj-loader jj-loader--compact">
            <span className="jj-loader__ring jj-loader__ring--compact" />
            <span className="jj-loader__label">Loading</span>
          </span>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
