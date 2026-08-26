"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiLock,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiShield,
  FiArrowRight,
  FiKey,
  FiCheck,
} from "react-icons/fi";
import { authHeaders } from "@/lib/auth-client";

export default function UpdatePasswordPage() {
  const [formData, setFormData] = useState({
    number: "",
    old_pin: "",
    pin: "",
    confirm_pin: "",
  });

  const [showOldPin, setShowOldPin] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Restrict PIN fields to digits only
    if (["old_pin", "pin", "confirm_pin"].includes(name)) {
      const sanitized = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.number || !formData.old_pin || !formData.pin || !formData.confirm_pin) {
      setError("Please fill out all required fields.");
      return;
    }
    if (formData.old_pin.length < 4) {
      setError("Enter your complete current 4-digit PIN.");
      return;
    }
    if (formData.pin.length < 4) {
      setError("Your new PIN must be at least 4 digits.");
      return;
    }
    if (formData.pin !== formData.confirm_pin) {
      setError("New PINs do not match. Please verify and try again.");
      return;
    }
    if (formData.pin === formData.old_pin) {
      setError("New PIN must be different from your current PIN.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          number: formData.number,
          old_pin: formData.old_pin,
          pin: formData.pin,
          confirm_pin: formData.confirm_pin,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ number: "", old_pin: "", pin: "", confirm_pin: "" });
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || "Failed to update PIN. Please verify your details.");
      }
    } catch (err) {
      console.error(err);
      setError("A network connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── SUCCESS STATE ────────────────────────────────────────────────── */
  if (success) {
    return (
      <main className="min-h-[calc(100vh-var(--nav-height,80px)) flex items-center justify-center p-4 bg-(--surface)">
        <div className="max-w-[440px] w-full bg-(--surface-elevated) border border-(--border) rounded-(--radius-md) shadow-(--shadow-md) p-8 md:p-10 text-center relative overflow-hidden backdrop-blur-md animate-fade-in-up">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-(--gold-light) via-(--gold) to-(--gold-hover)" />

          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-(--gold-muted) to-(--surface) border border-(--gold)/30 flex items-center justify-center mx-auto mb-6 shadow-inner text-(--gold)">
            <FiCheckCircle size={32} />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight  mb-2">
            PIN Updated Successfully
          </h2>
          <p className="text-sm text-(--text-muted) leading-relaxed mb-8">
            Your security credentials have been updated. You can now log into your account using your new PIN.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full font-bold text-sm bg-linear-to-r from-(--gold-light) via-(--gold) to-(--gold-hover)  shadow-(--shadow-gold) rounded-(--radius-sm) py-3.5 px-6 transition-all duration-200 active:scale-[0.98] hover:shadow-[0_12px_30px_rgba(0,166,81,0.3) hover:-translate-y-0.5"
          >
            Return to Login <FiArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  /* ── FORM STATE ───────────────────────────────────────────────────── */
  return (
    <main className="min-h-[calc(100vh-var(--nav-height,80px)) flex items-center justify-center p-4 sm:p-6 bg-(--surface) relative overflow-hidden">
      {/* Background Decorative Flares */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-radial from-(--gold)/10 to-transparent pointer-events-none rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-radial from-emerald-500/5 to-transparent pointer-events-none rounded-full blur-3xl" />

      <div className="max-w-[460px] w-full bg-(--surface-elevated) border border-(--border) rounded-(--radius-md) shadow-(--shadow-md) p-6 sm:p-9 relative z-10 backdrop-blur-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-(--gold)/20 via-(--gold)/10 to-transparent border border-(--gold)/30 flex items-center justify-center mx-auto mb-4 text-(--gold-hover) shadow-sm">
            <FiKey size={24} />
          </div>
          <h1 className="text-2xl font-extrabold !text-gray-800 tracking-tight">
            Change Security PIN
          </h1>
          <p className="text-xs sm:text-sm text-(--text-muted) mt-1.5 leading-normal">
            Update your account PIN to keep your access secure.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-start gap-3 p-3.5 mb-6 bg-red-500/10 border border-red-500/25 rounded-(--radius-sm) text-xs text-red-600 dark:text-red-400 animate-fade-in-up">
            <FiAlertCircle size={16} className="shrink-0 mt-0.5" />
            <span className="leading-tight font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone Number Input */}
          <div className="space-y-1.5">
            <label htmlFor="number" className="block text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-(--text-faint)">
                <FiPhone size={16} />
              </div>
              <input
                id="number"
                name="number"
                type="tel"
                placeholder="e.g. 8012345678"
                value={formData.number}
                onChange={handleChange}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 text-sm bg-(--surface) border border-(--border) rounded-(--radius-sm)  placeholder-(--text-faint) focus:outline-none focus:border-(--gold) focus:ring-1 focus:ring-(--gold) transition-all duration-200 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Current PIN Input */}
          <div className="space-y-1.5">
            <label htmlFor="old_pin" className="block text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              Current 4-Digit PIN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-(--text-faint)">
                <FiLock size={16} />
              </div>
              <input
                id="old_pin"
                name="old_pin"
                type={showOldPin ? "text" : "password"}
                placeholder="••••"
                maxLength={4}
                value={formData.old_pin}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 text-sm font-mono tracking-widest bg-(--surface) border border-(--border) rounded-(--radius-sm)  placeholder-(--text-faint) focus:outline-none focus:border-(--gold) focus:ring-1 focus:ring-(--gold) transition-all duration-200 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowOldPin(!showOldPin)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-(--text-faint) hover: transition-colors"
                tabIndex={-1}
              >
                {showOldPin ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* New PIN Input */}
          <div className="space-y-1.5">
            <label htmlFor="pin" className="block text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              New PIN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-(--text-faint)">
                <FiLock size={16} />
              </div>
              <input
                id="pin"
                name="pin"
                type={showPin ? "text" : "password"}
                placeholder="••••"
                maxLength={4}
                value={formData.pin}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
                className="w-full pl-10 pr-11 py-3 text-sm font-mono tracking-widest bg-(--surface) border border-(--border) rounded-(--radius-sm)  placeholder-(--text-faint) focus:outline-none focus:border-(--gold) focus:ring-1 focus:ring-(--gold) transition-all duration-200 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-(--text-faint) hover: transition-colors"
                tabIndex={-1}
              >
                {showPin ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm New PIN Input */}
          <div className="space-y-1.5">
            <label htmlFor="confirm_pin" className="block text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              Confirm New PIN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-(--text-faint)">
                <FiLock size={16} />
              </div>
              <input
                id="confirm_pin"
                name="confirm_pin"
                type={showConfirmPin ? "text" : "password"}
                placeholder="••••"
                maxLength={4}
                value={formData.confirm_pin}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
                className="w-full pl-10 pr-11 py-3 text-sm font-mono tracking-widest bg-(--surface) border border-(--border) rounded-(--radius-sm)  placeholder-(--text-faint) focus:outline-none focus:border-(--gold) focus:ring-1 focus:ring-(--gold) transition-all duration-200 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-(--text-faint) hover: transition-colors"
                tabIndex={-1}
              >
                {showConfirmPin ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            
            {/* Live PIN Match Indicator */}
            {formData.confirm_pin.length > 0 && (
              <div className="flex items-center gap-1.5 pt-1 text-[11px] font-medium">
                {formData.pin === formData.confirm_pin ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <FiCheck size={12} /> PINs match
                  </span>
                ) : (
                  <span className="text-amber-500 flex items-center gap-1">
                    <FiAlertCircle size={12} /> PINs do not match
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 py-2 text-[11px] text-(--text-faint) font-medium">
            <FiShield size={14} className="text-(--gold) shrink-0" />
            <span>Encrypted update session. Never share your security PIN with anyone.</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold text-sm bg-linear-to-r from-(--gold-light) via-(--gold) to-(--gold-hover)  shadow-(--shadow-gold) rounded-(--radius-sm) py-3.5 px-6 transition-all duration-200 active:scale-[0.98] hover:shadow-[0_12px_30px_rgba(0,166,81,0.3) hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-(--ink) border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Update Security PIN</span>
                <FiArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}