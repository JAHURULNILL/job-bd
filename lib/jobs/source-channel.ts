import type { SourceChannel } from "@/lib/jobs/types";

export function getSourceChannelLabel(channel: SourceChannel) {
  return channel === "career" ? "Career Source" : "Other Verified Source";
}

export function getSourceChannelLabelBn(channel: SourceChannel) {
  return channel === "career"
    ? "Career Source"
    : "Other Verified Source";
}
