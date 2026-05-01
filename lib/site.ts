export const siteConfig = {
  name: "HSC Jobs BD",
  description:
    "বাংলাদেশের verified SSC/HSC pass no experience চাকরির জন্য একটি clean, trusted job board.",
  title:
    "HSC Pass Jobs Bangladesh | SSC Jobs BD | No Experience Jobs",
  metaDescription:
    "বাংলাদেশের SSC/HSC পাস চাকরির আপডেট, যেখানে অভিজ্ঞতা ছাড়াই আবেদন করা যায়।",
  locale: "bn-BD",
  defaultUrl: "https://www.hscjobsbd.com",
  navItems: [
    { href: "/", label: "হোম" },
    { href: "/jobs", label: "চাকরি" },
    { href: "/companies", label: "কোম্পানি" },
  ],
} as const;

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || siteConfig.defaultUrl;
}
