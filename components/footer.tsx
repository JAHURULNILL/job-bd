import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/70">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div className="space-y-3">
          <p className="text-base font-semibold text-slate-900">{siteConfig.name}</p>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            আমরা শুধুমাত্র trusted source থেকে SSC/HSC pass এবং no experience
            যোগ্যতার verified চাকরি দেখাই। eligibility unclear হলে কোনো job প্রকাশ করা
            হয় না।
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-900">নেভিগেশন</p>
          <div className="flex flex-col gap-2 text-sm text-slate-600">
            {siteConfig.navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-slate-900">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-900">গুরুত্বপূর্ণ নোট</p>
          <div className="space-y-2 text-sm leading-7 text-slate-600">
            <p>অফিসিয়াল source ছাড়া কোথাও আবেদন করবেন না।</p>
            <p>expired job কখনো public page-এ দেখানো হয় না।</p>
            <p>এই সাইটে full copyrighted circular কপি করা হয় না।</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
