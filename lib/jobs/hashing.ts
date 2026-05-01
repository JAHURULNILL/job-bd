import { createHash } from "node:crypto";

export function createRawTextHash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function shortHash(value: string) {
  return createRawTextHash(value).slice(0, 8);
}
