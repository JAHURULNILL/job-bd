import { CompanyCard } from "@/components/company-card";
import { getCompanyDirectory } from "@/lib/jobs/queries";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

export const metadata = {
  title: `Trusted Companies | ${siteConfig.name}`,
  description: "Verified source company-wise SSC/HSC no experience job listing.",
};

export default async function CompaniesPage() {
  const companies = await getCompanyDirectory();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_16px_42px_rgba(15,23,42,0.05)]">
        <p className="text-sm font-semibold text-blue-700">Company Directory</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
          trusted কোম্পানি ও official source
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600">
          এই directory-তে registry-তে থাকা trusted কোম্পানিগুলো দেখানো হয়। open job
          count real data থেকে আসে।
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => (
          <CompanyCard key={company.companySlug} {...company} />
        ))}
      </section>
    </div>
  );
}
