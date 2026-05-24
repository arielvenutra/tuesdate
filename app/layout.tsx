import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Tuesdate 💕",
  description: "Your weekly date night planner",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d0618",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-brand-dark text-white antialiased">
        {/* Background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-80 h-80 rounded-full bg-brand-purple opacity-10 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-brand-rose opacity-10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-brand-pink opacity-5 blur-3xl" />
        </div>

        <div className="flex flex-col min-h-dvh max-w-lg mx-auto px-4">
          <main className="flex-1 pb-24">{children}</main>
          <Navigation />
        </div>
      </body>
    </html>
  );
}
