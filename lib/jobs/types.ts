export type JobStatus = "active" | "expired" | "rejected";
export type VerificationStatus = "verified" | "pending" | "rejected";
export type SourceChannel = "career" | "verified-board";

export type JobRecord = {
  _id?: string;
  title: string;
  company: string;
  companySlug: string;
  companyType: string;
  location: string;
  education: string[];
  experience: string[];
  deadline: Date;
  salary?: string | null;
  jobType?: string | null;
  sourceUrl: string;
  applyUrl: string;
  sourceName: string;
  sourceId: string;
  sourceChannel: SourceChannel;
  summaryBn: string;
  applyRulesBn: string;
  rawTextHash: string;
  confidenceScore: number;
  verificationStatus: VerificationStatus;
  slug: string;
  status: JobStatus;
  rejectionReasons: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type ScrapedJobCandidate = {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  applyUrl?: string;
  title: string;
  company: string;
  companyType?: string;
  location?: string;
  educationText?: string;
  experienceText?: string;
  deadlineText?: string;
  salary?: string;
  jobType?: string;
  rawText: string;
  fetchedAt: string;
};

export type SourceAdapterId =
  | "pathaoWordPress"
  | "genericOfficialCareer"
  | "govtPortalTable"
  | "landingOnly";

export type SourceRegistryEntry = {
  id: string;
  company: string;
  companySlug: string;
  companyType: string;
  sourceName: string;
  sourceChannel: SourceChannel;
  homeUrl: string;
  careersUrl: string;
  listingUrl: string;
  adapter: SourceAdapterId;
  crawlMode: "html" | "browser" | "landing";
  allowHosts: string[];
  allowedApplyHosts?: string[];
  enabled: boolean;
  official: boolean;
  trusted: boolean;
  sectors: string[];
  lastVerifiedAt: string;
  notes?: string;
};

export type SyncRunSummary = {
  crawledSources: number;
  totalCandidates: number;
  activeJobs: number;
  rejectedJobs: number;
  expiredJobs: number;
  errors: string[];
};
