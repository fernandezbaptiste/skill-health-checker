"use client";

import type { ReviewResult } from "@/lib/types";
import { ScoreSummary } from "./ScoreSummary";
import { ValidationChecks } from "./ValidationChecks";
import { JudgeEvaluation } from "./JudgeEvaluation";
import { ImprovePanel } from "./ImprovePanel";

interface ReviewResultsProps {
  data: ReviewResult;
}

export function ReviewResults({ data }: ReviewResultsProps) {
  return (
    <div className="w-full space-y-6">
      <ScoreSummary score={data.averageScore} />

      <div className="w-full rounded-lg border border-border bg-card p-4 space-y-5">
        <ValidationChecks
          checks={data.validationChecks}
          summary={data.validationSummary}
        />

        <div className="border-t border-border" />

        <JudgeEvaluation categories={data.judgeCategories} />
      </div>

      <ImprovePanel data={data} />
    </div>
  );
}
