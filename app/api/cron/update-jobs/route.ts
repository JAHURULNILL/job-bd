import { NextRequest, NextResponse } from "next/server";

import { getEnv } from "@/lib/env";
import { runJobSync } from "@/lib/jobs/scraper";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isAuthorized(request: NextRequest) {
  const env = getEnv();
  const authHeader = request.headers.get("authorization");
  const headerSecret = request.headers.get("x-cron-secret");

  if (!env.CRON_SECRET) {
    return false;
  }

  return (
    authHeader === `Bearer ${env.CRON_SECRET}` ||
    headerSecret === env.CRON_SECRET
  );
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runJobSync();
    return NextResponse.json({
      ok: true,
      ranAt: new Date().toISOString(),
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown cron execution error";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
