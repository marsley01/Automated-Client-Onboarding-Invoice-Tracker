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
  title: "Mash — Connect Clients & Get Paid",
  description: "Mash connects your business with clients. Share a link, get their details, track progress, send invoices, and get paid. For Kenyan agencies, freelancers, and repair shops.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${geist.variable} font-sans antialiased`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
