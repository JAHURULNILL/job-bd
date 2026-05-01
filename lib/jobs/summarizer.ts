import { formatDateBn } from "@/lib/utils";

export const APPLY_RULES_BN =
  "আবেদন করতে নিচের Apply Now বাটনে ক্লিক করে অফিসিয়াল সোর্সে গিয়ে আবেদন সম্পন্ন করুন।";

type SummaryInput = {
  company: string;
  title: string;
  location: string;
  deadline: Date;
  education: string[];
  experience: string[];
  jobType?: string | null;
  salary?: string | null;
};

export function buildBanglaSummary(input: SummaryInput) {
  const sentences = [
    `${input.company}-এ ${input.title} পদের জন্য নিয়োগ বিজ্ঞপ্তি প্রকাশ হয়েছে।`,
    input.location !== "বাংলাদেশ"
      ? `কর্মস্থল: ${input.location}।`
      : null,
    input.jobType ? `চাকরির ধরন: ${input.jobType}।` : null,
    input.education.length
      ? `শিক্ষাগত যোগ্যতা হিসেবে ${input.education.join(", ")} উল্লেখ আছে।`
      : null,
    input.experience.length
      ? `অভিজ্ঞতার ক্ষেত্রে ${input.experience.join(", ")} বলা হয়েছে।`
      : null,
    `আবেদনের শেষ সময় ${formatDateBn(input.deadline)}।`,
    input.salary ? `বেতনের তথ্য: ${input.salary}।` : null,
  ];

  return sentences.filter(Boolean).join(" ");
}
