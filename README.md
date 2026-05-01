# HSC Jobs BD

A production-focused Next.js job board for Bangladesh that publishes only verified SSC/HSC pass and no-experience jobs from trusted sources.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MongoDB Atlas
- Mongoose
- Axios + Cheerio
- Vercel
- Vercel Cron

## Core Rules

- No demo jobs
- No fake jobs
- No login, registration, or admin approval flow
- No manual daily updating
- Every public job must have:
  - trusted source
  - official or source-approved apply link
  - clear SSC/HSC or equivalent eligibility
  - clear fresher/no-experience eligibility
  - confidence score `>= 85`

## Source System

Verified source registry lives in [lib/jobs/source-registry.ts](./lib/jobs/source-registry.ts).

- Active verified sources start with official career pages such as Pathao, BRAC, Grameenphone, Unilever Bangladesh, bKash, and Nestlé Bangladesh.
- Browser-protected or unclear sources stay in landing-only mode until a safer parser is added.
- New sources must be verified before enabling. Comments are included in the registry file showing exactly where to add them.

## Data Model

The Mongoose model is in [models/Job.ts](./models/Job.ts).

Stored fields include:

- `title`
- `company`
- `companyType`
- `location`
- `education`
- `experience`
- `deadline`
- `salary`
- `jobType`
- `sourceUrl`
- `applyUrl`
- `sourceName`
- `summaryBn`
- `applyRulesBn`
- `rawTextHash`
- `confidenceScore`
- `verificationStatus`
- `slug`
- `status`

## Scraper Architecture

Key files:

- [lib/jobs/scraper.ts](./lib/jobs/scraper.ts): sync pipeline and upsert logic
- [lib/jobs/fetcher.ts](./lib/jobs/fetcher.ts): respectful fetching with robots.txt checks and crawl delay
- [lib/jobs/filters.ts](./lib/jobs/filters.ts): eligibility rules
- [lib/jobs/scoring.ts](./lib/jobs/scoring.ts): confidence scoring
- [lib/jobs/source-adapters/pathao.ts](./lib/jobs/source-adapters/pathao.ts): working official source parser
- [lib/jobs/source-adapters/generic-official-career.ts](./lib/jobs/source-adapters/generic-official-career.ts): generic same-domain parser

## Cron Route

Protected route:

- `GET /api/cron/update-jobs`

Authentication:

- `Authorization: Bearer <CRON_SECRET>`
- or `x-cron-secret: <CRON_SECRET>`

Cron behavior:

1. Fetch enabled trusted sources
2. Parse job pages
3. Extract title, company, location, deadline, education, experience, apply link
4. Reject unclear eligibility
5. Reject higher-degree or experienced roles
6. Dedupe using `sourceUrl`, `applyUrl`, and `rawTextHash`
7. Upsert active and rejected records
8. Mark expired active jobs as `expired`

`vercel.json` is included with a daily cron schedule at `00:30 UTC`, which is `06:30` Bangladesh time.

## Environment Variables

Copy [.env.example](./.env.example) to `.env.local` and set:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `CRON_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `SCRAPE_USER_AGENT`
- `SCRAPE_TIMEOUT_MS`
- `SCRAPE_DELAY_MS`
- `MAX_SCRAPE_CONCURRENCY`

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
```

Or run everything:

```bash
npm run check
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster.
2. Create a database user and network access rule for Vercel.
3. Copy the connection string into `MONGODB_URI`.
4. Set `MONGODB_DB_NAME=hsc-jobs-bd`.

## Vercel Deployment

1. Push the project to GitHub.
2. Import the repo into Vercel.
3. Add all environment variables from `.env.example`.
4. Confirm the cron is enabled from `vercel.json`.
5. Set your production domain in `NEXT_PUBLIC_SITE_URL`.
6. Trigger the cron route once manually with the secret header to populate jobs.

Example manual request:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-domain.com/api/cron/update-jobs
```

## Notes

- If no trusted jobs match the strict rules, the site shows a clean empty state by design.
- Full copyrighted circular text is not stored. Only structured summary data and source links are saved.
- This project is intentionally conservative: if eligibility is unclear, the job is rejected.
