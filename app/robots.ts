import type { MetadataRoute } from "next";

import { getBaseUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/jobs", "/companies"],
        disallow: ["/api/"],
      },
    ],
    sitemap: `${getBaseUrl()}/sitemap.xml`,
  };
}
