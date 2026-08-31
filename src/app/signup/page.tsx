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
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ phone, countryCode: "+234", pin, confirmPin }),
      });
      const data = await res.json();
      setLoading(false);

      if (!data.ok) {
        setError(data.error ?? "Could not create account.");
        return;
      }
      router.push("/login");
    } catch {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="jj-jobs-page">
      <div className="jj-jobs-hero">
        <div className="container-xl">
          <h1 className="jj-jobs-hero__title">Create your account</h1>
          <p className="jj-jobs-hero__sub">
            Already subscribed via *7098#? Sign up here to manage your profile on the web.
          </p>
        </div>
      </div>

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

            <div className="jj-jobs-search">
              <FiLock size={16} style={{ color: "var(--gold-hover)", flexShrink: 0 }} />
              <input
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={4}
                placeholder="4-digit PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                required
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.9375rem",
                  color: "var(--text)",
                  padding: "12px 0",
                  letterSpacing: "0.2em",
                }}
              />
              <button
                type="button"
                title={showPin ? "Hide PIN" : "Show PIN"}
                onClick={() => setShowPin((s) => !s)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)" }}
              >
                {showPin ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>

            <div className="jj-jobs-search">
              <FiLock size={16} style={{ color: "var(--gold-hover)", flexShrink: 0 }} />
              <input
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={4}
                placeholder="Confirm PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                required
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.9375rem",
                  color: "var(--text)",
                  padding: "12px 0",
                  letterSpacing: "0.2em",
                }}
              />
            </div>

            {error && (
              <p style={{ color: "#ef4444", fontSize: "0.875rem", margin: 0 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="jj-btn jj-btn--gold"
              style={{ padding: "13px", marginTop: 8, opacity: loading ? 0.7 : 1, fontWeight: 700 }}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p style={{ marginTop: 20, fontSize: "0.875rem", textAlign: "center", color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--gold-hover)", fontWeight: 700 }}>
              Log in
            </Link>
          </p>
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
