import slugify from "slugify";

export function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
}

export function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trim()}…`;
}

export function createSlug(value: string) {
  return slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function formatDateBn(value?: Date | string | null) {
  if (!value) {
    return "উল্লেখ নেই";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "উল্লেখ নেই";
  }

  return new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function toBanglaNumber(value: number | string) {
  return String(value).replace(/\d/g, (digit) =>
    String.fromCharCode("০".charCodeAt(0) + Number(digit)),
  );
}

export function formatDeadlineTag(value?: Date | string | null) {
  if (!value) {
    return "ডেডলাইন অজানা";
  }

  const deadline = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(deadline.getTime())) {
    return "ডেডলাইন অজানা";
  }

  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return "মেয়াদ শেষ";
  }

  if (days === 0) {
    return "আজ শেষ দিন";
  }

  if (days <= 3) {
    return `${toBanglaNumber(days)} দিনের মধ্যে`;
  }

  if (days <= 7) {
    return "Deadline Soon";
  }

  return formatDateBn(deadline);
}

type SearchParamValue = string | string[] | undefined;

export function buildUrlWithSearchParams(
  pathname: string,
  current: Record<string, SearchParamValue>,
  updates: Record<string, string | null | undefined>,
) {
  const params = new URLSearchParams();

  Object.entries(current).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) {
          params.set(key, item);
        }
      });
      return;
    }

    if (value) {
      params.set(key, value);
    }
  });

  Object.entries(updates).forEach(([key, value]) => {
    if (!value) {
      params.delete(key);
      return;
    }

    params.set(key, value);
  });

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function sanitizePlainText(value: string) {
  return normalizeWhitespace(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<\/?[^>]+>/g, " "),
  );
}
