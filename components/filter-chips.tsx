import Link from "next/link";

import { buildUrlWithSearchParams } from "@/lib/utils";

type FilterChipsProps = {
  pathname: string;
  searchParams: Record<string, string | string[] | undefined>;
};

const chips = [
  { label: "SSC", key: "education", value: "SSC" },
  { label: "HSC", key: "education", value: "HSC" },
  { label: "No Experience", key: "experience", value: "no-experience" },
  { label: "Deadline Soon", key: "deadline", value: "soon" },
  { label: "Career Source", key: "sourceChannel", value: "career" },
  { label: "Other Verified", key: "sourceChannel", value: "verified-board" },
] as const;

export function FilterChips({ pathname, searchParams }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {chips.map((chip) => {
        const active = searchParams[chip.key] === chip.value;
        const href = buildUrlWithSearchParams(pathname, searchParams, {
          [chip.key]: active ? null : chip.value,
        });

        return (
          <Link
            key={`${chip.key}-${chip.value}`}
            href={href}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              active
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            {chip.label}
          </Link>
        );
      })}
    </div>
  );
}
