import { parseDeadlineFromText } from "@/lib/jobs/dates";
import { normalizeWhitespace } from "@/lib/utils";

type EligibilityResult = {
  matched: string[];
  disallowed: string[];
  eligible: boolean;
};

const educationAllowRules: Array<{ label: string; pattern: RegExp }> = [
  { label: "Class 8", pattern: /\bclass\s*8\b|অষ্টম\s*(শ্রেণি|পাশ)?/i },
  { label: "SSC", pattern: /\bssc\b|এসএসসি/i },
  { label: "Class 10", pattern: /\bclass\s*10\b|দশম\s*(শ্রেণি|পাশ)?/i },
  { label: "HSC", pattern: /\bhsc\b|এইচএসসি/i },
  { label: "Class 12", pattern: /\bclass\s*12\b|দ্বাদশ\s*(শ্রেণি|পাশ)?/i },
  { label: "Equivalent", pattern: /সমমান|equivalent/i },
];

const educationDisallowRules: Array<{ label: string; pattern: RegExp }> = [
  { label: "Bachelor required", pattern: /bachelor|undergraduate|graduate/i },
  { label: "Masters required", pattern: /masters?|postgraduate/i },
  { label: "Honours required", pattern: /honou?rs?/i },
];

const experienceAllowRules: Array<{ label: string; pattern: RegExp }> = [
  { label: "No experience required", pattern: /no experience|experience not required/i },
  { label: "Freshers can apply", pattern: /fresher|fresh graduates?|নতুনদের আবেদন/i },
  { label: "Zero year", pattern: /\b0\s*(?:-|to)?\s*0?\s*years?\b/i },
  { label: "Training provided", pattern: /training will be provided|on-the-job training/i },
  { label: "Experience not needed", pattern: /অভিজ্ঞতা (?:লাগবে না|প্রয়োজন নেই)/i },
];

const experienceDisallowRules: Array<{ label: string; pattern: RegExp }> = [
  { label: "Minimum 1 year experience", pattern: /minimum\s+1\s+year/i },
  { label: "1+ year experience", pattern: /\b[1-9]\+?\s*years?\b/i },
  { label: "Experienced only", pattern: /experienced only/i },
  { label: "Senior or manager role", pattern: /\bsenior\b|\bmanager\b/i },
];

function evaluateRules(
  value: string,
  allowRules: Array<{ label: string; pattern: RegExp }>,
  disallowRules: Array<{ label: string; pattern: RegExp }>,
): EligibilityResult {
  const text = normalizeWhitespace(value.toLowerCase());

  const matched = allowRules
    .filter((rule) => rule.pattern.test(text))
    .map((rule) => rule.label);
  const disallowed = disallowRules
    .filter((rule) => rule.pattern.test(text))
    .map((rule) => rule.label);

  return {
    matched,
    disallowed,
    eligible: matched.length > 0 && disallowed.length === 0,
  };
}

export function evaluateEducation(value: string) {
  return evaluateRules(value, educationAllowRules, educationDisallowRules);
}

export function evaluateExperience(value: string) {
  return evaluateRules(value, experienceAllowRules, experienceDisallowRules);
}

export function evaluateDeadline(value: string) {
  const deadline = parseDeadlineFromText(value);

  return {
    deadline,
    eligible: Boolean(deadline && deadline.getTime() >= Date.now()),
  };
}
