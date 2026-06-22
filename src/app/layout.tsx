import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const geist = localFont({
  src: [
    { path: "./fonts/GeistVF.woff", weight: "400 700", style: "normal" },
  ],
  variable: "--font-geist",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dicosis — Automated Client Onboarding & Invoice Tracker",
  description: "Get paid faster. Track every job. Dicosis gives your agency or repair shop a professional client portal, automated invoices, and real-time status tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.variable} ${geist.variable} font-sans antialiased`}>
        <ToastProvider>
          {children}
        </ToastProvider>
        <script src="https://js.paystack.co/v1/inline.js" />
      </body>
    </html>
  );
}
