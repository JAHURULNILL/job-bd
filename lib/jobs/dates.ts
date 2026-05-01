import { endOfDay } from "date-fns";

const banglaDigitMap: Record<string, string> = {
  "০": "0",
  "১": "1",
  "২": "2",
  "৩": "3",
  "৪": "4",
  "৫": "5",
  "৬": "6",
  "৭": "7",
  "৮": "8",
  "৯": "9",
};

const banglaMonths: Record<string, string> = {
  জানুয়ারি: "January",
  ফেব্রুয়ারি: "February",
  মার্চ: "March",
  এপ্রিল: "April",
  মে: "May",
  জুন: "June",
  জুলাই: "July",
  আগস্ট: "August",
  সেপ্টেম্বর: "September",
  অক্টোবর: "October",
  অক্টোবর: "October",
  নভেম্বর: "November",
  ডিসেম্বর: "December",
};

function normalizeDateText(value: string) {
  let nextValue = value.toLowerCase();

  nextValue = nextValue.replace(/[০-৯]/g, (digit) => banglaDigitMap[digit] ?? digit);

  Object.entries(banglaMonths).forEach(([bnMonth, enMonth]) => {
    nextValue = nextValue.replaceAll(bnMonth, enMonth.toLowerCase());
  });

  return nextValue.replace(/[,|]/g, " ");
}

function buildDate(year: number, month: number, day: number) {
  const date = new Date(year, month, day);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return endOfDay(date);
}

export function parseDeadlineFromText(value: string) {
  const normalized = normalizeDateText(value);

  const monthNamePattern =
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})\s+(\d{4})/i;
  const dayFirstMonthPattern =
    /(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/i;
  const numericPattern = /(\d{1,2})[/-](\d{1,2})[/-](\d{4})/;

  const monthMap = new Map<string, number>([
    ["january", 0],
    ["february", 1],
    ["march", 2],
    ["april", 3],
    ["may", 4],
    ["june", 5],
    ["july", 6],
    ["august", 7],
    ["september", 8],
    ["october", 9],
    ["november", 10],
    ["december", 11],
  ]);

  const monthMatch = normalized.match(monthNamePattern);
  if (monthMatch) {
    const [, monthName, day, year] = monthMatch;
    return buildDate(Number(year), monthMap.get(monthName)! ?? 0, Number(day));
  }

  const dayFirstMatch = normalized.match(dayFirstMonthPattern);
  if (dayFirstMatch) {
    const [, day, monthName, year] = dayFirstMatch;
    return buildDate(Number(year), monthMap.get(monthName)! ?? 0, Number(day));
  }

  const numericMatch = normalized.match(numericPattern);
  if (numericMatch) {
    const [, day, month, year] = numericMatch;
    return buildDate(Number(year), Number(month) - 1, Number(day));
  }

  return null;
}
