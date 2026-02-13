export interface ValidationCheck {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

export interface JudgeCriterion {
  name: string;
  score: number;
  maxScore: number;
  explanation: string;
}

export interface JudgeCategory {
  name: string;
  percentage: number;
  criteria: JudgeCriterion[];
  assessment: string;
}

export interface ReviewResult {
  validationChecks: ValidationCheck[];
  validationSummary: {
    passed: boolean;
    errors: number;
    warnings: number;
  };
  judgeCategories: JudgeCategory[];
  averageScore: number;
  raw: string;
}

export interface ReviewRequest {
  url: string;
  skill?: string;
}

export interface ReviewError {
  type: "validation" | "not_found" | "timeout" | "skill_not_specified" | "server";
  message: string;
  availableSkills?: string[];
}

export type ReviewResponse =
  | { success: true; data: ReviewResult }
  | { success: false; error: ReviewError };
