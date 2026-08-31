"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiPhone, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { normalizeNigerianPhone } from "@/lib/phone";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneFromQuery = (
    searchParams.get("num") ??
    searchParams.get("phone") ??
    ""
  ).trim();

  const [phone, setPhone] = useState("");
  const [phoneLocked, setPhoneLocked] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  useEffect(() => {
    const digits = phoneFromQuery.replace(/\D/g, "");
    if (digits.length < 10) return;
    setPhone(normalizeNigerianPhone(digits));
    setPhoneLocked(true);
  }, [phoneFromQuery]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^\d{4}$/.test(pin)) {
      setError("PIN must be exactly 4 digits.");
      return;
    }

    if (pin !== confirmPin) {
      setError("PINs do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          countryCode: country,
          pin,
          confirmPin,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not create account.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push(callbackUrl), 1200);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jj-jobs-page">
      <div className="jj-jobs-hero">
        <div className="container-xl">
          <h1 className="jj-jobs-hero__title">Create your account</h1>
          <p className="jj-jobs-hero__sub">
            Already subscribed via *7098#? Sign up here to manage your profile on the web.
          </p>
          <Link
            href="/login"
            className="jj-btn !bg-emerald-500 hover:!bg-emerald-600 !text-white"
            style={{ padding: "12px 28px" }}
          >
            Sign In Now <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

      <div className="container-xl" style={{ padding: "3rem 0 5rem", display: "flex", justifyContent: "center" }}>
        <div className="jj-card" style={{ maxWidth: 440, width: "100%", padding: "2.5rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="jj-jobs-search">
              <FiPhone size={16} style={{ color: "var(--gold-hover)", flexShrink: 0 }} />
              <input
                type="tel"
                placeholder="Phone number (e.g. 0803...)"
                value={phone}
                onChange={(e) => {
                  if (!phoneLocked) setPhone(e.target.value);
                }}
                required
                readOnly={phoneLocked}
                autoComplete="tel"
                aria-label="Phone number"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.9375rem",
                  color: "var(--text)",
                  padding: "12px 0",
                  opacity: phoneLocked ? 0.9 : 1,
                  cursor: phoneLocked ? "not-allowed" : "text",
                }}
              />
            </div>
            {phoneLocked ? (
              <p style={{ margin: "-6px 0 0", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                This number came from your subscription link and cannot be changed.
              </p>
            ) : null}

        {/* Right panel — form */}
        <div className="jj-login-panel jj-login-panel--form">
          <div className="jj-login-form-wrap">
            <div className="jj-login-form-head">
              <h2 className="!text-emerald-400">Create an account</h2>
              <p>Set up your phone number and a 4-digit PIN</p>
            </div>

            {error && <div className="jj-login-error">{error}</div>}

            <form onSubmit={handleSubmit} className="jj-login-form">
              <div className="jj-login-form-group">
                <label className="text-gray-600 jj-login-label">Phone number</label>
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  countryCode={country}
                  onCountryChange={setCountry}
                />
              </div>

              <div className="jj-login-form-group">
                <label className="jj-login-label">Create 4-Digit PIN</label>
                <PinInput
                  value={pin}
                  onChange={setPin}
                  hint="Choose a secure 4-digit numeric PIN"
                />
              </div>

              <div className="jj-login-form-group">
                <label className="jj-login-label">Confirm 4-Digit PIN</label>
                <PinInput
                  value={confirmPin}
                  onChange={setConfirmPin}
                  hint="Re-enter your 4-digit PIN to confirm"
                />
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="jj-btn !bg-emerald-500 hover:!bg-emerald-600 disabled:!bg-emerald-500/50 !text-white jj-login-submit"
              >
                {loading ? (
                  <>
                    <span className="jj-login-spinner" /> Creating account…
                  </>
                ) : (
                  <>
                    Create account <FiArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p
              style={{
                marginTop: "20px",
                fontSize: "0.875rem",
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="!text-emerald-400 hover:underline"
                style={{ fontWeight: 600 }}
              >
                Sign in
              </Link>
            </p>

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

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="jj-jobs-page">
          <div className="jj-jobs-hero">
            <div className="container-xl">
              <h1 className="jj-jobs-hero__title">Create your account</h1>
            </div>
          </div>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
