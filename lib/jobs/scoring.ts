type ScoreInput = {
  trustedSource: boolean;
  trustedApplyUrl: boolean;
  educationMatched: number;
  educationDisallowed: number;
  experienceMatched: number;
  experienceDisallowed: number;
  hasValidDeadline: boolean;
};

export function calculateConfidenceScore(input: ScoreInput) {
  let score = 0;

  if (input.trustedSource) {
    score += 30;
  }

  if (input.trustedApplyUrl) {
    score += 15;
  }

  if (input.educationMatched > 0) {
    score += 20;
  } else {
    score -= 30;
  }

  if (input.experienceMatched > 0) {
    score += 20;
  } else {
    score -= 25;
  }

  if (input.hasValidDeadline) {
    score += 15;
  } else {
    score -= 20;
  }

  score -= input.educationDisallowed * 40;
  score -= input.experienceDisallowed * 35;

  return Math.max(0, Math.min(100, score));
}
