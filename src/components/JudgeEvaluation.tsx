"use client";

import { useState } from "react";
import type { JudgeCategory } from "@/lib/types";

interface JudgeEvaluationProps {
  categories: JudgeCategory[];
}

function getBarColor(percentage: number): string {
  if (percentage >= 80) return "bg-success";
  if (percentage >= 50) return "bg-warning";
  return "bg-error";
}

function CategoryCard({ category, index }: { category: JudgeCategory; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left group"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-foreground">
            {category.name}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-muted">
              {category.percentage}%
            </span>
            <span className="text-muted/50 text-xs group-hover:text-muted transition-colors">
              {expanded ? "\u25B2" : "\u25BC"}
            </span>
          </div>
        </div>
        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full animate-fill-bar ${getBarColor(category.percentage)}`}
            style={{ width: `${category.percentage}%`, animationDelay: `${0.3 + index * 0.1}s` }}
          />
        </div>
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 pl-2 border-l border-border ml-1">
          {category.criteria.map((criterion) => (
            <div key={criterion.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground/80">
                  {criterion.name}
                </span>
                <span className="text-xs font-mono text-muted">
                  {criterion.score}/{criterion.maxScore}
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {criterion.explanation}
              </p>
            </div>
          ))}
          {category.assessment && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted/80 italic leading-relaxed">
                {category.assessment}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function JudgeEvaluation({ categories }: JudgeEvaluationProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-foreground animate-fade-in" style={{ animationDelay: "0.15s" }}>
        Judge Evaluation
      </h3>
      {categories.map((cat, i) => (
        <CategoryCard key={cat.name} category={cat} index={i} />
      ))}
    </div>
  );
}
