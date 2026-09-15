import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MockEmailDrawer } from "@/components/MockEmailDrawer";

export const metadata: Metadata = {
  title: "CrewDeck | Campus Society Recruitment & Talent Pipeline",
  description:
    "Next-generation college society recruitment platform with structured Kanban applicant pipelines, rubric scoring, self-serve interview booking, and real-time status tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <MockEmailDrawer />
        </AuthProvider>
      </body>
    </html>
  );
}
