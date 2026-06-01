import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bet Tracker PRO",
  description: "Bet tracking dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <main
          className="min-h-screen text-white bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.65)), url('/stadium.png')",
          }}
        >
          <div className="flex min-h-screen">
            <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-black/50 p-6">
              <div className="mb-12">
                <h1 className="text-2xl font-black leading-tight">
                  BET TRACKER
                  <span className="block text-green-400">PRO</span>
                </h1>
              </div>

              <nav className="space-y-3">
                <Link href="/" className="block rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10">
                  Dashboard
                </Link>

                <Link href="/bankrolls" className="block rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10">
                  Bankroll
                </Link>

                <div className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10">
                  Statystyki
                </div>

                <div className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10">
                  Ustawienia
                </div>
              </nav>

              <div className="mt-auto text-sm">
                <p className="font-semibold">Lukasz</p>
                <p className="text-green-400">Premium</p>
              </div>
            </aside>

            <section className="flex-1 p-6 md:p-10">
              {children}
            </section>
          </div>
        </main>
      </body>
    </html>
  );
}