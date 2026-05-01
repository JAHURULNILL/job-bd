import {
  InferSchemaType,
  model,
  models,
  Schema,
} from "mongoose";

const JobSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    companySlug: { type: String, required: true, trim: true, index: true },
    companyType: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    education: [{ type: String, trim: true }],
    experience: [{ type: String, trim: true }],
    deadline: { type: Date, required: true, index: true },
    salary: { type: String, default: null },
    jobType: { type: String, default: null },
    sourceUrl: { type: String, required: true, trim: true, index: true },
    applyUrl: { type: String, required: true, trim: true },
    sourceName: { type: String, required: true, trim: true },
    sourceId: { type: String, required: true, trim: true, index: true },
    sourceChannel: {
      type: String,
      enum: ["career", "verified-board"],
      required: true,
      index: true,
    },
    summaryBn: { type: String, required: true, trim: true },
    applyRulesBn: { type: String, required: true, trim: true },
    rawTextHash: { type: String, required: true, trim: true, index: true },
    confidenceScore: { type: Number, required: true, min: 0, max: 100 },
    verificationStatus: {
      type: String,
      enum: ["verified", "pending", "rejected"],
      required: true,
      index: true,
    },
    slug: { type: String, required: true, trim: true, unique: true },
    status: {
      type: String,
      enum: ["active", "expired", "rejected"],
      required: true,
      index: true,
    },
    rejectionReasons: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
  },
);

JobSchema.index({ status: 1, deadline: 1 });
JobSchema.index({ companySlug: 1, status: 1, deadline: 1 });

export type JobDocument = InferSchemaType<typeof JobSchema>;

export const JobModel = models.Job || model("Job", JobSchema);
