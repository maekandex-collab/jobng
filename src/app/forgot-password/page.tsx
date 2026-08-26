"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiArrowRight,
  FiAlertCircle,
  FiRefreshCw,
  FiEdit3,
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
        setError(data.error || "Failed to request reset. Please check your phone number.");
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
        body: JSON.stringify({ phone, countryCode, pin: otp }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Invalid or expired OTP verification code.");
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
        body: JSON.stringify({ phone, countryCode }),
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
        body: JSON.stringify({ phone, countryCode, pin, confirm_pin: confirmPin }),
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
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-(--text-muted) hover: uppercase tracking-wider mb-6 transition-colors"
            >
              <FiArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>

            {/* Custom Stage Stepper Component */}
            <StageStepper currentStep={step} totalSteps={3} />

            <div className="jj-login-form-head">
              <h2>
                {step === 1
                  ? "Forgot your PIN?"
                  : step === 2
                  ? "Enter Verification OTP"
                  : "Update your PIN"}
              </h2>
              <p>
                {step === 1
                  ? "Enter your registered phone number to receive an SMS OTP code."
                  : step === 2
                  ? `An OTP code has been sent to ${countryCode}${phone}. Enter it below.`
                  : "Set a new 4-digit PIN for your account."}
              </p>
            </div>

            {error && (
              <div className="jj-login-error flex items-start gap-2.5">
                <FiAlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Phone */}
            {step === 1 && (
              <form onSubmit={handleResetRequest} className="jj-login-form">
                <div className="jj-login-form-group">
                  <label className="jj-login-label">Phone Number</label>
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

            {/* STEP 2: OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="jj-login-form">
                <div className="flex items-center justify-between p-3 bg-(--surface) border border-(--border-strong) rounded-(--radius-sm) text-xs">
                  <span className="font-mono  font-semibold">
                    {countryCode} {phone}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                      setError("");
                    }}
                    className="text-(--gold-hover) hover:underline flex items-center gap-1 font-bold"
                  >
                    <FiEdit3 size={12} /> Edit Number
                  </button>
                </div>

                <div className="jj-login-form-group py-2">
                  <label className="jj-login-label mb-3 block text-center">
                    Enter 6-Digit Code
                  </label>
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

                <button
                  type="submit"
                  disabled={otp.length !== OTP_LENGTH || loading}
                  className="jj-btn jj-btn--gold jj-login-submit"
                >
                  {loading ? (
                    <>
                      <span className="jj-login-spinner" />
                      <span>Verifying OTP…</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <FiArrowRight size={16} />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-(--text-muted) hover: transition-colors disabled:opacity-50"
                  >
                    <FiRefreshCw
                      size={13}
                      className={resending ? "animate-spin" : ""}
                    />
                    <span>{resending ? "Resending code…" : "Didn't receive code? Resend"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: New PIN */}
            {step === 3 && (
              <form onSubmit={handleUpdatePassword} className="jj-login-form">
                <div className="p-3 bg-(--surface) border border-(--border-strong) rounded-(--radius-sm) text-xs mb-2">
                  <span className="text-(--text-muted) block mb-0.5">Updating PIN for:</span>
                  <span className="font-mono  font-bold">
                    {countryCode} {phone}
                  </span>
                </div>

                <div className="jj-login-form-group">
                  <label className="jj-login-label">New 4-Digit PIN</label>
                  <PinInput
                    value={pin}
                    onChange={setPin}
                    placeholder="Enter new PIN"
                    disabled={loading}
                  />
                </div>

                <div className="jj-login-form-group">
                  <label className="jj-login-label">Confirm New PIN</label>
                  <PinInput
                    value={confirmPin}
                    onChange={setConfirmPin}
                    placeholder="Confirm new PIN"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    pin.length !== PIN_LENGTH ||
                    confirmPin.length !== PIN_LENGTH ||
                    loading
                  }
                  className="jj-btn jj-btn--gold jj-login-submit mt-2"
                >
                  {loading ? (
                    <>
                      <span className="jj-login-spinner" />
                      <span>Updating PIN…</span>
                    </>
                  ) : (
                    <>
                      <span>Update Password / PIN</span>
                      <FiArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}