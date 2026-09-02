"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiArrowRight,
  FiAlertCircle,
  FiRefreshCw,
  FiEdit3,
  FiShield,
  FiCheckCircle,
  FiLock,
} from "react-icons/fi";

import { StageStepper } from "@/components/auth/StageStepper";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { ResetSuccess } from "@/components/auth/ResetSuccess";
import { OtpInput } from "@/components/auth/OTPInput";
import { PinInput } from "@/components/auth/PInInput";

const PIN_LENGTH = 4;
const OTP_LENGTH = 6;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 7) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, countryCode }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(
          data.error ||
            "Failed to request reset. Please check your phone number."
        );
        return;
      }

      setStep(2);
    } catch {
      setError("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otp.length !== OTP_LENGTH) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          countryCode,
          pin: otp,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(
          data.error || "Invalid or expired OTP verification code."
        );
        return;
      }

      setStep(3);
    } catch {
      setError("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          countryCode,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to resend verification OTP.");
      }
    } catch {
      setError("Network connection error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pin.length !== PIN_LENGTH) {
      setError("Please enter a complete 4-digit PIN.");
      return;
    }

    if (pin !== confirmPin) {
      setError("PINs do not match. Please verify and try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          countryCode,
          pin,
          confirm_pin: confirmPin,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to update PIN. Please try again.");
        return;
      }

      setStep(4);
    } catch {
      setError("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 4) {
    return <ResetSuccess />;
  }

  return (
    <main className="jj-login-page">
      <div className="jj-login-split">
        <BrandPanel />

        <div className="jj-login-panel jj-login-panel--form">
          <div className="jj-login-form-wrap">

            {/* Back */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-(--text-muted) hover:text-(--gold-hover) uppercase tracking-wider mb-7 transition-colors"
            >
              <FiArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>

            {/* Progress */}
            <StageStepper currentStep={step} totalSteps={3} />

            {/* Header */}
            <div className="jj-login-form-head">
              <h2 className="text-[#8DC63F]">
                {step === 1
                  ? "Forgot your PIN?"
                  : step === 2
                  ? "Verify your account"
                  : "Create a new PIN"}
              </h2>

              <p>
                {step === 1
                  ? "Enter your registered phone number to receive a verification code."
                  : step === 2
                  ? `We've sent a 6-digit verification code to ${countryCode}${phone}.`
                  : "Choose a new 4-digit PIN to keep your account secure."}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="jj-login-error flex items-start gap-2.5">
                <FiAlertCircle
                  size={16}
                  className="shrink-0 mt-0.5"
                />
                <span>{error}</span>
              </div>
            )}

            {/* =================================================================
                STEP 1 — PHONE NUMBER
               ================================================================= */}

            {step === 1 && (
              <form
                onSubmit={handleResetRequest}
                className="jj-login-form"
              >
                <div className="jj-login-form-group">
                  <label className="jj-login-label">
                    Phone Number
                  </label>

                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    countryCode={countryCode}
                    onCountryChange={setCountryCode}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={phone.length < 7 || loading}
                  className="jj-btn jj-btn--gold jj-login-submit"
                >
                  {loading ? (
                    <>
                      <span className="jj-login-spinner" />
                      <span>Sending OTP…</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP Code</span>
                      <FiArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* =================================================================
                STEP 2 — OTP VERIFICATION
               ================================================================= */}

            {step === 2 && (
              <form
                onSubmit={handleVerifyOtp}
                className="jj-login-form"
              >

                {/* Verification intro */}
                <div className="relative overflow-hidden rounded-xl border border-(--border-strong) bg-(--surface) p-5">

                  <div className="flex items-start gap-4">

                    {/* Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#8DC63F]/10 text-[#8DC63F]">
                      <FiShield size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-(--text)">
                        Verification required
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-(--text-muted)">
                        Enter the code we sent to verify that this
                        account belongs to you.
                      </p>
                    </div>

                  </div>

                  {/* Phone */}
                  <div className="mt-4 flex items-center justify-between rounded-lg border border-(--border-strong) bg-(--background) px-3.5 py-3">

                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-(--text-muted)">
                        Code sent to
                      </span>

                      <span className="mt-0.5 block font-mono text-sm font-bold text-(--text)">
                        {countryCode} {phone}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setOtp("");
                        setError("");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8DC63F] transition-colors hover:underline"
                    >
                      <FiEdit3 size={13} />
                      Edit
                    </button>

                  </div>
                </div>

                {/* OTP */}
                <div className="jj-login-form-group pt-3">

                  <div className="mb-4 text-center">
                    <label className="text-sm font-bold text-(--text)">
                      Enter verification code
                    </label>

                    <p className="mt-1 text-xs text-(--text-muted)">
                      Enter the 6 digits from the SMS
                    </p>
                  </div>

                  {/* OTP INPUT */}
                  <div className="flex justify-center">
                    <OtpInput
                      value={otp}
                      onChange={(val) => {
                        setError("");
                        setOtp(val);
                      }}
                      length={OTP_LENGTH}
                      disabled={loading}
                      hasError={Boolean(error)}
                    />
                  </div>

                </div>

                {/* Verify */}
                <button
                  type="submit"
                  disabled={
                    otp.length !== OTP_LENGTH || loading
                  }
                  className="jj-btn jj-btn--gold jj-login-submit"
                >
                  {loading ? (
                    <>
                      <span className="jj-login-spinner" />
                      <span>Verifying code…</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Continue</span>
                      <FiArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Resend */}
                <div className="flex flex-col items-center gap-2 pt-3">

                  <span className="text-[11px] text-(--text-muted)">
                    Didn&apos;t receive the code?
                  </span>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#8DC63F] transition-colors hover:underline disabled:opacity-50"
                  >
                    <FiRefreshCw
                      size={13}
                      className={
                        resending ? "animate-spin" : ""
                      }
                    />

                    <span>
                      {resending
                        ? "Sending a new code…"
                        : "Resend verification code"}
                    </span>
                  </button>

                </div>
              </form>
            )}

            {/* =================================================================
                STEP 3 — NEW PIN
               ================================================================= */}

            {step === 3 && (
              <form
                onSubmit={handleUpdatePassword}
                className="jj-login-form"
              >

                {/* Account information */}
                <div className="rounded-xl border border-(--border-strong) bg-(--surface) p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8DC63F]/10 text-[#8DC63F]">
                      <FiLock size={18} />
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-(--text-muted)">
                        Updating PIN for
                      </span>

                      <span className="mt-0.5 block font-mono text-sm font-bold text-(--text)">
                        {countryCode} {phone}
                      </span>
                    </div>

                  </div>

                </div>

                {/* PIN setup */}
                <div className="rounded-xl border border-(--border-strong) bg-(--surface) p-5">

                  <div className="mb-5">
                    <div className="flex items-center gap-2">
                      <FiShield
                        size={15}
                        className="text-[#8DC63F]"
                      />

                      <span className="text-sm font-bold text-(--text)">
                        Set your new PIN
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs leading-relaxed text-(--text-muted)">
                      Your PIN should be easy for you to remember
                      but difficult for others to guess.
                    </p>
                  </div>

                  <div className="space-y-5">

                    {/* New PIN */}
                    <div className="jj-login-form-group">
                      <label className="jj-login-label">
                        New 4-Digit PIN
                      </label>

                      <PinInput
                        value={pin}
                        onChange={(value) => {
                          setError("");
                          setPin(value);
                        }}
                        placeholder="Enter new PIN"
                        disabled={loading}
                      />

                      <p className="mt-2 text-[11px] text-(--text-muted)">
                        Enter exactly 4 digits.
                      </p>
                    </div>

                    {/* Confirm PIN */}
                    <div className="jj-login-form-group">
                      <label className="jj-login-label">
                        Confirm New PIN
                      </label>

                      <PinInput
                        value={confirmPin}
                        onChange={(value) => {
                          setError("");
                          setConfirmPin(value);
                        }}
                        placeholder="Re-enter your PIN"
                        disabled={loading}
                      />

                      {confirmPin.length === PIN_LENGTH &&
                        pin === confirmPin && (
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#8DC63F]">
                            <FiCheckCircle size={13} />
                            <span>PINs match</span>
                          </div>
                        )}
                    </div>

                  </div>
                </div>

                {/* Update */}
                <button
                  type="submit"
                  disabled={
                    pin.length !== PIN_LENGTH ||
                    confirmPin.length !== PIN_LENGTH ||
                    loading
                  }
                  className="jj-btn jj-btn--gold jj-login-submit"
                >
                  {loading ? (
                    <>
                      <span className="jj-login-spinner" />
                      <span>Updating PIN…</span>
                    </>
                  ) : (
                    <>
                      <span>Save New PIN</span>
                      <FiArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Security note */}
                <div className="flex items-start justify-center gap-2 px-4 pt-1 text-center">
                  <FiShield
                    size={13}
                    className="mt-0.5 shrink-0 text-(--text-muted)"
                  />

                  <p className="text-[10px] leading-relaxed text-(--text-muted)">
                    Never share your PIN with anyone, including
                    someone claiming to be from support.
                  </p>
                </div>

              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
