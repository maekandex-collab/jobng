import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import { Lato } from "next/font/google";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Prep Interview ",
  description:
    "Practice job-specific interview questions powered by Maekandex Academy.",
  openGraph: {
    title: "Prep Interview",
    description: "Master job-specific interview questions on JustJobNG.",
    siteName: "JustJobNG",
    type: "website",
  },
};

export default function PrepInterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div
        className={`${lato.variable} font-['Lato',sans-serif] w-full min-h-[calc(100vh-var(--spacing-nav-height)) flex flex-col bg-[#F8F9FA] text-[#0A0F1C]`}
      >
        {children}
      </div>
    </AuthProvider>
  );
}
