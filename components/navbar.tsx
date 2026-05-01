import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[rgba(248,250,252,0.92)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 shadow-sm">
            HB
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {siteConfig.name}
            </div>
            <div className="text-xs text-slate-500">
              Verified SSC/HSC No Experience Jobs
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/jobs"
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          চাকরি দেখুন
        </Link>
      </div>
    </header>
  );
}
