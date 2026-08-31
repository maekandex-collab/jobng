"use client";

import { useState } from "react";
import {
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiLoader,
  FiSend,
  FiRefreshCw,
} from "react-icons/fi";

export default function ContactPage() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok && result.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(
          result.error || "An unexpected error occurred. Please try again.",
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 select-none">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-[#8DC63F] via-[#00A651] to-[#00863F] text-white pt-28 sm:pt-36 pb-24 relative overflow-hidden">
        {/* Soft Ambient Mesh Background */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10 text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] max-w-3xl mx-auto text-white">
            Get In Touch
          </h1>

          <p className="mt-4 text-base sm:text-xl text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
            Have questions or need assistance? Send us a message and our support
            team will respond promptly.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 -mt-12 sm:-mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Info Sidebar (1 Column) */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            {/* Phone & USSD Card */}
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 p-6 rounded-3xl shadow-lg flex gap-4 items-start hover:border-slate-300 transition-all duration-200">
              <div className="w-12 h-12 rounded-2xl bg-[#00A651]/10 border border-[#00A651]/20 flex items-center justify-center text-[#00A651] shrink-0 text-xl font-bold">
                <FiPhone />
              </div>
              <div>
                <h4 className="text-xs font-extrabold !text-slate-400 uppercase tracking-widest mb-1">
                  Phone & USSD
                </h4>
                <p className="text-slate-900 font-bold text-base leading-snug">
                  <span className="text-[#00A651] font-mono font-extrabold text-lg block mb-0.5">
                    *7098#
                  </span>
                  +234 801 234 5678
                </p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 p-6 rounded-3xl shadow-lg flex gap-4 items-start hover:border-slate-300 transition-all duration-200">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0 text-xl font-bold">
                <FiMail />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                  Direct Email
                </h4>
                <p className="text-slate-900 font-bold text-base">
                  hello@JustJobNG.com
                </p>
              </div>
            </div>
          </div>

          {/* Form Area (2 Columns) */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-2xl lg:col-span-2">
            <h2 className="text-2xl sm:text-3xl font-black !text-slate-900 tracking-tight mb-2">
              Send a Message
            </h2>
            <p className="text-slate-500 text-sm mb-8 font-normal">
              Fill out the form below and our response team will get back to you
              within 24 hours.
            </p>

            {status === "success" ? (
              <div className="text-center py-12 px-4 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#00A651]/10 border border-[#00A651]/20 flex items-center justify-center text-[#00A651] mb-6">
                  <FiCheckCircle className="text-5xl" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                  Message Sent Successfully!
                </h3>
                <p className="text-slate-600 max-w-md mx-auto text-base leading-relaxed">
                  Thank you for reaching out. A confirmation has been logged,
                  and a support agent will get back to you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm transition-all duration-200"
                >
                  <FiRefreshCw />
                  <span>Send Another Message</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Adewale Okafor"
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 font-medium placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-[#00A651] focus:ring-4 focus:ring-[#00A651]/15"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. adewale@example.com"
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 font-medium placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-[#00A651] focus:ring-4 focus:ring-[#00A651]/15"
                    />
                  </div>
                </div>

                {/* Subject Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    name="subject"
                    type="text"
                    required
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 font-medium placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-[#00A651] focus:ring-4 focus:ring-[#00A651]/15"
                  />
                </div>

                {/* Message Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Provide details regarding your inquiry..."
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 font-medium placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-[#00A651] focus:ring-4 focus:ring-[#00A651]/15 resize-y"
                  />
                </div>

                {/* Error Banner */}
                {status === "error" && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full sm:w-auto self-start inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#00A651] hover:bg-[#00863F] disabled:opacity-60 text-white font-extrabold text-base transition-all duration-200 shadow-lg shadow-[#00A651]/25 hover:shadow-xl hover:shadow-[#00A651]/35 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <FiLoader className="animate-spin text-xl" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="text-lg" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
